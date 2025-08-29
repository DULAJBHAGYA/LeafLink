#!/bin/bash

# Simple Hybrid PBFT Test Script
# Tests with fresh data to avoid conflicts

echo "=========================================="
echo "Simple Hybrid PBFT Test"
echo "=========================================="

# Set environment variables
export FABRIC_CFG_PATH=$PWD/../config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Function to measure transaction time
measure_transaction() {
    local function_name=$1
    local args=$2
    local description=$3
    
    echo "Testing: $description"
    echo "Function: $function_name"
    echo "Arguments: $args"
    echo "------------------------------------------"
    
    # Record start time
    start_time=$(date +%s.%N)
    
    # Execute transaction
    ./net-tln.sh invoke $function_name $args
    
    # Record end time
    end_time=$(date +%s.%N)
    
    # Calculate response time
    response_time=$(echo "$end_time - $start_time" | bc -l)
    
    echo "Response Time: ${response_time} seconds"
    echo "=========================================="
    echo ""
    
    # Store result
    echo "$description,$response_time" >> simple_test_results.csv
}

# Initialize results file
echo "Description,ResponseTime(seconds)" > simple_test_results.csv

echo "Testing with fresh data to avoid conflicts..."
echo ""

# Test 1: Register new entities
echo "Test 1: Register new entities"
measure_transaction "registerFarmer" "FARM006 TestFarmer6 Location6" "Register New Farmer"
measure_transaction "registerTransporter" "TRANS002 TestTransporter2" "Register New Transporter"
measure_transaction "registerBuyer" "BUY002 TestBuyer2" "Register New Buyer"

# Test 2: Create new tea batch
echo "Test 2: Create new tea batch"
measure_transaction "createTeaBatch" "FARM006 TEA006 CeylonBlack FARM006 hash999 75kg 35.00 92 Organic Sunny" "Create New Tea Batch"

# Test 3: Ship to transporter
echo "Test 3: Ship to transporter"
measure_transaction "shipToTransporter" "TEA006 TRANS002" "Ship Tea to Transporter"

# Test 4: Receive by buyer
echo "Test 4: Receive by buyer"
measure_transaction "receiveByBuyer" "TEA006 BUY002" "Receive Tea by Buyer"

# Test 5: Query the result
echo "Test 5: Query result"
measure_transaction "query" "TEA006" "Query Tea Batch"

echo "Performance Summary"
echo "=================="

if [ -f simple_test_results.csv ]; then
    echo "Detailed Results:"
    cat simple_test_results.csv
    
    echo ""
    echo "Average Response Time:"
    tail -n +2 simple_test_results.csv | cut -d',' -f2 | awk '{sum+=$1} END {print "Average: " sum/NR " seconds"}'
    
    echo ""
    echo "Min Response Time:"
    tail -n +2 simple_test_results.csv | cut -d',' -f2 | sort -n | head -1 | awk '{print "Min: " $1 " seconds"}'
    
    echo ""
    echo "Max Response Time:"
    tail -n +2 simple_test_results.csv | cut -d',' -f2 | sort -n | tail -1 | awk '{print "Max: " $1 " seconds"}'
fi

echo ""
echo "Test completed! Results saved to: simple_test_results.csv" 