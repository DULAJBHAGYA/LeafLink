const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const redis = require("redis");

const app = express();
app.use(cors());
app.use(express.json());

// Redis Client Setup
let redisClient = null;

try {
  redisClient = redis.createClient({
    // Ensure your Redis instance is accessible at this URL
    url: "redis://localhost:6379",
  });

  redisClient.on("error", (err) => {
    console.log("Redis Client Error - Continuing without cache:", err.message);
  });

  (async () => {
    try {
      await redisClient.connect();
      console.log("Redis connected successfully");
    } catch (err) {
      console.log("Redis connection failed - continuing without cache");
      redisClient = null;
    }
  })();
} catch (err) {
  console.log("Redis not available - continuing without cache");
  redisClient = null;
}

const NETWORK_DIR = path.resolve(__dirname, "..");
const CLI = "./net-tln.sh invoke";

// --- Caching and Invalidation Logic ---

const CACHE_EXPIRATION = 3600; // 1 hour

// Middleware to check cache before proceeding
async function cache(req, res, next) {
  if (!redisClient) {
    console.log("Cache MISS (Redis not available)");
    next();
    return;
  }

  const cacheKey = req.originalUrl;
  try {
    const data = await redisClient.get(cacheKey);
    if (data) {
      console.log(`Cache HIT for ${cacheKey}`);
      return res.json({ result: data, source: "cache" });
    }
    console.log(`Cache MISS for ${cacheKey}`);
    res.locals.cacheKey = cacheKey; // Pass key to the route handler
    next();
  } catch (err) {
    console.error("Redis cache read error:", err);
    next(); // On error, proceed without caching
  }
}

// Invalidation middleware for different route patterns
function invalidateCache(pattern) {
  return (req, res, next) => {
    if (!redisClient) {
      console.log("Cache invalidation skipped (Redis not available)");
      next();
      return;
    }

    (async () => {
      try {
        console.log(`Invalidating cache with pattern: ${pattern}`);
        let cursor = 0;
        do {
          const reply = await redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
          });
          cursor = reply.cursor;
          const keys = reply.keys;
          if (keys.length > 0) {
            await redisClient.del(keys);
            console.log("Invalidated keys:", keys);
          }
        } while (cursor !== 0);
      } catch (err) {
        console.error("Redis cache invalidation error:", err);
      }
    })();
    next();
  };
}

