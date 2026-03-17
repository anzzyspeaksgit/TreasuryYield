# Deployment Guide

This guide details the deployment process for the TreasuryYield smart contracts to the BNB Chain Testnet or Mainnet.

## Prerequisites

1. **Foundry**: Ensure `forge` and `cast` are installed.
2. **Environment Variables**: Create a `.env` file in the root of the project with:
   ```env
   PRIVATE_KEY=your_deployer_private_key
   RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
   ETHERSCAN_API_KEY=your_bscscan_api_key
   ```
3. **Dependencies**: Run `forge install` to ensure OpenZeppelin dependencies are ready.

## Deployment Steps

The `Deploy.s.sol` script orchestrates the deployment of the entire protocol suite.

### 1. Execute Deployment Script
Run the following command to deploy and verify the contracts on the blockchain:
```bash
forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast --verify --delay 10 --retries 5
```
*Note: Depending on the network (e.g., BNB Testnet), you may need to append `--legacy` to the command if EIP-1559 gas pricing is not fully supported.*

### 2. Verify Contract Setup
Once deployed, the script automatically wires the permissions:
- `MockStablecoin` (or standard USDC/USDT on mainnet) is deployed.
- `TBillToken` is deployed.
- `YieldVault` is deployed, taking the Stablecoin and TBillToken as underlying assets.
- `TBillOracle` is deployed and linked to the standard Chainlink Price Feed for the target asset.
- `TBillKeeper` is deployed.
- The `MINTER_ROLE` is granted to the `YieldVault` by the `TBillToken`.
- The `ORACLE_ROLE` is granted to the `TBillKeeper` by the `TBillToken`.

### 3. Register Chainlink Automation
For the yield to accrue autonomously:
1. Navigate to the [Chainlink Automation Network](https://automation.chain.link/).
2. Register a new Custom Logic Upkeep.
3. Supply the deployed `TBillKeeper` address.
4. Fund the Upkeep with LINK tokens.
5. The Keeper network will now automatically call `performUpkeep()` every 24 hours (or the configured interval).

## Local Testing
To deploy to a local Anvil instance for UI testing:
```bash
anvil &
make deploy-local
```
This deploys the protocol to `http://127.0.0.1:8545` using the default Anvil accounts.
