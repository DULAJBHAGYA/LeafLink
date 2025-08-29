#!/bin/bash

# O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
# farma ledger supply chain network
# Author: Brian Wu
# invoke smart contract
CHANNEL_NAME=tlnchannel
CC_SRC_LANGUAGE=javascript
VERSION=1
DELAY=3
MAX_RETRY=5
VERBOSE=true
CHINCODE_NAME="pharmaLedgerContract"
FABRIC_CFG_PATH=$PWD/../config/

farmer=""
equipmentNumber=""
equipmentName=""
ownerName=""

# import utils
. scripts/utils.sh

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "chaincodeInvokeInit" 1
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c '{"function":"instantiate","Args":[]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "chaincodeInvokeInit" "Invoke transaction successful"
  echo
}
invokeMakeEquipment() {
  parsePeerConnectionParameters $@
  echo "invokeMakeEquipment--> farmer:$farmer, equipmentNumber:$equipmentNumber, equipmentName: $equipmentName,ownerName:$ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeMakeEquipment" 2
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c '{"function":"makeEquipment","Args":["'$farmer'","'$equipmentNumber'", "'$equipmentName'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeMakeEquipment" "Invoke transaction successful"
  echo
}
invokeWholesalerDistribute() {
  parsePeerConnectionParameters $@
  echo "invokeWolesalerDistribute--> equipmentNumber: $equipmentNumber, - ownerName: $ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeShipToWholesaler" 3
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c '{"function":"transporterDistribute","Args":[ "'$equipmentNumber'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeWolesalerDistribute" "Invoke transaction successful"
  echo
}
invokeTeacyReceived() {
  parsePeerConnectionParameters $@
  echo "invokeTeacyReceived--> equipmentNumber: $equipmentNumber, - ownerName: $ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeTeacyReceived" 4
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c '{"function":"buyerReceived","Args":["'$equipmentNumber'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeTeacyReceived" "Invoke transaction successful"
  echo
}

registerUser() {
  parsePeerConnectionParameters $@
  echo "registerUser--> name:$name, role:$role"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "registerUser" 5
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"registerUser\",\"Args\":[\"$name\",\"$role\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "registerUser" "Invoke transaction successful"
  echo
}

registerFarmer() {
  parsePeerConnectionParameters $@
  echo "registerFarmer--> farmer:$farmer"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "registerFarmer" 5
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"registerFarmer\",\"Args\":[\"$farmer\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "registerFarmer" "Invoke transaction successful"
  echo
}

registerTransporter() {
  parsePeerConnectionParameters $@
  echo "registerTransporter--> transporter:$transporter"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "registerTransporter" 6
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"registerTransporter\",\"Args\":[\"$transporter\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "registerTransporter" "Invoke transaction successful"
  echo
}

registerBuyer() {
  parsePeerConnectionParameters $@
  echo "registerBuyer--> buyer:$buyer"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "registerBuyer" 7
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"registerBuyer\",\"Args\":[\"$buyer\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "registerBuyer" "Invoke transaction successful"
  echo
}
chaincodeQuery() {
  ORG=$1
  QUERY_KEY=$2
  setGlobalVars $ORG
  callStartLog "chaincodeQuery $QUERY_KEY"
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryByKey","Args":["'$QUERY_KEY'"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  verifyResult $res " Query result on peer0.org${ORG} is INVALID"
  endCallFuncLogWithMsg "chaincodeQuery" "Query successful"
}
chaincodeQueryHistory() {
  ORG=$1
  QUERY_KEY=$2
  setGlobalVars $ORG
  callStartLog "chaincodeQueryHistory"
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryHistoryByKey","Args":["'$QUERY_KEY'"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  verifyResult $res " Query History result on peer0.org${ORG} is INVALID"
  endCallFuncLogWithMsg "chaincodeQuery" "Query History successful"
}

createTeaBatch() {
  parsePeerConnectionParameters $@
  echo "createTeaBatch--> teabatch:$teabatch"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "createTeaBatch" 8
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"createTeaBatch\",\"Args\":[\"$teabatch\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "createTeaBatch" "Invoke transaction successful"
  echo
}

