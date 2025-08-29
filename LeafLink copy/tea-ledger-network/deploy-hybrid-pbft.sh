#!/bin/bash

# Deploy Hybrid PBFT Consensus to Tea Ledger Network
# This script integrates hybrid PBFT consensus with existing Hyperledger Fabric network

echo "=========================================="
echo "Deploying Hybrid PBFT Consensus"
echo "=========================================="

# Configuration
HYBRID_VERSION="3"
CHANNEL_NAME="tlnchannel"
CHAINCODE_NAME="teasupplychain-hybrid"
CC_SRC_PATH="organizations/buyer/contract-hybrid/"

# Create hybrid contract directory
echo "Creating hybrid contract directory..."
mkdir -p organizations/buyer/contract-hybrid/
mkdir -p organizations/buyer/contract-hybrid/lib/

# Copy hybrid consensus files
echo "Copying hybrid consensus implementation..."
cp hybrid-pbft-consensus.js organizations/buyer/contract-hybrid/lib/
cp hybrid-consensus-integration.js organizations/buyer/contract-hybrid/lib/

# Create package.json for hybrid contract
cat > organizations/buyer/contract-hybrid/package.json << EOF
{
  "name": "teasupplychain-hybrid",
  "version": "1.0.0",
  "description": "Tea Supply Chain with Hybrid PBFT Consensus",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "hyperledger",
    "fabric",
    "blockchain",
    "pbft",
    "consensus"
  ],
  "author": "Tea Ledger Network",
  "license": "Apache-2.0",
  "dependencies": {
    "fabric-contract-api": "^2.2.0",
    "fabric-shim": "^2.2.0"
  }
}
EOF

# Create index.js for hybrid contract
cat > organizations/buyer/contract-hybrid/index.js << EOF
const HybridConsensusIntegration = require('./lib/hybrid-consensus-integration');

module.exports = HybridConsensusIntegration;
EOF

# Install dependencies
echo "Installing dependencies..."
cd organizations/buyer/contract-hybrid/
npm install
cd ../../..

# Package the hybrid chaincode
echo "Packaging hybrid chaincode..."
peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ${CC_SRC_PATH} --lang node --label ${CHAINCODE_NAME}_${HYBRID_VERSION}

# Install on all peers
echo "Installing hybrid chaincode on all peers..."

# Org1
echo "Installing on Org1..."
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Org2
echo "Installing on Org2..."
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Org3
echo "Installing on Org3..."
export CORE_PEER_LOCALMSPID=Org3MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Query installed chaincodes
echo "Querying installed chaincodes..."
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode queryinstalled

# Get package ID
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep ${CHAINCODE_NAME}_${HYBRID_VERSION} | awk '{print $3}' | sed 's/,//')

echo "Package ID: $PACKAGE_ID"

# Approve for all organizations
echo "Approving chaincode definition for all organizations..."

# Org1 approval
echo "Org1 approval..."
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $HYBRID_VERSION --package-id $PACKAGE_ID --sequence $HYBRID_VERSION

# Org2 approval
echo "Org2 approval..."
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $HYBRID_VERSION --package-id $PACKAGE_ID --sequence $HYBRID_VERSION

# Org3 approval
echo "Org3 approval..."
export CORE_PEER_LOCALMSPID=Org3MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $HYBRID_VERSION --package-id $PACKAGE_ID --sequence $HYBRID_VERSION

# Commit chaincode definition
echo "Committing chaincode definition..."
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --peerAddresses localhost:7051 --tlsRootCertFiles organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt --version $HYBRID_VERSION --sequence $HYBRID_VERSION

echo "=========================================="
echo "Hybrid PBFT Consensus Deployed Successfully!"
echo "=========================================="
echo ""
echo "Chaincode Name: $CHAINCODE_NAME"
echo "Version: $HYBRID_VERSION"
echo "Channel: $CHANNEL_NAME"
echo ""
echo "You can now test the hybrid consensus with:"
echo "./test-hybrid-pbft.sh" 