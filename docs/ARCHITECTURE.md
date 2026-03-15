# TreasuryYield Architecture

## Overview
TreasuryYield is a platform for tokenized US Treasury Bills (T-Bills) built on the BNB Chain. The protocol allows users to deposit stablecoins (e.g., USDC, USDT) into a YieldVault and receive TBILL tokens representing fractionalized, yield-bearing T-Bill ownership.

## Smart Contracts

### 1. BaseRWA.sol (Shared)
A standardized base contract shared across all RWA projects, providing generic ERC20 features, role-based access control (RBAC), pausability, reentrancy guards, and basic KYC compliance logic.

### 2. TBillToken.sol
- Inherits `BaseRWA.sol`.
- Represents the tokenized T-Bill asset.
- Value-accruing model: The TBILL token price increases relative to USD to reflect accrued T-Bill yield.
- Requires KYC for transfers (whitelisting required).

### 3. YieldVault.sol
- The core interaction point for users.
- Accepts stablecoin deposits to mint TBILL tokens based on the current TBILL oracle price.
- Handles stablecoin withdrawals by burning TBILL tokens, returning the appreciated value to the user.

### 4. TBillOracle.sol
- Integrates with Chainlink Price Feeds.
- Provides a normalized 18-decimal price feed for T-Bill valuation, mitigating discrepancies in decimals across different oracle feeds.
- An off-chain keeper function routinely queries `TBillOracle.getLatestPrice()` and updates `TBillToken.updatePrice()` to continually appreciate the asset value.

## Frontend (Next.js)
- Built with Next.js 14 App Router.
- Styled using TailwindCSS, shadcn/ui, and Magic UI.
- Web3 integration powered by RainbowKit, wagmi, and viem.
- Core pages: Dashboard (Yields, Portfolio Value), Deposit/Withdraw UI, Transaction History.
