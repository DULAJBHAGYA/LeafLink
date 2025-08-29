/**
 * Hybrid PBFT Consensus Implementation for Tea Ledger Network
 * Combines PBFT for critical transactions and Raft for regular transactions
 */

const crypto = require("crypto");

class HybridPBFTConsensus {
  constructor() {
    this.viewNumber = 0;
    this.sequenceNumber = 0;
    this.primary = null;
    this.replicas = [];
    this.checkpointInterval = 100;
    this.lastCheckpoint = 0;
    this.pendingRequests = new Map();
    this.preparedMessages = new Map();
    this.committedMessages = new Map();
    this.checkpoints = new Map();

    // PBFT phases
    this.PHASES = {
      PRE_PREPARE: "PRE_PREPARE",
      PREPARE: "PREPARE",
      COMMIT: "COMMIT",
      REPLY: "REPLY",
    };

    // Transaction types for hybrid approach
    this.TRANSACTION_TYPES = {
      CRITICAL: "CRITICAL", // Uses PBFT
      REGULAR: "REGULAR", // Uses Raft
    };
  }

  /**
   * Initialize the hybrid consensus with network nodes
   */
  initialize(nodes, primaryIndex = 0) {
    this.replicas = nodes;
    this.primary = nodes[primaryIndex];
    this.viewNumber = 0;
    this.sequenceNumber = 0;

    console.log(`Hybrid PBFT initialized with ${nodes.length} nodes`);
    console.log(`Primary: ${this.primary}`);
  }

  /**
   * Determine transaction type for hybrid routing
   */
  classifyTransaction(transaction) {
    const criticalFunctions = [
      "receiveByBuyer", // Ownership transfer
      "createTeaBatch", // Asset creation
      "shipToTransporter", // Logistics transfer
    ];

    const criticalThresholds = {
      amount: 1000, // High value transactions
      quantity: 100, // Large batch sizes
      qualityScore: 95, // Premium quality
    };

    // Check if function is critical
    if (criticalFunctions.includes(transaction.function)) {
      return this.TRANSACTION_TYPES.CRITICAL;
    }

    // Check transaction parameters for critical thresholds
    if (transaction.args && transaction.args.length > 0) {
      // Check for high-value transactions
      const amountIndex = transaction.args.findIndex(
        (arg) =>
          !isNaN(parseFloat(arg)) && parseFloat(arg) > criticalThresholds.amount
      );
      if (amountIndex !== -1) {
        return this.TRANSACTION_TYPES.CRITICAL;
      }

      // Check for large quantities
      const quantityIndex = transaction.args.findIndex(
        (arg) =>
          arg.includes("kg") && parseInt(arg) > criticalThresholds.quantity
      );
      if (quantityIndex !== -1) {
        return this.TRANSACTION_TYPES.CRITICAL;
      }
    }

    return this.TRANSACTION_TYPES.REGULAR;
  }

  /**
   * PBFT Pre-Prepare Phase
   */
  prePrepare(request, clientId) {
    const transactionType = this.classifyTransaction(request);

    if (transactionType === this.TRANSACTION_TYPES.REGULAR) {
      // Route to Raft consensus
      return this.routeToRaft(request);
    }

    // PBFT for critical transactions
    const digest = this.computeDigest(request);
    const prePrepareMessage = {
      type: this.PHASES.PRE_PREPARE,
      view: this.viewNumber,
      sequence: this.sequenceNumber,
      digest: digest,
      request: request,
      clientId: clientId,
      timestamp: Date.now(),
    };

    this.sequenceNumber++;
    this.pendingRequests.set(digest, {
      request: request,
      clientId: clientId,
      timestamp: Date.now(),
    });

    console.log(`PBFT Pre-Prepare: ${digest.substring(0, 8)}...`);
    return this.broadcastToReplicas(prePrepareMessage);
  }

  /**
   * PBFT Prepare Phase
   */
  prepare(prePrepareMessage) {
    const { view, sequence, digest, request } = prePrepareMessage;

    // Verify pre-prepare message
    if (!this.verifyPrePrepare(prePrepareMessage)) {
      console.log("Invalid Pre-Prepare message");
      return false;
    }

    const prepareMessage = {
      type: this.PHASES.PREPARE,
      view: view,
      sequence: sequence,
      digest: digest,
      replicaId: this.getReplicaId(),
      timestamp: Date.now(),
    };

    // Store prepared message
    if (!this.preparedMessages.has(digest)) {
      this.preparedMessages.set(digest, []);
    }
    this.preparedMessages.get(digest).push(prepareMessage);

    console.log(`PBFT Prepare: ${digest.substring(0, 8)}...`);
    return this.broadcastToReplicas(prepareMessage);
  }

  /**
   * PBFT Commit Phase
   */
  commit(prepareMessage) {
    const { view, sequence, digest } = prepareMessage;

    // Check if we have enough prepare messages (2f + 1)
    const preparedMessages = this.preparedMessages.get(digest) || [];
    const requiredMessages = Math.floor((this.replicas.length - 1) / 3) * 2 + 1;

    if (preparedMessages.length >= requiredMessages) {
      const commitMessage = {
        type: this.PHASES.COMMIT,
        view: view,
        sequence: sequence,
        digest: digest,
        replicaId: this.getReplicaId(),
        timestamp: Date.now(),
      };

      // Store committed message
      if (!this.committedMessages.has(digest)) {
        this.committedMessages.set(digest, []);
      }
      this.committedMessages.get(digest).push(commitMessage);

      console.log(`PBFT Commit: ${digest.substring(0, 8)}...`);
      return this.broadcastToReplicas(commitMessage);
    }

    return false;
  }

