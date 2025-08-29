#!/bin/bash

# View All Blockchain Data Script
# Displays all entities saved on the Tea Ledger Network

echo "=========================================="
echo "Tea Ledger Network - All Blockchain Data"
echo "=========================================="

# Set environment variables
export FABRIC_CFG_PATH=$PWD/../config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Function to query and display entity
query_entity() {
    local entity_id=$1
    local entity_type=$2
    
    echo "Querying $entity_type: $entity_id"
    echo "----------------------------------------"
    
    result=$(./net-tln.sh invoke query "$entity_id" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        echo "$result" | jq '.' 2>/dev/null || echo "$result"
    else
        echo "❌ Entity not found or error occurred"
    fi
    echo ""
}

# Function to query transaction history
query_history() {
    local entity_id=$1
    local entity_type=$2
    
    echo "Transaction History for $entity_type: $entity_id"
    echo "----------------------------------------"
    
    result=$(./net-tln.sh invoke queryHistory "$entity_id" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        echo "$result" | jq '.' 2>/dev/null || echo "$result"
    else
        echo "❌ History not available or error occurred"
    fi
    echo ""
}

# Create output file
output_file="blockchain_data_$(date +%Y%m%d_%H%M%S).json"
echo "[]" > "$output_file"

# Function to save data to JSON
save_to_json() {
    local entity_id=$1
    local entity_type=$2
    
    result=$(./net-tln.sh invoke query "$entity_id" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        # Parse the result and add to JSON
        parsed_result=$(echo "$result" | sed 's/.*{/{/' | sed 's/}.*/}/')
        if [[ "$parsed_result" == {* ]]; then
            # Add entity type to the record
            enhanced_result=$(echo "$parsed_result" | jq --arg type "$entity_type" '. + {"entityType": $type}' 2>/dev/null)
            if [[ $? -eq 0 ]]; then
                # Append to JSON array
                jq --argjson new "$enhanced_result" '. += [$new]' "$output_file" > temp.json && mv temp.json "$output_file"
            fi
        fi
    fi
}

echo "🔍 Querying all entities on the blockchain..."
echo ""

# Known Farmers
echo "🌱 FARMERS"
echo "=========="
farmers=("FARM001" "FARM006" "FARM007" "FARM008" "FARM009" "FARM010")
for farmer in "${farmers[@]}"; do
    query_entity "$farmer" "Farmer"
    save_to_json "$farmer" "Farmer"
done

# Known Transporters
echo "🚚 TRANSPORTERS"
echo "=============="
transporters=("TRANS001" "TRANS002" "TRANS003" "TRANS004" "TRANS005")
for transporter in "${transporters[@]}"; do
    query_entity "$transporter" "Transporter"
    save_to_json "$transporter" "Transporter"
done

# Known Buyers
echo "🛒 BUYERS"
echo "========="
buyers=("BUY001" "BUY002" "BUY003" "BUY004" "BUY005")
for buyer in "${buyers[@]}"; do
    query_entity "$buyer" "Buyer"
    save_to_json "$buyer" "Buyer"
done

# Known Tea Batches
echo "🍃 TEA BATCHES"
echo "=============="
tea_batches=("TEA001" "TEA002" "TEA003" "TEA004" "TEA005" "TEA006" "TEA007" "TEA008" "TEA009" "TEA010")
for batch in "${tea_batches[@]}"; do
    query_entity "$batch" "Tea Batch"
    save_to_json "$batch" "Tea Batch"
done

echo "📊 SUMMARY STATISTICS"
echo "===================="

# Count entities by type
farmer_count=0
transporter_count=0
buyer_count=0
tea_count=0

for farmer in "${farmers[@]}"; do
    if ./net-tln.sh invoke query "$farmer" >/dev/null 2>&1; then
        ((farmer_count++))
    fi
done

for transporter in "${transporters[@]}"; do
    if ./net-tln.sh invoke query "$transporter" >/dev/null 2>&1; then
        ((transporter_count++))
    fi
done

for buyer in "${buyers[@]}"; do
    if ./net-tln.sh invoke query "$buyer" >/dev/null 2>&1; then
        ((buyer_count++))
    fi
done

for batch in "${tea_batches[@]}"; do
    if ./net-tln.sh invoke query "$batch" >/dev/null 2>&1; then
        ((tea_count++))
    fi
done

echo "📈 Entity Counts:"
echo "   🌱 Farmers: $farmer_count"
echo "   🚚 Transporters: $transporter_count"
echo "   🛒 Buyers: $buyer_count"
echo "   🍃 Tea Batches: $tea_count"
echo "   📊 Total Entities: $((farmer_count + transporter_count + buyer_count + tea_count))"

echo ""
echo "🔍 DETAILED TRANSACTION HISTORIES"
echo "================================"

# Show transaction history for some key entities
echo "📜 Transaction History for TEA007 (Complete Supply Chain):"
query_history "TEA007" "Tea Batch"

echo "📜 Transaction History for FARM007:"
query_history "FARM007" "Farmer"

echo "📜 Transaction History for BUY003:"
query_history "BUY003" "Buyer"

echo ""
echo "💾 EXPORTING DATA"
echo "================"

# Format the JSON file nicely
if command -v jq &> /dev/null; then
    jq '.' "$output_file" > temp.json && mv temp.json "$output_file"
    echo "✅ All blockchain data exported to: $output_file"
    echo ""
    echo "📋 Sample of exported data:"
    echo "=========================="
    head -20 "$output_file"
    echo "..."
else
    echo "✅ All blockchain data exported to: $output_file"
fi

echo ""
echo "🔧 USEFUL COMMANDS"
echo "=================="
echo "View specific entity:"
echo "  ./net-tln.sh invoke query <ENTITY_ID>"
echo ""
echo "View transaction history:"
echo "  ./net-tln.sh invoke queryHistory <ENTITY_ID>"
echo ""
echo "View exported data:"
echo "  cat $output_file"
echo ""
echo "Filter by entity type:"
echo "  jq '.[] | select(.entityType == \"Tea Batch\")' $output_file"
echo ""
echo "View tea batches only:"
echo "  jq '.[] | select(.entityType == \"Tea Batch\") | {batchId, variety, quantity, currentOwnerType}' $output_file"

echo ""
echo "=========================================="
echo "Blockchain Data View Complete!"
echo "==========================================" 