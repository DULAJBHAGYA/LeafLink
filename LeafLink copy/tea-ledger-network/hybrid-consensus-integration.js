/**
 * Hybrid Consensus Integration Layer
 * Integrates Hybrid PBFT with existing Hyperledger Fabric network
 */

const HybridPBFTConsensus = require("./hybrid-pbft-consensus");
const { Contract, Context } = require("fabric-contract-api");

class HybridConsensusIntegration extends Contract {
  constructor() {
    super("org.tln.HybridConsensusContract");
    this.hybridPBFT = new HybridPBFTConsensus();
    this.initializeHybridConsensus();
  }

  /**
   * Initialize hybrid consensus with network nodes
   */
  initializeHybridConsensus() {
    const networkNodes = [
      "peer0.org1.example.com:7051",
      "peer0.org2.example.com:9051",
      "peer0.org3.example.com:11051",
      "orderer.example.com:7050",
    ];

    this.hybridPBFT.initialize(networkNodes);
    console.log("Hybrid consensus initialized with network nodes");
  }


  /**
   * Enhanced transaction processing with hybrid consensus
   */
  async processTransactionWithHybridConsensus(ctx, functionName, ...args) {
    const transaction = {
      function: functionName,
      args: args,
      timestamp: Date.now(),
      clientId: ctx.clientIdentity.getID(),
    };

    console.log(
      `Processing transaction with hybrid consensus: ${functionName}`
    );

    // Classify transaction type
    const transactionType = this.hybridPBFT.classifyTransaction(transaction);
    console.log(`Transaction classified as: ${transactionType}`);

    if (transactionType === "CRITICAL") {
      return await this.processWithPBFT(ctx, transaction);
    } else {
      return await this.processWithRaft(ctx, transaction);
    }
  }

