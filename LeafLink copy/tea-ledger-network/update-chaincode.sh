#!/bin/bash

# Helper script to update chaincode version and redeploy
# Usage: ./update-chaincode.sh [new_version]

if [ -z "$1" ]; then
    echo "Usage: ./update-chaincode.sh [new_version]"
    echo "Example: ./update-chaincode.sh 2"
    exit 1
fi

NEW_VERSION=$1
DEPLOY_SCRIPT="scripts/deploySmartContract.sh"

echo "Updating chaincode version to $NEW_VERSION..."

# Update the version in the deployment script
sed -i.bak "s/: \${VERSION:=\".*\"/: \${VERSION:=\"$NEW_VERSION\"/" $DEPLOY_SCRIPT

echo "Version updated in $DEPLOY_SCRIPT"
echo "Redeploying chaincode with version $NEW_VERSION..."

# Deploy the updated chaincode
./net-tln.sh deploySmartContract

echo "Chaincode update complete!"
echo "New version $NEW_VERSION is now deployed and active." 