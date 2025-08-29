#!/bin/bash

# Create Entities Script for Tea Ledger Network
# Helps create farmers, transporters, buyers, and tea batches

echo "=========================================="
echo "Tea Ledger Network - Entity Creation"
echo "=========================================="

# Set environment variables
export FABRIC_CFG_PATH=$PWD/../config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Function to create a farmer
create_farmer() {
    local farmer_id=$1
    local name=$2
    local location=$3
    
    echo "Creating farmer: $name ($farmer_id) in $location"
    ./net-tln.sh invoke registerFarmer "$farmer_id" "$name" "$location"
    echo ""
}

# Function to create a transporter
create_transporter() {
    local transporter_id=$1
    local name=$2
    
    echo "Creating transporter: $name ($transporter_id)"
    ./net-tln.sh invoke registerTransporter "$transporter_id" "$name"
    echo ""
}

# Function to create a buyer
create_buyer() {
    local buyer_id=$1
    local name=$2
    
    echo "Creating buyer: $name ($buyer_id)"
    ./net-tln.sh invoke registerBuyer "$buyer_id" "$name"
    echo ""
}

# Function to create a tea batch
create_tea_batch() {
    local farmer_id=$1
    local batch_id=$2
    local variety=$3
    local quantity=$4
    local price=$5
    local quality=$6
    local fertilizer=$7
    local weather=$8
    
    echo "Creating tea batch: $batch_id ($variety) - $quantity at $price"
    ./net-tln.sh invoke createTeaBatch "$farmer_id" "$batch_id" "$variety" "$farmer_id" "hash_$batch_id" "$quantity" "$price" "$quality" "$fertilizer" "$weather"
    echo ""
}

# Function to ship tea to transporter
ship_tea() {
    local batch_id=$1
    local transporter_id=$2
    
    echo "Shipping tea batch $batch_id to transporter $transporter_id"
    ./net-tln.sh invoke shipToTransporter "$batch_id" "$transporter_id"
    echo ""
}

# Function to receive tea by buyer
receive_tea() {
    local batch_id=$1
    local buyer_id=$2
    
    echo "Receiving tea batch $batch_id by buyer $buyer_id"
    ./net-tln.sh invoke receiveByBuyer "$batch_id" "$buyer_id"
    echo ""
}

# Function to query an entity
query_entity() {
    local entity_id=$1
    local description=$2
    
    echo "Querying $description: $entity_id"
    ./net-tln.sh invoke query "$entity_id"
    echo ""
}

echo "Creating Tea Supply Chain Entities..."
echo ""

# Create Farmers
echo "=== Creating Farmers ==="
create_farmer "FARM007" "Highland Tea Gardens" "Kandy"
create_farmer "FARM008" "Mountain View Estates" "Badulla"
create_farmer "FARM009" "Ceylon Premium Farms" "Ratnapura"
create_farmer "FARM010" "Organic Valley Tea" "Galle"

# Create Transporters
echo "=== Creating Transporters ==="
create_transporter "TRANS003" "Swift Logistics Ltd"
create_transporter "TRANS004" "Tea Express Transport"
create_transporter "TRANS005" "Premium Cargo Services"

# Create Buyers
echo "=== Creating Buyers ==="
create_buyer "BUY003" "Global Tea Importers"
create_buyer "BUY004" "Luxury Tea Boutique"
create_buyer "BUY005" "Tea & Coffee Wholesalers"

# Create Tea Batches
echo "=== Creating Tea Batches ==="
create_tea_batch "FARM007" "TEA007" "CeylonBlack" "100kg" "45.00" "95" "Organic" "Sunny"
create_tea_batch "FARM008" "TEA008" "CeylonGreen" "75kg" "35.00" "92" "Organic" "Cloudy"
create_tea_batch "FARM009" "TEA009" "CeylonOolong" "50kg" "60.00" "98" "Premium" "Sunny"
create_tea_batch "FARM010" "TEA010" "CeylonWhite" "25kg" "80.00" "99" "Premium" "Misty"

# Complete Supply Chain Flow
echo "=== Completing Supply Chain Flow ==="

# Ship TEA007 to TRANS003
ship_tea "TEA007" "TRANS003"
# Receive TEA007 by BUY003
receive_tea "TEA007" "BUY003"

# Ship TEA008 to TRANS004
ship_tea "TEA008" "TRANS004"
# Receive TEA008 by BUY004
receive_tea "TEA008" "BUY004"

# Ship TEA009 to TRANS005
ship_tea "TEA009" "TRANS005"
# Receive TEA009 by BUY005
receive_tea "TEA009" "BUY005"

echo "=== Querying Created Entities ==="

# Query some created entities
query_entity "FARM007" "Farmer"
query_entity "TEA007" "Tea Batch"
query_entity "BUY003" "Buyer"

echo "=========================================="
echo "Entity Creation Completed!"
echo "=========================================="
echo ""
echo "Created Entities Summary:"
echo "- 4 New Farmers (FARM007-FARM010)"
echo "- 3 New Transporters (TRANS003-TRANS005)"
echo "- 3 New Buyers (BUY003-BUY005)"
echo "- 4 New Tea Batches (TEA007-TEA010)"
echo "- 3 Complete Supply Chain Flows"
echo ""
echo "You can now query any entity using:"
echo "./net-tln.sh invoke query <ENTITY_ID>"
echo ""
echo "Example: ./net-tln.sh invoke query TEA007" 