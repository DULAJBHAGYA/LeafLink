#!/bin/bash

# Test Hybrid PBFT Consensus Performance
# Compares performance between original Raft and hybrid PBFT

echo "=========================================="
echo "Testing Hybrid PBFT Consensus Performance"
echo "=========================================="

# Configuration
CHANNEL_NAME="tlnchannel"
ORIGINAL_CHAINCODE="teasupplychain"
HYBRID_CHAINCODE="teasupplychain-hybrid"

# Function to measure transaction time
measure_transaction() {
    local chaincode_name=$1
    local function_name=$2
    local args=$3
    local description=$4
    
    echo "Testing: $description"
    echo "Chaincode: $chaincode_name"
    echo "Function: $function_name"
    echo "Arguments: $args"
    echo "------------------------------------------"
    
    # Record start time
    start_time=$(date +%s.%N)
    
    # Execute transaction
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n $chaincode_name --peerAddresses localhost:7051 --tlsRootCertFiles organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c "{\"function\":\"$function_name\",\"Args\":[$args]}"
    
    # Record end time
    end_time=$(date +%s.%N)
    
    # Calculate response time
    response_time=$(echo "$end_time - $start_time" | bc -l)
    
    echo "Response Time: ${response_time} seconds"
    echo "=========================================="
    echo ""
    
    # Store result
    echo "$description,$chaincode_name,$response_time" >> hybrid_pbft_results.csv
}

# Function to get consensus metrics
get_consensus_metrics() {
    local chaincode_name=$1
    
    echo "Getting consensus metrics for $chaincode_name..."
    
    peer chaincode query -C $CHANNEL_NAME -n $chaincode_name -c '{"function":"getConsensusMetrics","Args":[]}'
    
    echo ""
}

# Initialize results file
echo "Description,Chaincode,ResponseTime(seconds)" > hybrid_pbft_results.csv

# Set environment variables
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

echo "Testing Original Raft Consensus (Critical Transactions)"
echo "======================================================"

# Test 1: Critical transaction with original Raft
echo "Test 1: receiveByBuyer (Critical) - Original Raft"
measure_transaction $ORIGINAL_CHAINCODE "receiveByBuyer" "\"TEA003\",\"BUY001\"" "Critical Transaction - Original Raft"

# Test 2: Critical transaction with original Raft
echo "Test 2: createTeaBatch (Critical) - Original Raft"
measure_transaction $ORIGINAL_CHAINCODE "createTeaBatch" "\"FARM003\",\"TEA004\",\"CeylonBlack\",\"FARM003\",\"hash789\",\"150kg\",\"50.00\",\"98\",\"Premium\",\"Sunny\"" "Critical Transaction - Original Raft"

echo "Testing Hybrid PBFT Consensus (Critical Transactions)"
echo "====================================================="

# Test 3: Critical transaction with hybrid PBFT
echo "Test 3: receiveByBuyer (Critical) - Hybrid PBFT"
measure_transaction $HYBRID_CHAINCODE "receiveByBuyer" "\"TEA004\",\"BUY001\"" "Critical Transaction - Hybrid PBFT"

# Test 4: Critical transaction with hybrid PBFT
echo "Test 4: createTeaBatch (Critical) - Hybrid PBFT"
measure_transaction $HYBRID_CHAINCODE "createTeaBatch" "\"FARM003\",\"TEA005\",\"CeylonBlack\",\"FARM003\",\"hash101\",\"200kg\",\"75.00\",\"99\",\"Premium\",\"Sunny\"" "Critical Transaction - Hybrid PBFT"

echo "Testing Regular Transactions (Both Consensus)"
echo "============================================="

# Test 5: Regular transaction with original Raft
echo "Test 5: registerFarmer (Regular) - Original Raft"
measure_transaction $ORIGINAL_CHAINCODE "registerFarmer" "\"FARM004\",\"TestFarmer4\",\"Location4\"" "Regular Transaction - Original Raft"

# Test 6: Regular transaction with hybrid PBFT (should use Raft)
echo "Test 6: registerFarmer (Regular) - Hybrid PBFT"
measure_transaction $HYBRID_CHAINCODE "registerFarmer" "\"FARM005\",\"TestFarmer5\",\"Location5\"" "Regular Transaction - Hybrid PBFT"

echo "Getting Consensus Metrics"
echo "========================="

# Get metrics for original chaincode
echo "Original Raft Metrics:"
get_consensus_metrics $ORIGINAL_CHAINCODE

# Get metrics for hybrid chaincode
echo "Hybrid PBFT Metrics:"
get_consensus_metrics $HYBRID_CHAINCODE

echo "Performance Analysis"
echo "==================="

# Calculate performance improvements
if [ -f hybrid_pbft_results.csv ]; then
    echo "Detailed Results:"
    cat hybrid_pbft_results.csv
    
    echo ""
    echo "Performance Comparison:"
    
    # Calculate average response times
    raft_critical_avg=$(tail -n +2 hybrid_pbft_results.csv | grep "Critical.*Original Raft" | cut -d',' -f3 | awk '{sum+=$1} END {print sum/NR}')
    pbft_critical_avg=$(tail -n +2 hybrid_pbft_results.csv | grep "Critical.*Hybrid PBFT" | cut -d',' -f3 | awk '{sum+=$1} END {print sum/NR}')
    raft_regular_avg=$(tail -n +2 hybrid_pbft_results.csv | grep "Regular.*Original Raft" | cut -d',' -f3 | awk '{sum+=$1} END {print sum/NR}')
    pbft_regular_avg=$(tail -n +2 hybrid_pbft_results.csv | grep "Regular.*Hybrid PBFT" | cut -d',' -f3 | awk '{sum+=$1} END {print sum/NR}')
    
    echo "Critical Transactions:"
    echo "  Original Raft Average: ${raft_critical_avg:-N/A} seconds"
    echo "  Hybrid PBFT Average: ${pbft_critical_avg:-N/A} seconds"
    
    if [ ! -z "$raft_critical_avg" ] && [ ! -z "$pbft_critical_avg" ]; then
        improvement=$(echo "($raft_critical_avg - $pbft_critical_avg) / $raft_critical_avg * 100" | bc -l)
        echo "  Performance Improvement: ${improvement}%"
    fi
    
    echo ""
    echo "Regular Transactions:"
    echo "  Original Raft Average: ${raft_regular_avg:-N/A} seconds"
    echo "  Hybrid PBFT Average: ${pbft_regular_avg:-N/A} seconds"
    
    if [ ! -z "$raft_regular_avg" ] && [ ! -z "$pbft_regular_avg" ]; then
        improvement=$(echo "($raft_regular_avg - $pbft_regular_avg) / $raft_regular_avg * 100" | bc -l)
        echo "  Performance Improvement: ${improvement}%"
    fi
fi

echo ""
echo "Hybrid PBFT Benefits:"
echo "====================="
echo "1. Critical transactions use PBFT for enhanced security"
echo "2. Regular transactions use Raft for better performance"
echo "3. Automatic transaction classification based on type and parameters"
echo "4. Byzantine fault tolerance for critical operations"
echo "5. Improved response times for regular transactions"
echo "6. Enhanced security for high-value tea transactions"

echo ""
echo "Test completed! Results saved to: hybrid_pbft_results.csv" 