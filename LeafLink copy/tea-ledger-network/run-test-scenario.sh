#!/bin/bash
echo "#################################################################"
echo "#######    Running Tea Ledger Test Scenario     #################"
echo "#################################################################"

echo "----> 1. Registering a new farmer: 'GreenField Farms'"
./net-tln.sh invoke register "GreenField Farms" "farmer"
sleep 2

echo "----> 2. Creating a new tea batch: 'TEA001' for farmer 'FARM0001'"
./net-tln.sh invoke createTeaBatch "FARM0001" "TEA001" "CeylonBlack" "FARM0001" "image_hash_123" "100kg" "25.50" "95" "Organic" "Sunny"
sleep 2

echo "----> 3. Querying the tea batch 'TEA001' to verify creation"
./net-tln.sh invoke query "TEA001"

echo "#################################################################"
echo "#######              Test Scenario Complete     #################"
echo "#################################################################" 