  /**
   * Process critical transactions with PBFT
   */
  async processWithPBFT(ctx, transaction) {
    console.log("Processing with PBFT consensus...");

    const startTime = Date.now();

    try {
      // PBFT Pre-Prepare phase
      const prePrepareResult = this.hybridPBFT.prePrepare(
        transaction,
        ctx.clientIdentity.getID()
      );

      // PBFT Prepare phase
      const prepareResult = this.hybridPBFT.prepare(prePrepareResult);

      // PBFT Commit phase
      const commitResult = this.hybridPBFT.commit(prepareResult);

      // PBFT Reply phase
      const replyResult = this.hybridPBFT.reply(commitResult);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`PBFT transaction completed in ${responseTime}ms`);

      // Execute the actual transaction
      const result = await this.executeTransaction(ctx, transaction);

      return {
        success: true,
        consensus: "PBFT",
        responseTime: responseTime,
        result: result,
        transactionId: replyResult.result.transactionId,
      };
    } catch (error) {
      console.error("PBFT consensus failed:", error);
      throw new Error(`PBFT consensus failed: ${error.message}`);
    }
  }

  /**
   * Process regular transactions with Raft
   */
  async processWithRaft(ctx, transaction) {
    console.log("Processing with Raft consensus...");

    const startTime = Date.now();

    try {
      // Route to existing Raft implementation
      const raftResult = this.hybridPBFT.routeToRaft(transaction);

      // Execute the actual transaction
      const result = await this.executeTransaction(ctx, transaction);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`Raft transaction completed in ${responseTime}ms`);

      return {
        success: true,
        consensus: "RAFT",
        responseTime: responseTime,
        result: result,
        transactionId: this.generateTransactionId(),
      };
    } catch (error) {
      console.error("Raft consensus failed:", error);
      throw new Error(`Raft consensus failed: ${error.message}`);
    }
  }

  /**
   * Execute the actual transaction based on function name
   */
  async executeTransaction(ctx, transaction) {
    const { function: functionName, args } = transaction;

    switch (functionName) {
      case "receiveByBuyer":
        return await this.receiveByBuyer(ctx, ...args);
      case "createTeaBatch":
        return await this.createTeaBatch(ctx, ...args);
      case "shipToTransporter":
        return await this.shipToTransporter(ctx, ...args);
      case "registerFarmer":
        return await this.registerFarmer(ctx, ...args);
      case "registerTransporter":
        return await this.registerTransporter(ctx, ...args);
      case "registerBuyer":
        return await this.registerBuyer(ctx, ...args);
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  /**
   * Enhanced receiveByBuyer with hybrid consensus
   */
  async receiveByBuyer(ctx, batchId, buyerId) {
    console.info("============= START : receiveByBuyer call ===========");
    const buyerExists = await this.AssetExists(ctx, buyerId);
    if (!buyerExists) {
      throw new Error(`The buyer ${buyerId} is not registered`);
    }
    const teaBatchAsBytes = await ctx.stub.getState(batchId);
    if (!teaBatchAsBytes || teaBatchAsBytes.length === 0) {
      throw new Error(`${batchId} does not exist`);
    }
    let dt = new Date().toString();
    const strValue = Buffer.from(teaBatchAsBytes).toString("utf8");
    let record;
    try {
      record = JSON.parse(strValue);
      if (record.currentOwnerType !== "TRANSPORTER") {
        throw new Error(`Tea batch ${batchId} must be owned by a TRANSPORTER`);
      }
      record.previousOwnerType = record.currentOwnerType;
      record.currentOwnerType = "BUYER";
      record.owner = buyerId;
      record.lastUpdated = dt;
    } catch (err) {
      console.log(err);
      throw new Error(`Tea batch ${batchId} data can't be processed`);
    }
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(record)));
    console.info("============= END : receiveByBuyer ===========");
    return {
      success: true,
      message: `Tea batch ${batchId} received by ${buyerId}`,
    };
  }

  /**
   * Enhanced createTeaBatch with hybrid consensus
   */
  async createTeaBatch(
    ctx,
    farmerId,
    batchId,
    variety,
    owner,
    imageHash,
    quantity,
    startPrice,
    qualityScore,
    fertilizer,
    weather
  ) {
    console.info("============= START : createTeaBatch call ===========");
    const farmerExists = await this.AssetExists(ctx, farmerId);
    if (!farmerExists) {
      throw new Error(`The farmer ${farmerId} is not registered`);
    }
    const batchExists = await this.AssetExists(ctx, batchId);
    if (batchExists) {
      throw new Error(`The tea batch ${batchId} already exists`);
    }

    let dt = new Date().toString();
    const teaBatch = {
      docType: "teaBatch",
      batchId,
      farmer: farmerId,
      variety,
      owner,
      imageHash,
      quantity,
      startPrice,
      qualityScore,
      fertilizer,
      weather,
      previousOwnerType: "FARMER",
      currentOwnerType: "FARMER",
      createDateTime: dt,
      lastUpdated: dt,
    };
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(teaBatch)));
    console.info("============= END : createTeaBatch ===========");
    return {
      success: true,
      message: `Tea batch ${batchId} created successfully`,
    };
  }

  /**
   * Enhanced shipToTransporter with hybrid consensus
   */
  async shipToTransporter(ctx, batchId, transporterId) {
    console.info("============= START : shipToTransporter call ===========");
    const transporterExists = await this.AssetExists(ctx, transporterId);
    if (!transporterExists) {
      throw new Error(`The transporter ${transporterId} is not registered`);
    }
    const teaBatchAsBytes = await ctx.stub.getState(batchId);
    if (!teaBatchAsBytes || teaBatchAsBytes.length === 0) {
      throw new Error(`${batchId} does not exist`);
    }
    let dt = new Date().toString();
    const strValue = Buffer.from(teaBatchAsBytes).toString("utf8");
    let record;
    try {
      record = JSON.parse(strValue);
      if (record.currentOwnerType !== "FARMER") {
        throw new Error(`Tea batch ${batchId} must be owned by a FARMER`);
      }
      record.previousOwnerType = record.currentOwnerType;
      record.currentOwnerType = "TRANSPORTER";
      record.owner = transporterId;
      record.lastUpdated = dt;
    } catch (err) {
      console.log(err);
      throw new Error(`Tea batch ${batchId} data can't be processed`);
    }
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(record)));
    console.info("============= END : shipToTransporter ===========");
    return {
      success: true,
      message: `Tea batch ${batchId} shipped to ${transporterId}`,
    };
  }

  /**
   * Regular transactions (use Raft)
   */
  async registerFarmer(ctx, farmerId, name, location) {
    console.info("============= START : registerFarmer call ===========");
    const exists = await this.AssetExists(ctx, farmerId);
    if (exists) {
      throw new Error(`The farmer ${farmerId} is already registered`);
    }
    let dt = new Date().toString();
    const farmer = {
      docType: "farmer",
      farmerId,
      name,
      location,
      registrationDate: dt,
    };
    await ctx.stub.putState(farmerId, Buffer.from(JSON.stringify(farmer)));
    console.info("============= END : registerFarmer ===========");
    return {
      success: true,
      message: `Farmer ${farmerId} registered successfully`,
    };
  }

  async registerTransporter(ctx, transporterId, name) {
    console.info("============= START : registerTransporter call ===========");
    const exists = await this.AssetExists(ctx, transporterId);
    if (exists) {
      throw new Error(`The transporter ${transporterId} is already registered`);
    }
    let dt = new Date().toString();
    const transporter = {
      docType: "transporter",
      transporterId,
      name,
      registrationDate: dt,
    };
    await ctx.stub.putState(
      transporterId,
      Buffer.from(JSON.stringify(transporter))
    );
    console.info("============= END : registerTransporter ===========");
    return {
      success: true,
      message: `Transporter ${transporterId} registered successfully`,
    };
  }

  async registerBuyer(ctx, buyerId, name) {
    console.info("============= START : registerBuyer call ===========");
    const exists = await this.AssetExists(ctx, buyerId);
    if (exists) {
      throw new Error(`The buyer ${buyerId} is already registered`);
    }
    let dt = new Date().toString();
    const buyer = {
      docType: "buyer",
      buyerId,
      name,
      registrationDate: dt,
    };
    await ctx.stub.putState(buyerId, Buffer.from(JSON.stringify(buyer)));
    console.info("============= END : registerBuyer ===========");
    return {
      success: true,
      message: `Buyer ${buyerId} registered successfully`,
    };
  }

  /**
   * Performance monitoring
   */
  async getConsensusMetrics(ctx) {
    const metrics = this.hybridPBFT.getPerformanceMetrics();
    return {
      timestamp: Date.now(),
      metrics: metrics,
      networkStatus: await this.getNetworkStatus(),
    };
  }

  /**
   * Get network status
   */
  async getNetworkStatus() {
    return {
      totalNodes: this.hybridPBFT.replicas.length,
      primary: this.hybridPBFT.primary,
      viewNumber: this.hybridPBFT.viewNumber,
      sequenceNumber: this.hybridPBFT.sequenceNumber,
    };
  }

  /**
   * View change for fault tolerance
   */
  async initiateViewChange(ctx) {
    const newPrimary = this.hybridPBFT.viewChange();
    return {
      success: true,
      newPrimary: newPrimary,
      viewNumber: this.hybridPBFT.viewNumber,
    };
  }

  /**
   * Utility functions
   */
  generateTransactionId() {
    return require("crypto").randomBytes(16).toString("hex");
  }

  /**
   * Check if asset exists
   */
  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  /**
   * Query functions (no consensus needed)
   */
  async queryByKey(ctx, key) {
    const value = await ctx.stub.getState(key);
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
    return JSON.stringify(result);
  }
}

module.exports = HybridConsensusIntegration;