shipToTransporter() {
  parsePeerConnectionParameters $@
  echo "shipToTransporter--> ship:$ship"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "shipToTransporter" 9
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"shipToTransporter\",\"Args\":[\"$ship\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "shipToTransporter" "Invoke transaction successful"
  echo
}

receiveByBuyer() {
  parsePeerConnectionParameters $@
  echo "receiveByBuyer--> receive:$receive"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "receiveByBuyer" 10
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"receiveByBuyer\",\"Args\":[\"$receive\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "receiveByBuyer" "Invoke transaction successful"
  echo
}

placeBid() {
  parsePeerConnectionParameters $@
  echo "placeBid--> bid:$bid"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters"
  starCallFuncWithStepLog "placeBid" 11
  set -x
  docker exec cli peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"placeBid\",\"Args\":[\"$bid\"]}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed"
  endCallFuncLogWithMsg "placeBid" "Invoke transaction successful"
  echo
}

awardTeaBatchToHighestBidder() {
    parsePeerConnectionParameters $@
    echo "awardTeaBatchToHighestBidder--> batchId:$batchId, farmerId:$farmerId"
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters"
    starCallFuncWithStepLog "awardTeaBatchToHighestBidder" 12
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"awardTeaBatchToHighestBidder\",\"Args\":[\"$batchId\",\"$farmerId\"]}" >&log.txt
    res=$?
    set +x
    cat log.txt
    verifyResult $res "Invoke execution on $PEERS failed"
    endCallFuncLogWithMsg "awardTeaBatchToHighestBidder" "Invoke transaction successful"
    echo
}

queryBidsForBatch() {
    ORG=$1
    setGlobalVars $ORG
    callStartLog "queryBidsForBatch"
    local rc=1
    local COUNTER=1
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
        sleep $DELAY
        echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
        set -x
        docker exec cli peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c "{\"function\":\"queryBidsForBatch\",\"Args\":[]}" >&log.txt
        res=$?
        set +x
        let rc=$res
        COUNTER=$(expr $COUNTER + 1)
    done
    echo
    cat log.txt
    verifyResult $res " Query Bids For Batch result on peer0.org${ORG} is INVALID"
    endCallFuncLogWithMsg "queryBidsForBatch" "Query Bids For Batch successful"
}

assignTransporter() {
    parsePeerConnectionParameters $@
    echo "assignTransporter--> batchId:$batchId, buyerId:$buyerId, transporterId:$transporterId"
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters"
    starCallFuncWithStepLog "assignTransporter" 13
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"assignTransporter\",\"Args\":[\"$batchId\",\"$buyerId\",\"$transporterId\"]}" >&log.txt
    res=$?
    set -x
    cat log.txt
    verifyResult $res "Invoke execution on $PEERS failed"
    endCallFuncLogWithMsg "assignTransporter" "Invoke transaction successful"
    echo
}

confirmDelivery() {
    parsePeerConnectionParameters $@
    echo "confirmDelivery--> batchId:$batchId, transporterId:$transporterId"
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters"
    starCallFuncWithStepLog "confirmDelivery" 14
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"confirmDelivery\",\"Args\":[\"$batchId\",\"$transporterId\"]}" >&log.txt
    res=$?
    set -x
    cat log.txt
    verifyResult $res "Invoke execution on $PEERS failed"
    endCallFuncLogWithMsg "confirmDelivery" "Invoke transaction successful"
    echo
}

queryAllTeaBatches() {
    ORG=$1
    setGlobalVars $ORG
    callStartLog "queryAllTeaBatches"
    local rc=1
    local COUNTER=1
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
        sleep $DELAY
        set -x
        docker exec cli peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryAllTeaBatches","Args":[]}' >&log.txt
        res=$?
        set +x
        let rc=$res
        COUNTER=$(expr $COUNTER + 1)
    done
    cat log.txt
    verifyResult $res " Query All Tea Batches result on peer0.org${ORG} is INVALID"
    endCallFuncLogWithMsg "queryAllTeaBatches" "Query All Tea Batches successful"
}

