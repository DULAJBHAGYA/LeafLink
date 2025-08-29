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
 * farma ledger supply chain network smart contract
 * O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 * Author: Brian Wu
 */
"use strict";
// Fabric smart contract classes
const { Contract, Context } = require("fabric-contract-api");

/**
 * Define TeaLedger smart contract by extending Fabric Contract class
 *
 */
class TeaLedgerContract extends Contract {
    constructor() {
        // Unique namespace pcn - TeaChainNetwork when multiple contracts per chaincode file
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

    /**
     * Create pharma equipment
     *
     * @param {Context} ctx the transaction context
     * @param {String} equipment farmer
     * @param {String} equipmentNumber for this equipment
     * @param {String} equipment name
     * @param {String} name of the equipment owner
     */
    async makeEquipment(
        ctx,
        farmer,
        equipmentNumber,
        equipmentName,
        ownerName
    ) {
        console.info("============= START : makeEquipment call ===========");
        let dt = new Date().toString();
        const equipment = {
            equipmentNumber,
            farmer,
            equipmentName,
            ownerName,
            previousOwnerType: "MANUFACTURER",
            currentOwnerType: "MANUFACTURER",
            createDateTime: dt,
            lastUpdated: dt,
        };
        await ctx.stub.putState(
            equipmentNumber,
            Buffer.from(JSON.stringify(equipment))
        );
        console.info("============= END : Create equipment ===========");
    }
    /**
     * Manufacturer send equipment To Wholesaler
     *
     * @param {Context} ctx the transaction context
     * @param {String} equipmentNumber for this equipment
     * @param {String} name of the equipment owner
     */
    async transporterDistribute(ctx, equipmentNumber, ownerName) {
        console.info(
            "============= START : wolesalerDistribute call ==========="
        );
        const equipmentAsBytes = await ctx.stub.getState(equipmentNumber);
        if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
            throw new Error(`${equipmentNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(equipmentAsBytes).toString("utf8");
        let record;
        try {
            record = JSON.parse(strValue);
            if (record.currentOwnerType !== "MANUFACTURER") {
                throw new Error(
                    ` equipment - ${equipmentNumber} owner must be MANUFACTURER`
                );
            }
            record.previousOwnerType = record.currentOwnerType;
            record.currentOwnerType = "WHOLESALER";
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(
                `equipmet ${equipmentNumber} data can't be processed`
            );
        }
        await ctx.stub.putState(
            equipmentNumber,
            Buffer.from(JSON.stringify(record))
        );
        console.info("============= END : wolesalerDistribute  ===========");
    }
    /**
     * Wholesaler send equipment To Teacy
     *
     * @param {Context} ctx the transaction context
     * @param {String} equipmentNumber for this equipment
     * @param {String} name of the equipment owner
     */
    async buyerReceived(ctx, equipmentNumber, ownerName) {
        console.info("============= START : buyerReceived call ===========");
        const equipmentAsBytes = await ctx.stub.getState(equipmentNumber);
        if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
            throw new Error(`${equipmentNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(equipmentAsBytes).toString("utf8");
        let record;
        try {
            record = JSON.parse(strValue);
            //make sure owner is transporter
            if (record.currentOwnerType !== "WHOLESALER") {
                throw new Error(
                    ` equipment - ${equipmentNumber} owner must be WHOLESALER`
                );
            }
            record.previousOwnerType = record.currentOwnerType;
            record.currentOwnerType = "PHARMACY";
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(
                `equipmet ${equipmentNumber} data can't be processed`
            );
        }
        await ctx.stub.putState(
            equipmentNumber,
            Buffer.from(JSON.stringify(record))
        );
        console.info("============= END : buyerReceived  ===========");
    }
    /**
     * query ledger record By Key
     *
     * @param {Context} ctx the transaction context
     * @param {String} key for record
     */
    async queryByKey(ctx, key) {
        let value = await ctx.stub.getState(key);
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
}
module.exports = TeaLedgerContract;
