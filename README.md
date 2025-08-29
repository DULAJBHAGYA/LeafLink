# LeafLink

A hybrid Hyperledger Fabric network and Next.js client for managing tea supply-chain workflows across Farmer, Transporter, and Buyer organizations. This monorepo contains:

- `LeafLink copy/tea-ledger-network`: Fabric network configs, chaincode, org apps, and automation scripts
- `leaflink-client`: Next.js 14 (App Router) web client for Farmer, Transporter, and Buyer roles

## Monorepo Structure

```
LeafLink/
  LeafLink copy/
    tea-ledger-network/
      backend/                 # Backend server for network utilities (Node.js)
      docker/                  # Docker Compose for Fabric, CAs, Redis
      organizations/           # Orgs (buyer, farmer, transporter) apps + chaincode
      scripts/                 # Helper scripts (createChannel, deploySmartContract)
      channel-artifacts/       # Channel and genesis artifacts
      system-genesis-block/    # Genesis block
      configtx/                # Fabric configtx.yaml
      core.yaml, orderer.yaml  # Fabric configs
      *.sh                     # Network lifecycle scripts
  leaflink-client/             # Next.js client (farmer/transporter/buyer)
```

## Prerequisites

- Docker Desktop 4.x
- Docker Compose v2
- Node.js 18+ and npm 9+
- Hyperledger Fabric binaries (already vendored under `LeafLink copy/bin`)
- MacOS 14+ (darwin) or Linux

## Quick Start

### 1) Start the Fabric network

From the repo root:

```bash
cd "LeafLink copy/tea-ledger-network"
# Start core services (orderer, peers, CAs, couchdb, etc.)
./net-tln.sh up

# Create channel and deploy chaincode
./scripts/createChannel.sh
./scripts/deploySmartContract.sh
```

Useful shortcuts:

```bash
# View sample/end-to-end data
./view-all-data.sh

# Run simple/hybrid PBFT test scenarios
./test-hybrid-simple.sh
./test-hybrid-pbft.sh
```

To stop the network:

```bash
./net-tln.sh down
```

### 2) Seed org application wallets (optional)

Each org app under `organizations/*/application` may require local wallet setup to connect to Fabric.
Follow the respective `application/README` or scripts in `scripts/`.

### 3) Run the web client

```bash
cd ../../leaflink-client
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Web Client Overview (Next.js)

- App Router structure under `src/app`
- Separate layouts and pages per role:
  - `farmer`: dashboard, add tea batch, list tea batches
  - `transporter`: dashboard, delivery details
  - `buyer`: dashboard, batch detail view
- Auth pages: `login` and `register`
- TailwindCSS for styling

Key paths:

- `src/app/farmer/*`
- `src/app/transporter/*`
- `src/app/buyer/*`
- `src/app/login/page.tsx`, `src/app/register/page.tsx`

## Fabric Network Overview

- 3 Orgs: Org1 (Farmer), Org2 (Transporter), Org3 (Buyer)
- Chaincode:
  - `organizations/*/contract/lib/pharmaledgercontract.js`
  - Hybrid PBFT integration (`organizations/buyer/contract-hybrid/*`)
- Channel artifacts under `channel-artifacts/`
- Config files: `configtx/configtx.yaml`, `core.yaml`, `orderer.yaml`

Primary scripts:

- `scripts/createChannel.sh`: Creates channel and sets anchor peers
- `scripts/deploySmartContract.sh`: Packages and deploys chaincode
- `scripts/invokeContract.sh`: Example invocations
- `update-chaincode.sh`: Upgrade chaincode
- `view-all-data.sh`: Query network data

## Common Commands

```bash
# From tea-ledger-network root
./quick-view.sh            # Quick data view
./quick-timing.sh          # Quick timing metrics
./monitor-performance.sh   # Monitor network performance
./run-test-scenario.sh     # Run a bundled scenario
```

## Development Notes

- Do not commit large/generated folders (e.g., `node_modules`, crypto artifacts) to avoid repo bloat. Use `.gitignore`.
- If you see "embedded repository" or submodule warnings for `LeafLink copy`, remove the inner `.git` from that folder:

```bash
rm -rf "LeafLink copy/.git"
```

- If the remote push fails with "Repository not found", verify the remote URL:

```bash
git remote -v
# Update if needed
git remote set-url origin <correct-url>
```

## Security & Secrets

- Crypto material under `organizations/*/msp` and `tls` is sensitive. Store and share securely. Prefer generating locally per developer via scripts.
- Never expose private keys or certs publicly.

## Troubleshooting

- Containers failing:
  - Ensure Docker has at least 4 CPUs and 8GB RAM
  - Run `./net-tln.sh down` and `docker system prune -f` before retrying
- Chaincode not found:
  - Re-run `scripts/deploySmartContract.sh` after `createChannel.sh`
- Client cannot connect:
  - Verify connection profiles under `organizations/*/connection-*.json/.yaml`
  - Ensure wallets are initialized for each org app

## License

MIT
