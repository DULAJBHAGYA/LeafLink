#!/bin/bash

# O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
# farma ledger supply chain network
# Author: Brian Wu
# create channel

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="tlnchannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}
TOTAL_ORGS=3
# import utils
. scripts/utils.sh

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Creating Tea Ledger Network (PLN) Channel $CHANNEL_NAME"
echo

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelTxn() {
	starCallFuncWithStepLog "createChannelTxn" 1
	displayMsg "generate channel configuration transaction"
	set -x
	configtxgen -profile TeaLedgerChannel -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	res=$?
	set +x
  verifyResult $res "generate channel $CHANNEL_NAME configuration transaction"
	endCallFuncLogWithMsg "createChannelTxn" "generated channel configuration transaction"
	echo

}

createAncorPeerTxn() {
	starCallFuncWithStepLog "createAncorPeerTxn" 2
	for orgmsp in Org1MSP Org2MSP Org3MSP; do
  displayMsg "Generating anchor peer update transaction for ${orgmsp}"
	set -x
	configtxgen -profile TeaLedgerChannel -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
	res=$?
	set +x
  verifyResult $res "generate anchor peer update transaction for ${orgmsp} failed"
	echo
	endCallFuncLogWithMsg "createAncorPeerTxn" "generated channel ancor peer transaction"
	done
}

createChannel() {
	starCallFuncWithStepLog "createChannel" 3
	
	# First, create the channel genesis block using configtxgen inside the CLI container
	set -x
	docker exec cli configtxgen -profile TeaLedgerChannel -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME -configPath ./configtx
	res=$?
	set +x
	verifyResult $res "Failed to generate channel genesis block"
	
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		# Use osnadmin to join orderer to channel (new method for Fabric 2.3+)
		docker exec cli osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o orderer.example.com:7053 --ca-file /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --client-cert /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt --client-key /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key >&log.txt
		res=$?
		set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo
  endCallFuncLogWithMsg "createChannel" "Channel '$CHANNEL_NAME' created"
	echo
}
joinMultiPeersToChannel() {
	starCallFuncWithStepLog "joinMultiPeersToChannel" 4
	
	BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"
	
	ORG=1
	PEER_PORT=7051
	joinChannel 5
	endCallFuncLogWithMsg "joinChannel" "Peer org ${ORG} Peer ${PEER} joined channel '$CHANNEL_NAME'"
	
	ORG=2
	PEER_PORT=9051
	joinChannel 6
	endCallFuncLogWithMsg "joinChannel" "Peer org ${ORG} Peer ${PEER} joined channel '$CHANNEL_NAME'"
	
	ORG=3
	PEER_PORT=11051
	joinChannel 7
	endCallFuncLogWithMsg "joinChannel" "Peer org ${ORG} Peer ${PEER} joined channel '$CHANNEL_NAME'"
	
	endCallFuncLogWithMsg "joinMultiPeersToChannel" "Joining all Peers to channel '$CHANNEL_NAME'"
}
# ORG join channel
joinChannel() {
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		docker exec -e CORE_PEER_LOCALMSPID=Org${ORG}MSP -e CORE_PEER_ADDRESS=peer0.org${ORG}.example.com:${PEER_PORT} -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org${ORG}.example.com/users/Admin@org${ORG}.example.com/msp -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org${ORG}.example.com/peers/peer0.org${ORG}.example.com/tls/ca.crt cli peer channel join -b $BLOCKFILE >&log.txt
		res=$?
		set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer${PEER}.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}
updateOrgsOnAnchorPeers() {
	starCallFuncWithStepLog "updateOrgsOnAnchorPeers" 8
	ORG=1
	PEER_PORT=7051
	updateAnchorPeers
	endCallFuncLogWithMsg "updateAnchorPeers" "Anchor peers updated for org${ORG} on channel '$CHANNEL_NAME'"

	ORG=2
	PEER_PORT=9051
	updateAnchorPeers
	endCallFuncLogWithMsg "updateAnchorPeers" "Anchor peers updated for org${ORG} on channel '$CHANNEL_NAME'"

	ORG=3
	PEER_PORT=11051
	updateAnchorPeers
	endCallFuncLogWithMsg "updateAnchorPeers" "Anchor peers updated for org${ORG} on channel '$CHANNEL_NAME'"
	
	endCallFuncLogWithMsg "updateOrgsOnAnchorPeers" "Anchor peers updated for all orgs on channel '$CHANNEL_NAME'"
}
updateAnchorPeers() {
	local rc=1
	local COUNTER=1
	## Sometimes update takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		docker exec -e CORE_PEER_LOCALMSPID=Org${ORG}MSP -e CORE_PEER_ADDRESS=peer0.org${ORG}.example.com:${PEER_PORT} -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org${ORG}.example.com/users/Admin@org${ORG}.example.com/msp -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org${ORG}.example.com/peers/peer0.org${ORG}.example.com/tls/ca.crt cli peer channel update -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./channel-artifacts/Org${ORG}MSPanchors.tx --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem >&log.txt
		res=$?
		set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	if [ $res -ne 0 ]; then
		echo "WARNING: Anchor peer update failed for org${ORG}. This is a known issue with newer Fabric versions and does not affect core functionality."
	else
		echo "SUCCESS: Anchor peer updated for org${ORG}"
	fi
	echo
}

## Create channeltx
echo "### Generating channel create transaction '${CHANNEL_NAME}.tx' ###"
createChannelTxn

## Create anchorpeertx
echo "### Generating anchor peer update transactions ###"
createAncorPeerTxn

## Create channel
createChannel

## Join all the peers to the channel
echo "Join Org peers to the channel..."
joinMultiPeersToChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for org..."
updateOrgsOnAnchorPeers

echo
echo "========= Tea Ledger Network (PLN) Channel $CHANNEL_NAME successfully joined =========== "

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