function runCmd(cmd, res) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] Starting transaction: ${cmd}`);

  exec(cmd, { cwd: NETWORK_DIR }, async (error, stdout, stderr) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const endTimestamp = new Date().toISOString();

    if (error) {
      console.log(
        `[${endTimestamp}] Transaction FAILED after ${duration}ms: ${cmd}`
      );
      console.log(`Error: ${stderr || error.message}`);
      res.status(500).json({
        error: stderr || error.message,
        timestamp: timestamp,
        duration: duration,
        status: "failed",
      });
    } else {
      console.log(
        `[${endTimestamp}] Transaction SUCCESS after ${duration}ms: ${cmd}`
      );
      const { cacheKey } = res.locals;
      if (cacheKey && redisClient) {
        try {
          await redisClient.set(cacheKey, stdout, { EX: CACHE_EXPIRATION });
          console.log(`Cached data for ${cacheKey}`);
        } catch (err) {
          console.error("Redis cache write error:", err);
        }
      }
      res.json({
        result: stdout,
        timestamp: timestamp,
        duration: duration,
        status: "success",
      });
    }
  });
}

// --- Route Definitions ---

// Register Farmer (no cache invalidation needed for this example)
app.post("/api/farmer", (req, res) => {
  const { farmer } = req.body;
  if (!farmer) return res.status(400).json({ error: "Missing farmer data" });
  runCmd(`${CLI} registerFarmer 1 "${farmer}"`, res);
});

// Register Transporter
app.post(
  "/api/transporter",
  invalidateCache("/api/transporters*"),
  (req, res) => {
    const { transporter } = req.body;
    if (!transporter)
      return res.status(400).json({ error: "Missing transporter data" });
    runCmd(`${CLI} registerTransporter 1 "${transporter}"`, res);
  }
);

// Register Buyer (no cache invalidation needed for this example)
app.post("/api/buyer", (req, res) => {
  const { buyer } = req.body;
  if (!buyer) return res.status(400).json({ error: "Missing buyer data" });
  runCmd(`${CLI} registerBuyer 1 "${buyer}"`, res);
});

// Create Tea Batch
app.post("/api/teabatch", invalidateCache("/api/teabatch*"), (req, res) => {
  const { teabatch } = req.body;
  if (!teabatch) {
    return res.status(400).json({ error: "Missing tea batch data" });
  }
  runCmd(`${CLI} createTeaBatch 1 "${teabatch}"`, res);
});

// Query Tea Batch
app.get("/api/teabatch/:batchId", cache, (req, res) => {
  runCmd(`${CLI} query 1 "${req.params.batchId}"`, res);
});

// Query All Tea Batches
app.get("/api/teabatch", cache, (req, res) => {
  runCmd(`${CLI} queryAllTeaBatches 1`, res);
});

// Delete Tea Batch
app.delete(
  "/api/teabatch/:batchId",
  invalidateCache("/api/teabatch*"),
  (req, res) => {
    runCmd(`${CLI} deleteTeaBatch 1 "${req.params.batchId}"`, res);
  }
);

// Place Bid
app.post("/api/bid", invalidateCache("/api/bid*"), (req, res) => {
  const { bid } = req.body;
  if (!bid) return res.status(400).json({ error: "Missing bid data" });
  runCmd(`${CLI} placeBid 1 "${bid}"`, res);
});

// Query All Bids
app.get("/api/bids", cache, (req, res) => {
  runCmd(`${CLI} queryBids 1`, res);
});

// Award Tea Batch
app.post("/api/award", invalidateCache("/api/teabatch*"), (req, res) => {
  const { award } = req.body;
  if (!award) return res.status(400).json({ error: "Missing award data" });
  runCmd(`${CLI} awardTeaBatch 1 "${award}"`, res);
});

// Assign Transporter
app.post("/api/assign", invalidateCache("/api/teabatch*"), (req, res) => {
  const { assign } = req.body;
  if (!assign) return res.status(400).json({ error: "Missing assign data" });
  runCmd(`${CLI} assignTransporter 1 "${assign}"`, res);
});

// Ship to Transporter
app.post("/api/ship", invalidateCache("/api/teabatch*"), (req, res) => {
  const { ship } = req.body;
  if (!ship) return res.status(400).json({ error: "Missing ship data" });
  runCmd(`${CLI} shipToTransporter 1 "${ship}"`, res);
});

// Confirm Delivery
app.post("/api/confirm", invalidateCache("/api/teabatch*"), (req, res) => {
  const { confirm } = req.body;
  if (!confirm) return res.status(400).json({ error: "Missing confirm data" });
  runCmd(`${CLI} confirmDelivery 1 "${confirm}"`, res);
});

// Buyer Receives Batch
app.post("/api/receive", invalidateCache("/api/teabatch*"), (req, res) => {
  const { receive } = req.body;
  if (!receive) return res.status(400).json({ error: "Missing receive data" });
  runCmd(`${CLI} receiveByBuyer 1 "${receive}"`, res);
});

// Query All Assets
app.get("/api/assets", cache, (req, res) => {
  runCmd(`${CLI} queryAll 1`, res);
});

// Query Asset History
app.get("/api/asset/:assetId/history", cache, (req, res) => {
  runCmd(`${CLI} queryHistory 1 "${req.params.assetId}"`, res);
});

// Query All Transporters
app.get("/api/transporters", cache, (req, res) => {
  runCmd(`${CLI} queryAllTransporters 1`, res);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Tea Ledger API server running on port ${PORT}`);
});
