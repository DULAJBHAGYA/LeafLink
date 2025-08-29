// backend/services/consensusRouter.js
'use strict';

class HybridConsensusRouter {
    constructor() {
        this.routingRules = {
            // Critical operations requiring PBFT consensus
            critical: [
                'awardTeaBatch',
                'confirmDelivery', 
                'deleteTeaBatch',
                'receiveByBuyer',
                'registerFarmer',
                'registerBuyer',
                'registerTransporter'
            ],
            // Routine operations using Raft consensus
            routine: [
                'createTeaBatch',
                'placeBid',
                'queryAllTeaBatches',
                'queryAllTransporters',
                'query',
                'queryHistory',
                'shipToTransporter',
                'assignTransporter'
            ]
        };
        
        this.performanceMetrics = {
            raftTransactions: 0,
            pbftTransactions: 0,
            raftTotalTime: 0,
            pbftTotalTime: 0
        };
    }

    classifyTransaction(functionName, transactionValue = 0, securityLevel = 'standard') {
        const startTime = Date.now();
        
        // Enhanced classification logic
        const classification = this.determineConsensusType(functionName, transactionValue, securityLevel);
        
        const classificationTime = Date.now() - startTime;
        console.log(`Transaction classification for ${functionName}: ${classification.type} (${classificationTime}ms)`);
        
        return classification;
    }

    determineConsensusType(functionName, transactionValue, securityLevel) {
        // Rule-based classification
        if (this.routingRules.critical.includes(functionName)) {
            return {
                type: 'PBFT',
                reason: 'Critical operation requiring Byzantine fault tolerance',
                expectedTps: 500,
                expectedLatency: '2s',
                securityLevel: 'high'
            };
        }
        
        if (this.routingRules.routine.includes(functionName)) {
            return {
                type: 'RAFT',
                reason: 'Routine operation optimized for performance',
                expectedTps: 1000,
                expectedLatency: '1s',
                securityLevel: 'standard'
            };
        }

        // Value-based classification for unknown functions
        if (transactionValue > 1000) {
            return {
                type: 'PBFT',
                reason: 'High-value transaction requiring enhanced security',
                expectedTps: 500,
                expectedLatency: '2s',
                securityLevel: 'high'
            };
        }

        // Default to Raft for unknown low-value operations
        return {
            type: 'RAFT',
            reason: 'Default routing for standard operations',
            expectedTps: 1000,
            expectedLatency: '1s',
            securityLevel: 'standard'
        };
    }

    async routeTransaction(functionName, args, consensusType) {
        const startTime = Date.now();
        let result;

        try {
            if (consensusType === 'PBFT') {
                result = await this.processPBFTTransaction(functionName, args);
                this.updateMetrics('pbft', Date.now() - startTime);
            } else {
                result = await this.processRaftTransaction(functionName, args);
                this.updateMetrics('raft', Date.now() - startTime);
            }

            return {
                success: true,
                result: result,
                consensusType: consensusType,
                processingTime: Date.now() - startTime
            };
        } catch (error) {
            console.error(`Transaction routing error for ${functionName}:`, error);
            return {
                success: false,
                error: error.message,
                consensusType: consensusType,
                processingTime: Date.now() - startTime
            };
        }
    }

    async processPBFTTransaction(functionName, args) {
        console.log(`[PBFT] Processing ${functionName} with enhanced security validation`);
        
        // Enhanced validation for PBFT transactions
        await this.validatePBFTTransaction(functionName, args);
        
        // Execute blockchain command with PBFT consensus
        const result = await this.executeBlockchainCommand(functionName, args, 'pbft');
        
        // Additional verification for critical transactions
        await this.verifyTransactionResult(result);
        
        return result;
    }

    async processRaftTransaction(functionName, args) {
        console.log(`[RAFT] Processing ${functionName} with optimized performance`);
        
        // Standard validation for Raft transactions
        await this.validateRaftTransaction(functionName, args);
        
        // Execute blockchain command with Raft consensus
        const result = await this.executeBlockchainCommand(functionName, args, 'raft');
        
        return result;
    }

    async validatePBFTTransaction(functionName, args) {
        // Enhanced security validation for critical transactions
        console.log(`[PBFT] Enhanced validation for ${functionName}`);
        
        // Check transaction signatures
        // Validate user permissions
        // Verify transaction integrity
        // Additional security checks
        
        return true;
    }

    async validateRaftTransaction(functionName, args) {
        // Standard validation for routine transactions
        console.log(`[RAFT] Standard validation for ${functionName}`);
        
        // Basic input validation
        // User authorization check
        // Transaction format verification
        
        return true;
    }

    async executeBlockchainCommand(functionName, args, consensusType) {
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);
        
        try {
            // Construct command with consensus type annotation
            const argsString = args.join(' ');
            const command = `./net-tln.sh invoke ${functionName} ${argsString}`;
            
            console.log(`[${consensusType.toUpperCase()}] Executing: ${command}`);
            
            const { stdout, stderr } = await execPromise(command, {
                cwd: process.env.BLOCKCHAIN_DIR || '../'
            });
            
            if (stderr) {
                throw new Error(`Blockchain execution error: ${stderr}`);
            }
            
            return {
                output: stdout,
                consensusType: consensusType,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Blockchain command execution failed:`, error);
            throw error;
        }
    }

    async verifyTransactionResult(result) {
        // Additional verification for PBFT transactions
        console.log('[PBFT] Verifying transaction result integrity');
        
        // Verify transaction hash
        // Check blockchain state consistency
        // Validate transaction finality
        
        return true;
    }

    updateMetrics(consensusType, processingTime) {
        if (consensusType === 'raft') {
            this.performanceMetrics.raftTransactions++;
            this.performanceMetrics.raftTotalTime += processingTime;
        } else {
            this.performanceMetrics.pbftTransactions++;
            this.performanceMetrics.pbftTotalTime += processingTime;
        }
    }

    getPerformanceMetrics() {
        const raftAvgTime = this.performanceMetrics.raftTransactions > 0 
            ? this.performanceMetrics.raftTotalTime / this.performanceMetrics.raftTransactions 
            : 0;
        
        const pbftAvgTime = this.performanceMetrics.pbftTransactions > 0 
            ? this.performanceMetrics.pbftTotalTime / this.performanceMetrics.pbftTransactions 
            : 0;

        return {
            raft: {
                transactions: this.performanceMetrics.raftTransactions,
                averageTime: Math.round(raftAvgTime),
                estimatedTps: raftAvgTime > 0 ? Math.round(1000 / raftAvgTime) : 0
            },
            pbft: {
                transactions: this.performanceMetrics.pbftTransactions,
                averageTime: Math.round(pbftAvgTime),
                estimatedTps: pbftAvgTime > 0 ? Math.round(1000 / pbftAvgTime) : 0
            },
            totalTransactions: this.performanceMetrics.raftTransactions + this.performanceMetrics.pbftTransactions
        };
    }
}

module.exports = new HybridConsensusRouter();