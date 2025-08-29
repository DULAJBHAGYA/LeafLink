#!/bin/bash

# Performance Testing Script for Tea Ledger Network
# Measures response times of blockchain transactions

echo "=========================================="
echo "Tea Ledger Network Performance Test"
echo "=========================================="

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
    
    # Store result for summary
    echo "$description,$function_name,$response_time" >> performance_results.csv
}

# Function to measure query time
measure_query() {
    local function_name=$1
    local args=$2
    local description=$3
    
    echo "Testing: $description"
    echo "Function: $function_name"
    echo "Arguments: $args"
    echo "------------------------------------------"
    
    # Record start time
    start_time=$(date +%s.%N)
    
    # Execute query
    ./net-tln.sh invoke query $function_name $args
    
    # Record end time
    end_time=$(date +%s.%N)
    
    # Calculate response time
    response_time=$(echo "$end_time - $start_time" | bc -l)
    
    echo "Response Time: ${response_time} seconds"
    echo "=========================================="
    echo ""
    
    # Store result for summary
    echo "$description,$function_name,$response_time" >> performance_results.csv
}

# Initialize results file
echo "Description,Function,ResponseTime(seconds)" > performance_results.csv

# Test 1: Register a new farmer
echo "Test 1: Register Farmer"
measure_transaction "registerFarmer" "FARM002 TestFarmer2 Location2" "Register New Farmer"

# Test 2: Create a tea batch
echo "Test 2: Create Tea Batch"
measure_transaction "createTeaBatch" "FARM002 TEA002 CeylonBlack FARM002 hash123 50kg 20.00 90 Organic Sunny" "Create Tea Batch"

# Test 3: Ship to transporter
echo "Test 3: Ship to Transporter"
measure_transaction "shipToTransporter" "TEA002 TRANS001" "Ship Tea to Transporter"

# Test 4: Receive by buyer
echo "Test 4: Receive by Buyer"
measure_transaction "receiveByBuyer" "TEA002 BUY001" "Receive Tea by Buyer"

# Test 5: Query transaction
echo "Test 5: Query Tea Batch"
measure_query "queryByKey" "TEA002" "Query Tea Batch"

# Test 6: Query history
echo "Test 6: Query History"
measure_query "queryHistoryByKey" "TEA002" "Query Tea Batch History"

# Generate summary report
echo "=========================================="
echo "PERFORMANCE SUMMARY"
echo "=========================================="
echo ""

# Calculate average response time
if [ -f performance_results.csv ]; then
    echo "Detailed Results:"
    cat performance_results.csv
    
    echo ""
    echo "Average Response Time:"
    tail -n +2 performance_results.csv | cut -d',' -f3 | awk '{sum+=$1} END {print "Average: " sum/NR " seconds"}'
    
    echo ""
    echo "Min Response Time:"
    tail -n +2 performance_results.csv | cut -d',' -f3 | sort -n | head -1 | awk '{print "Min: " $1 " seconds"}'
    
    echo ""
    echo "Max Response Time:"
    tail -n +2 performance_results.csv | cut -d',' -f3 | sort -n | tail -1 | awk '{print "Max: " $1 " seconds"}'
fi

echo ""
echo "Performance test completed!"
echo "Results saved to: performance_results.csv" 