queryAll() {
    ORG=$1
    setGlobalVars $ORG
    callStartLog "queryAll"
    local rc=1
    local COUNTER=1
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
        sleep $DELAY
        echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
        set -x
        docker exec cli peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryAll","Args":[]}' >&log.txt
        res=$?
        set +x
        let rc=$res
        COUNTER=$(expr $COUNTER + 1)
    done
    echo
    cat log.txt
    verifyResult $res " Query All result on peer0.org${ORG} is INVALID"
    endCallFuncLogWithMsg "queryAll" "Query All successful"
}
deleteTeaBatch() {
    parsePeerConnectionParameters $@
    echo "deleteTeaBatch--> batchId:$batchId"
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters"
    starCallFuncWithStepLog "deleteTeaBatch" 15
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CHINCODE_NAME} "${PEER_CONN_PARMS[@]}" -c "{\"function\":\"deleteTeaBatch\",\"Args\":[\"$batchId\"]}" >&log.txt
    res=$?
    set +x
    cat log.txt
    verifyResult $res "Invoke execution on $PEERS failed"
    endCallFuncLogWithMsg "deleteTeaBatch" "Invoke transaction successful"
    echo
}
queryAllTransporters() {
    ORG=$1
    setGlobalVars $ORG
    callStartLog "queryAllTransporters"
    local rc=1
    local COUNTER=1
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
        sleep $DELAY
        echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
        set -x
        docker exec cli peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryAllTransporters","Args":[]}' >&log.txt
        res=$?
        set +x
        let rc=$res
        COUNTER=$(expr $COUNTER + 1)
    done
    echo
    cat log.txt
    verifyResult $res " Query All Transporters result on peer0.org${ORG} is INVALID"
    endCallFuncLogWithMsg "queryAllTransporters" "Query All Transporters successful"
}
## Invoke the chaincode
#chaincodeInvokeInit 1 2 3

#sleep 10
#chaincodeQuery 1

#invokeMakeEquipment 1 2 3
#sleep 10
#chaincodeQuery 1

#invokeWolesalerDistribute 1 2 3
#sleep 10
#chaincodeQuery 1

#invokeTeacyReceived 1 2 3
#sleep 10

#chaincodeQuery 1

#chaincodeQueryHistory 1
# Query chaincode on peer0.org1

function printHelp() {
  echo "Usage: "
  echo "  invokeContract.sh <Mode>"
  echo "    <Mode>"
  echo "      - 'init' - invoke chaincodeInvokeInit"
  echo "      - 'query' - query ledger record"
  echo "      - 'queryHistory' - query ledger history records"
  echo "      - 'equipment' - invoke invokeMakeEquipment"
  echo "      - 'wolesaler' - invoke invokeWolesalerDistribute"
  echo "      - 'buyer' - invoke invokeTeacyReceived"
  echo "      - 'register' - register a new user (name, role)"
  echo "      - 'createTeaBatch' - create a tea batch (teabatch)"
  echo "      - 'shipToTransporter' - ship a tea batch to a transporter (ship)"
  echo "      - 'receiveByBuyer' - receive a tea batch by a buyer (receive)"
  echo "      - 'placeBid' - place a bid on a tea batch (bid)"
  echo "      - 'queryAll' - query all assets on the ledger"
  echo "      - 'queryAllTeaBatches' - query all tea batches on the ledger"
  echo "      - 'awardTeaBatch' - award a tea batch to the highest bidder (award)"
  echo "      - 'queryBids' - query all bids on the ledger"
  echo "      - 'assignTransporter' - assign a transporter to a tea batch (assign)"
  echo "      - 'confirmDelivery' - confirm delivery of a tea batch (confirm)"
  echo "      - 'deleteTeaBatch' - delete a tea batch (batchId)"
  echo "      - 'queryAllTransporters' - query all registered transporters"
  echo
  echo " Examples:"
  echo "  invokeContract.sh init"
  echo "  invokeContract.sh query"
  echo "  invokeContract.sh queryHistory"
  echo "  invokeContract.sh equipment"
  echo "  invokeContract.sh wolesaler"
  echo "  invokeContract.sh buyer"
  echo "  invokeContract.sh register 'GreenField Farms' 'farmer'"
  echo "  invokeContract.sh createTeaBatch encrypted_teabatch_data_string"
  echo "  invokeContract.sh shipToTransporter encrypted_ship_data_string"
  echo "  invokeContract.sh receiveByBuyer encrypted_receive_data_string"
  echo "  invokeContract.sh placeBid encrypted_bid_data_string"
  echo "  invokeContract.sh queryAll"
  echo "  invokeContract.sh queryAllTeaBatches"
  echo "  invokeContract.sh awardTeaBatch encrypted_award_data_string"
  echo "  invokeContract.sh queryBids"
  echo "  invokeContract.sh assignTransporter encrypted_assign_data_string"
  echo "  invokeContract.sh confirmDelivery encrypted_confirm_data_string"
  echo "  invokeContract.sh deleteTeaBatch TEA001"
  echo "  invokeContract.sh queryAllTransporters"
}
## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi


