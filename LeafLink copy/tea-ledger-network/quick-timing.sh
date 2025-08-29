#!/bin/bash

# Quick Response Time Measurement Script
# Usage: ./quick-timing.sh <function_name> <arguments>

if [ $# -lt 2 ]; then
    echo "Usage: $0 <function_name> <arguments...>"
    echo "Example: $0 receiveByBuyer TEA001 BUY001"
    exit 1
fi

function_name=$1
shift
args="$@"

echo "Measuring response time for: $function_name $args"
echo "=========================================="

# Record start time with nanosecond precision
start_time=$(date +%s.%N)

# Execute the transaction
./net-tln.sh invoke $function_name $args

# Record end time
end_time=$(date +%s.%N)

# Calculate response time
response_time=$(echo "$end_time - $start_time" | bc -l)

echo "=========================================="
echo "RESPONSE TIME: ${response_time} seconds"
echo "=========================================="

# Also show in milliseconds
response_time_ms=$(echo "$response_time * 1000" | bc -l)
echo "RESPONSE TIME: ${response_time_ms} milliseconds" 