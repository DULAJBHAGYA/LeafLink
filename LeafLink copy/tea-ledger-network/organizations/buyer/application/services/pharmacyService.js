/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # buyerService -buyerReceived:
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const TeaLedgerContract = require('../../contract/lib/pharmaledgercontract.js');
class TeacyService {
  /**
  * 1. Select an identity from a wallet
  * 2. Connect to org3 network gateway
  * 3. Access farma ledger supply chain network
  * 4. Construct request to buyerReceived
  * 5. Submit invoke buyerReceived transaction
  * 6. Process response
  **/
   async buyerReceived(userName, equipmentNumber, ownerName) {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/'+userName+'/wallet');
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    try {
      // Load connection profile; will be used to locate a gateway
      let connectionProfile = yaml.safeLoad(fs.readFileSync('../../../organizations/peerOrganizations/org3.example.com/connection-org3.json', 'utf8'));
      // Set connection options; identity and wallet
      let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
      };
      // Connect to gateway using application specified parameters
      console.log('Connect to Fabric gateway.');
      await gateway.connect(connectionProfile, connectionOptions);
      // Access farma ledger supply chain network
      console.log('Use network channel: tlnchannel.');
      const network = await gateway.getNetwork('tlnchannel');
      // Get addressability to farma ledger supply chain network contract
      console.log('Use org.tln.TeaLedgerContract smart contract.');
      const contract = await network.getContract('pharmaLedgerContract', 'org.tln.TeaLedgerContract');
      // makeEquipment
      console.log('Submit pharmaledger buyerReceived transaction.');
      const response = await contract.submitTransaction('buyerReceived', equipmentNumber, ownerName);
      console.log('buyerReceived Transaction complete.');
      return response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({ status: 500,  message: `Error adding to wallet. ${error}` });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }
}
// Main program function
module.exports = TeacyService;