if [ "${MODE}" == "init" ]; then
  chaincodeInvokeInit 1 2 3
elif [ "${MODE}" == "query" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  chaincodeQuery 1 $1
elif [ "${MODE}" == "queryHistory" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  chaincodeQueryHistory 1 $1
elif [ "${MODE}" == "equipment" ]; then
  if [[ $# -ne 4 ]] ; then
    printHelp
    exit 0
  fi
  farmer=$1
  equipmentNumber=$2
  equipmentName=$3
  ownerName=$4
  invokeMakeEquipment 1 2 3
elif [ "${MODE}" == "transporter" ]; then
  if [[ $# -ne 2 ]] ; then
    printHelp
    exit 0
  fi
  equipmentNumber=$1
  ownerName=$2
  invokeWholesalerDistribute 1 2 3
elif [ "${MODE}" == "buyer" ]; then
   if [[ $# -ne 2 ]] ; then
    printHelp
    exit 0
  fi
  equipmentNumber=$1
  ownerName=$2
  invokeTeacyReceived 1 2 3
elif [ "${MODE}" == "register" ]; then
  if [[ $# -ne 2 ]] ; then
    printHelp
    exit 0
  fi
  name=$1
  role=$2
  registerUser 1 2 3
elif [ "${MODE}" == "registerFarmer" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  farmer=$1
  registerFarmer 1
elif [ "${MODE}" == "registerTransporter" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  transporter=$1
  registerTransporter 1
elif [ "${MODE}" == "registerBuyer" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  buyer=$1
  registerBuyer 1
elif [ "${MODE}" == "createTeaBatch" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  teabatch=$1
  createTeaBatch 1
elif [ "${MODE}" == "shipToTransporter" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  ship=$1
  shipToTransporter 1
elif [ "${MODE}" == "receiveByBuyer" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  receive=$1
  receiveByBuyer 1
elif [ "${MODE}" == "placeBid" ]; then
    if [[ $# -ne 1 ]] ; then
        printHelp
        exit 0
    fi
    bid=$1
    placeBid 1
elif [ "${MODE}" == "queryAll" ]; then
    queryAll 1
elif [ "${MODE}" == "queryAllTeaBatches" ]; then
    queryAllTeaBatches 1
elif [ "${MODE}" == "awardTeaBatch" ]; then
    if [[ $# -ne 1 ]] ; then
        printHelp
        exit 0
    fi
    award=$1
    awardTeaBatchToHighestBidder 1
elif [ "${MODE}" == "queryBids" ]; then
    queryBidsForBatch 1
elif [ "${MODE}" == "assignTransporter" ]; then
    if [[ $# -ne 1 ]] ; then
        printHelp
        exit 0
    fi
    assign=$1
    assignTransporter 1
elif [ "${MODE}" == "confirmDelivery" ]; then
    if [[ $# -ne 1 ]] ; then
        printHelp
        exit 0
    fi
    confirm=$1
    confirmDelivery 1
elif [ "${MODE}" == "deleteTeaBatch" ]; then
    if [[ $# -ne 1 ]] ; then
        printHelp
        exit 0
    fi
    batchId=$1
    deleteTeaBatch 1 2 3
elif [ "${MODE}" == "queryAllTransporters" ]; then
    queryAllTransporters 1
else
  printHelp
  exit 1
fi

exit 0
