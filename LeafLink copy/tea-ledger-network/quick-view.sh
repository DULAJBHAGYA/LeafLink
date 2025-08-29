#!/bin/bash

# Quick View Script - Simple blockchain data viewer

echo "🍃 Tea Ledger Network - Quick Data View"
echo "======================================"

# Set environment variables
export FABRIC_CFG_PATH=$PWD/../config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

echo ""
echo "🌱 FARMERS:"
echo "-----------"
for i in {1..10}; do
    if [[ $i -eq 1 ]]; then
        ./net-tln.sh invoke query "FARM001" 2>/dev/null | grep -E '"name"|"location"' || echo "FARM001: Not found"
    else
        ./net-tln.sh invoke query "FARM00$i" 2>/dev/null | grep -E '"name"|"location"' || echo "FARM00$i: Not found"
    fi
done

echo ""
echo "🚚 TRANSPORTERS:"
echo "---------------"
for i in {1..5}; do
    ./net-tln.sh invoke query "TRANS00$i" 2>/dev/null | grep -E '"name"' || echo "TRANS00$i: Not found"
done

echo ""
echo "🛒 BUYERS:"
echo "----------"
for i in {1..5}; do
    ./net-tln.sh invoke query "BUY00$i" 2>/dev/null | grep -E '"name"' || echo "BUY00$i: Not found"
done

echo ""
echo "🍃 TEA BATCHES:"
echo "---------------"
for i in {1..10}; do
    if [[ $i -eq 1 ]]; then
        ./net-tln.sh invoke query "TEA001" 2>/dev/null | grep -E '"variety"|"quantity"|"currentOwnerType"' || echo "TEA001: Not found"
    else
        ./net-tln.sh invoke query "TEA00$i" 2>/dev/null | grep -E '"variety"|"quantity"|"currentOwnerType"' || echo "TEA00$i: Not found"
    fi
done

echo ""
echo "📊 COMPLETE ENTITIES:"
echo "===================="

echo ""
echo "✅ Complete Tea Batch (TEA007):"
./net-tln.sh invoke query "TEA007" 2>/dev/null | jq '.' 2>/dev/null || ./net-tln.sh invoke query "TEA007" 2>/dev/null

echo ""
echo "✅ Sample Farmer (FARM007):"
./net-tln.sh invoke query "FARM007" 2>/dev/null | jq '.' 2>/dev/null || ./net-tln.sh invoke query "FARM007" 2>/dev/null

echo ""
echo "✅ Sample Buyer (BUY003):"
./net-tln.sh invoke query "BUY003" 2>/dev/null | jq '.' 2>/dev/null || ./net-tln.sh invoke query "BUY003" 2>/dev/null

echo ""
echo "🔍 USEFUL COMMANDS:"
echo "=================="
echo "View all data: ./view-all-data.sh"
echo "Query specific: ./net-tln.sh invoke query <ID>"
echo "View history: ./net-tln.sh invoke queryHistory <ID>" 