/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Tea ledger supply chain network smart contract
 * Based on O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 * Adapted for Tea Supply Chain
 */
"use strict";
// Fabric smart contract classes
const { Contract, Context } = require("fabric-contract-api");

/**
 * Define TeaLedger smart contract by extending Fabric Contract class
 */
class TeaLedgerContract extends Contract {
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super("org.tln.TeaLedgerContract");
    }

    /**
     * Instantiate to set up ledger.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No default implementation for this example
        console.log("Instantiate the TeaLedger contract");
    }

    // =========================================================================================
    // REGISTRATION FUNCTIONS
    // =========================================================================================

    /**
     * Register a new user on the ledger
     *
     * @param {Context} ctx the transaction context
     * @param {String} name Name of the user
     * @param {String} role Role of the user (farmer, transporter, or buyer)
     */
    async registerUser(ctx, name, role) {
        console.info("============= START : registerUser call ===========");

        let idCounter;
        const idCounterBytes = await ctx.stub.getState(role + "IdCounter");

        if (!idCounterBytes || idCounterBytes.length === 0) {
            idCounter = 1;
        } else {
            idCounter = parseInt(idCounterBytes.toString()) + 1;
        }

        let id;
        let prefix;
        switch (role.toLowerCase()) {
            case "farmer":
                prefix = "FARM";
                break;
            case "transporter":
                prefix = "TRAN";
                break;
            case "buyer":
                prefix = "BUY";
                break;
            default:
                throw new Error(
                    "Invalid role specified. Must be one of: farmer, transporter, buyer"
                );
        }

        id = prefix + idCounter.toString().padStart(4, "0");

        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The user ${id} is already registered`);
        }

        let dt = new Date().toString();
        const user = {
            docType: role,
            id,
            name,
            registrationDate: dt,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(user)));
        await ctx.stub.putState(
            role + "IdCounter",
            Buffer.from(idCounter.toString())
        );

        console.info("============= END : registerUser ===========");
        return id;
    }

    /**
     * Register a new Farmer on the ledger with encrypted data
     *
     * @param {Context} ctx the transaction context
     * @param {String} farmer Encrypted farmer data string from upstream module
     */
    async registerFarmer(ctx, farmer) {
        console.info("============= START : registerFarmer call ===========");
        let dt = new Date().toString();
        const farmerData = {
            docType: "farmer",
            encryptedData: farmer,
            registrationDate: dt,
        };
        await ctx.stub.putState(
            farmer,
            Buffer.from(JSON.stringify(farmerData))
        );
        console.info("============= END : registerFarmer ===========");
    }

    /**
     * Register a new Transporter on the ledger with encrypted data
     *
     * @param {Context} ctx the transaction context
     * @param {String} transporter Encrypted transporter data string from upstream module
     */
    async registerTransporter(ctx, transporter) {
        console.info(
            "============= START : registerTransporter call ==========="
        );
        let dt = new Date().toString();
        const transporterData = {
            docType: "transporter",
            encryptedData: transporter,
            registrationDate: dt,
        };
        await ctx.stub.putState(
            transporter,
            Buffer.from(JSON.stringify(transporterData))
        );
        console.info("============= END : registerTransporter ===========");
    }

    /**
     * Register a new Buyer on the ledger with encrypted data
     *
     * @param {Context} ctx the transaction context
     * @param {String} buyer Encrypted buyer data string from upstream module
     */
    async registerBuyer(ctx, buyer) {
        console.info("============= START : registerBuyer call ===========");
        let dt = new Date().toString();
        const buyerData = {
            docType: "buyer",
            encryptedData: buyer,
            registrationDate: dt,
        };
        await ctx.stub.putState(buyer, Buffer.from(JSON.stringify(buyerData)));
        console.info("============= END : registerBuyer ===========");
    }

    // =========================================================================================
    // TEA BATCH FUNCTIONS
    // =========================================================================================

    /**
     * Create a new batch of tea on the ledger with encrypted data
     *
     * @param {Context} ctx the transaction context
     * @param {String} teabatch Encrypted tea batch data string from upstream module
     */
    async createTeaBatch(ctx, teabatch) {
        console.info("============= START : createTeaBatch call ===========");
        let dt = new Date().toString();
        const teaBatchData = {
            docType: "teaBatch",
            encryptedData: teabatch,
            createDateTime: dt,
            lastUpdated: dt,
        };
        await ctx.stub.putState(
            teabatch,
            Buffer.from(JSON.stringify(teaBatchData))
        );
        console.info("============= END : createTeaBatch ===========");
    }

    /**
     * Farmer ships the tea batch to a Transporter
     *
     * @param {Context} ctx the transaction context
     * @param {String} ship Encrypted shipping data string from upstream module
     */
    async shipToTransporter(ctx, ship) {
        console.info(
            "============= START : shipToTransporter call ==========="
        );
        let dt = new Date().toString();
        const shipData = {
            docType: "shipment",
            encryptedData: ship,
            timestamp: dt,
        };
        await ctx.stub.putState(ship, Buffer.from(JSON.stringify(shipData)));
        console.info("============= END : shipToTransporter ===========");
    }

    /**
     * Transporter delivers the tea batch to a Buyer
     *
     * @param {Context} ctx the transaction context
     * @param {String} receive Encrypted receiving data string from upstream module
     */
    async receiveByBuyer(ctx, receive) {
        console.info("============= START : receiveByBuyer call ===========");
        let dt = new Date().toString();
        const receiveData = {
            docType: "receipt",
            encryptedData: receive,
            timestamp: dt,
        };
        await ctx.stub.putState(
            receive,
            Buffer.from(JSON.stringify(receiveData))
        );
        console.info("============= END : receiveByBuyer ===========");
    }

    /**
     * Delete a TeaBatch from the ledger
     *
     * @param {Context} ctx the transaction context
     * @param {String} batchId for the tea batch to delete
     */
    async deleteTeaBatch(ctx, batchId) {
        console.info("============= START : deleteTeaBatch call ===========");
        const exists = await this.AssetExists(ctx, batchId);
        if (!exists) {
            throw new Error(`The tea batch ${batchId} does not exist`);
        }
        await ctx.stub.deleteState(batchId);
        console.info("============= END : deleteTeaBatch ===========");
    }

    /**
     * Assign a transporter to a tea batch
     *
     * @param {Context} ctx the transaction context
     * @param {String} assign Encrypted assignment data string from upstream module
     */
    async assignTransporter(ctx, assign) {
        console.info(
            "============= START : assignTransporter call ==========="
        );
        let dt = new Date().toString();
        const assignData = {
            docType: "assignment",
            encryptedData: assign,
            timestamp: dt,
        };
        await ctx.stub.putState(
            assign,
            Buffer.from(JSON.stringify(assignData))
        );
        console.info("============= END : assignTransporter ===========");
    }

    /**
     * Confirm delivery of a tea batch
     *
     * @param {Context} ctx the transaction context
     * @param {String} confirm Encrypted confirmation data string from upstream module
     */
    async confirmDelivery(ctx, confirm) {
        console.info("============= START : confirmDelivery call ===========");
        let dt = new Date().toString();
        const confirmData = {
            docType: "confirmation",
            encryptedData: confirm,
            timestamp: dt,
        };
        await ctx.stub.putState(
            confirm,
            Buffer.from(JSON.stringify(confirmData))
        );
        console.info("============= END : confirmDelivery ===========");
    }

    /**
     * Query and return all tea batches on the ledger
     *
     * @param {Context} ctx the transaction context
     */
    async queryAllTeaBatches(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === "teaBatch") {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    /**
     * Query and return all assets on the ledger
     *
     * @param {Context} ctx the transaction context
     */
    async queryAll(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    /**
     * Query and return all registered transporters
     * @param {Context} ctx the transaction context
     */
    async queryAllTransporters(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            if (record.docType === "transporter") {
                allResults.push({ Key: key, Record: record });
            }
        }
        return JSON.stringify(allResults);
    }

    /**
     * Award a tea batch to the highest bidder
     *
     * @param {Context} ctx the transaction context
     * @param {String} award Encrypted award data string from upstream module
     */
    async awardTeaBatchToHighestBidder(ctx, award) {
        console.info(
            "============= START : awardTeaBatchToHighestBidder call ==========="
        );
        let dt = new Date().toString();
        const awardData = {
            docType: "award",
            encryptedData: award,
            timestamp: dt,
        };
        await ctx.stub.putState(award, Buffer.from(JSON.stringify(awardData)));
        console.info(
            "============= END : awardTeaBatchToHighestBidder ==========="
        );
    }

    /**
     * Place a bid on a tea batch with encrypted data
     *
     * @param {Context} ctx the transaction context
     * @param {String} bid Encrypted bid data string from upstream module
     */
    async placeBid(ctx, bid) {
        console.info("============= START : placeBid call ===========");
        let dt = new Date().toString();
        const bidData = {
            docType: "bid",
            encryptedData: bid,
            timestamp: dt,
        };
        await ctx.stub.putState(bid, Buffer.from(JSON.stringify(bidData)));
        console.info("============= END : placeBid ===========");
    }

    /**
     * Query all bids on the ledger
     *
     * @param {Context} ctx the transaction context
     */
    async queryBidsForBatch(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === "bid") {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    // =========================================================================================
    // QUERY AND HELPER FUNCTIONS
    // =========================================================================================

    /**
     * Query ledger record by Key
     *
     * @param {Context} ctx the transaction context
     * @param {String} key for record
     */
    async queryByKey(ctx, key) {
        let value = await ctx.stub.getState(key);
        if (!value || value.length === 0) {
            throw new Error(`The asset ${key} does not exist`);
        }
        const strValue = Buffer.from(value).toString("utf8");
        let record;
        try {
            record = JSON.parse(strValue);
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        return JSON.stringify({
            Key: key,
            Record: record,
        });
    }

    /**
     * Query transaction history for a key
     *
     * @param {Context} ctx the transaction context
     * @param {String} key for record
     */
    async queryHistoryByKey(ctx, key) {
        console.info("getting history for key: " + key);
        let iterator = await ctx.stub.getHistoryForKey(key);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = JSON.parse(res.value.value.toString("utf8"));
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        console.info(result);
        return JSON.stringify(result);
    }

    /**
     * AssetExists returns true when asset with given ID exists in world state
     *
     * @param {Context} ctx the transaction context
     * @param {String} id for the asset
     */
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}
module.exports = TeaLedgerContract;