  /**
   * PBFT Reply Phase
   */
  reply(commitMessage) {
    const { view, sequence, digest } = commitMessage;

    // Check if we have enough commit messages (2f + 1)
    const committedMessages = this.committedMessages.get(digest) || [];
    const requiredMessages = Math.floor((this.replicas.length - 1) / 3) * 2 + 1;

    if (committedMessages.length >= requiredMessages) {
      // Execute the request
      const pendingRequest = this.pendingRequests.get(digest);
      if (pendingRequest) {
        console.log(`PBFT Execute: ${digest.substring(0, 8)}...`);

        // Execute the transaction
        const result = this.executeTransaction(pendingRequest.request);

        // Send reply to client
        const replyMessage = {
          type: this.PHASES.REPLY,
          view: view,
          sequence: sequence,
          result: result,
          replicaId: this.getReplicaId(),
          timestamp: Date.now(),
        };

        this.pendingRequests.delete(digest);
        return replyMessage;
      }
    }

    return null;
  }

  /**
   * Route regular transactions to Raft consensus
   */
  routeToRaft(request) {
    console.log("Routing to Raft consensus for regular transaction");
    // This would integrate with the existing Raft implementation
    return {
      type: "RAFT_ROUTE",
      request: request,
      timestamp: Date.now(),
    };
  }

  /**
   * View change mechanism for fault tolerance
   */
  viewChange() {
    console.log("Initiating view change...");
    this.viewNumber++;

    // Select new primary (round-robin)
    const newPrimaryIndex = this.viewNumber % this.replicas.length;
    this.primary = this.replicas[newPrimaryIndex];

    console.log(`New primary: ${this.primary}`);
    return this.primary;
  }

  /**
   * Checkpoint mechanism for garbage collection
   */
  checkpoint(sequenceNumber) {
    if (sequenceNumber % this.checkpointInterval === 0) {
      const checkpointMessage = {
        type: "CHECKPOINT",
        sequence: sequenceNumber,
        state: this.getCurrentState(),
        replicaId: this.getReplicaId(),
        timestamp: Date.now(),
      };

      this.checkpoints.set(sequenceNumber, checkpointMessage);
      console.log(`Checkpoint created at sequence ${sequenceNumber}`);

      // Clean up old messages
      this.garbageCollect(sequenceNumber);
    }
  }

  /**
   * Utility functions
   */
  computeDigest(data) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }

  verifyPrePrepare(message) {
    // Verify message signature and format
    return (
      message.view === this.viewNumber && message.sequence > this.lastCheckpoint
    );
  }

  getReplicaId() {
    // Return current replica ID
    return `replica_${this.replicas.indexOf(this.primary)}`;
  }

  broadcastToReplicas(message) {
    // Broadcast message to all replicas
    console.log(
      `Broadcasting ${message.type} to ${this.replicas.length} replicas`
    );
    return message;
  }

  executeTransaction(request) {
    // Execute the actual transaction
    console.log(`Executing transaction: ${request.function}`);
    return {
      success: true,
      transactionId: this.generateTransactionId(),
      timestamp: Date.now(),
    };
  }

  getCurrentState() {
    // Return current state for checkpoint
    return {
      viewNumber: this.viewNumber,
      sequenceNumber: this.sequenceNumber,
      primary: this.primary,
    };
  }

  garbageCollect(sequenceNumber) {
    // Remove old messages
    const cutoff = sequenceNumber - this.checkpointInterval;

    for (const [digest, messages] of this.preparedMessages.entries()) {
      this.preparedMessages.set(
        digest,
        messages.filter((msg) => msg.sequence > cutoff)
      );
    }

    for (const [digest, messages] of this.committedMessages.entries()) {
      this.committedMessages.set(
        digest,
        messages.filter((msg) => msg.sequence > cutoff)
      );
    }
  }

  generateTransactionId() {
    return crypto.randomBytes(16).toString("hex");
  }

  /**
   * Performance metrics
   */
  getPerformanceMetrics() {
    return {
      totalTransactions: this.sequenceNumber,
      pbftTransactions: this.pendingRequests.size,
      raftTransactions: this.sequenceNumber - this.pendingRequests.size,
      averageResponseTime: this.calculateAverageResponseTime(),
      faultTolerance: this.calculateFaultTolerance(),
    };
  }

  calculateAverageResponseTime() {
    // Calculate average response time
    const times = Array.from(this.pendingRequests.values()).map(
      (req) => Date.now() - req.timestamp
    );

    return times.length > 0
      ? times.reduce((a, b) => a + b, 0) / times.length
      : 0;
  }

  calculateFaultTolerance() {
    // Calculate fault tolerance (f = (n-1)/3)
    const n = this.replicas.length;
    const f = Math.floor((n - 1) / 3);
    return {
      totalNodes: n,
      maxFaultyNodes: f,
      faultTolerancePercentage: (f / n) * 100,
    };
  }
}

module.exports = HybridPBFTConsensus;
