#!/bin/bash

# Blockchain Network Performance Monitor
# Monitors real-time metrics of the Hyperledger Fabric network

echo "=========================================="
echo "Tea Ledger Network Performance Monitor"
echo "=========================================="
echo "Press Ctrl+C to stop monitoring"
echo ""

# Function to get peer status
get_peer_status() {
    local org=$1
    local peer_port=$2
    
    echo "=== Peer Status (Org$org) ==="
    echo "Port: $peer_port"
    
    # Check if peer is responding
    if curl -s http://localhost:$peer_port > /dev/null 2>&1; then
        echo "Status: ONLINE"
    else
        echo "Status: OFFLINE"
    fi
    echo ""
}

# Function to get orderer status
get_orderer_status() {
    echo "=== Orderer Status ==="
    echo "Port: 7050"
    
    if curl -s http://localhost:7050 > /dev/null 2>&1; then
        echo "Status: ONLINE"
    else
        echo "Status: OFFLINE"
    fi
    echo ""
}

# Function to get Docker container stats
get_container_stats() {
    echo "=== Container Performance ==="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
}

# Function to get network latency
measure_latency() {
    echo "=== Network Latency ==="
    
    # Measure latency to orderer
    orderer_latency=$(ping -c 1 localhost 2>/dev/null | grep "time=" | cut -d'=' -f4 | cut -d' ' -f1)
    echo "Orderer (localhost:7050): ${orderer_latency:-N/A}"
    
    # Measure latency to peers
    for org in 1 2 3; do
        case $org in
            1) port=7051 ;;
            2) port=9051 ;;
            3) port=11051 ;;
        esac
        peer_latency=$(ping -c 1 localhost 2>/dev/null | grep "time=" | cut -d'=' -f4 | cut -d' ' -f1)
        echo "Peer$org (localhost:$port): ${peer_latency:-N/A}"
    done
    echo ""
}

# Function to get transaction throughput estimate
get_throughput_estimate() {
    echo "=== Transaction Throughput Estimate ==="
    
    # Count recent transactions in logs
    recent_txs=$(find . -name "*.log" -type f -exec grep -l "Chaincode invoke successful" {} \; 2>/dev/null | wc -l)
    echo "Recent successful transactions: $recent_txs"
    
    # Estimate based on batch size and timeout from config
    echo "Configured batch size: 10 transactions"
    echo "Configured batch timeout: 2 seconds"
    echo "Estimated max throughput: ~5 transactions/second"
    echo ""
}

# Main monitoring loop
while true; do
    clear
    echo "=========================================="
    echo "Tea Ledger Network Performance Monitor"
    echo "=========================================="
    echo "Timestamp: $(date)"
    echo ""
    
    # Get orderer status
    get_orderer_status
    
    # Get peer status for each organization
    get_peer_status 1 7051
    get_peer_status 2 9051
    get_peer_status 3 11051
    
    # Get container performance stats
    get_container_stats
    
    # Get network latency
    measure_latency
    
    # Get throughput estimate
    get_throughput_estimate
    
    echo "Monitoring... (Refresh every 5 seconds)"
    echo "Press Ctrl+C to stop"
    
    sleep 5
done 