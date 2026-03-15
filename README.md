# TreasuryYield 🇺🇸

Tokenized US Treasury Bills platform on BNB Chain for the RWA Demo Day.

TreasuryYield enables users to deposit stablecoins into a decentralized yield vault and receive `TBILL` tokens in return. The `TBILL` token acts as a fractionalized representation of actual US Treasury Bills, and its price natively accrues yield over time through Chainlink Oracle pricing inputs. 

## Features

- **T-Bill Token (`TBILL`)**: Fully KYC-compliant, fractionally-backed ERC20 token representing US Treasury Bill yield.
- **YieldVault**: The core interaction point allowing seamless deposit (Stablecoin -> TBILL) and withdrawal (TBILL -> Stablecoin) fortified by OpenZeppelin's `Pausable` and `ReentrancyGuard`.
- **Chainlink Oracle Automation**: Powered by `TBillKeeper` and `TBillOracle` to constantly stream off-chain yield data into the smart contracts without manual intervention.
- **Frontend Dashboard**: Beautiful, real-time responsive Next.js 14 App Router UI providing transparency into user holdings, current APYs, and portfolio valuations, animated using `framer-motion` and Magic UI layouts.

## Live Demo 🚀
- **Frontend URL:** *(Vercel/Vite Deployment link goes here)*
- **Contract Addresses (Local Testnet):**
  - **Mock Stablecoin:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
  - **TBILL Token:** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
  - **Yield Vault:** `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

*(BNB Testnet deploy pending Hackathon wallet funding: `0xD166C3B81f10Aa22fbA73e18a89f9d9d87b96449`)*

## Tech Stack

- **Smart Contracts**: Solidity ^0.8.20, Foundry, OpenZeppelin 5.x.
- **Automation**: Chainlink Price Feeds & Chainlink Automation (`KeeperCompatibleInterface`).
- **Frontend**: Next.js 14, React 18, TailwindCSS, shadcn/ui, Magic UI.
- **Web3 Integration**: RainbowKit, wagmi, viem.

## Architecture & Learnings

Please refer to [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for an in-depth breakdown of the component structures.

We frequently contribute to the unified RWA hackathon learnings repository (`shared/learnings/collective.json`). Discoveries made during the development of TreasuryYield around Chainlink Oracle normalizations, Foundry layouts, and Next.js `use client` contexts can be found there.

---
*Built with ❤️ for the RWA Demo Day Hackathon.*
