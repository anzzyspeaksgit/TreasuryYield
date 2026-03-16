# Security & Threat Model

This document outlines the security architecture, role-based access control (RBAC), and core invariants of the TreasuryYield smart contract ecosystem.

## 1. Role-Based Access Control (RBAC)

TreasuryYield utilizes OpenZeppelin's `AccessControl` to enforce strict permission boundaries across the protocol.

| Role | Assigned To | Capabilities |
|------|------------|--------------|
| `DEFAULT_ADMIN_ROLE` | Multi-sig / Deployer | Grants/revokes roles, updates `yieldRate`, executes `rescueTokens`, updates `priceFeed` in Oracle. |
| `MINTER_ROLE` | `YieldVault` Contract | Can `mint()` new `TBILL` tokens. Restricted explicitly to the Vault to ensure tokens are only minted 1:1 against stablecoin deposits. |
| `ORACLE_ROLE` | `TBillKeeper` Contract | Can call `updatePrice()` on the `TBILL` token to reflect off-chain Treasury yield accrual. |
| `PAUSER_ROLE` | Admin / Guardian | Can trigger emergency `pause()` and `unpause()` on the `YieldVault` to halt deposits and withdrawals during black-swan events. |

## 2. Core Invariants

To maintain protocol solvency and robust economic guarantees, the following invariants are strictly preserved:

1. **Fully Backed TVL**: 
   The total value of `TBILL` in circulation (converted to USD) must always be less than or equal to the stablecoin balance held by the `YieldVault`.
   `TBillToken.totalSupply() * TBillToken.getAssetPrice() / 1e18 <= Stablecoin.balanceOf(YieldVault)`

2. **Monotonic Price Accrual**:
   The T-Bill Oracle feed is expected to be monotonically increasing to simulate yield. If the price drops, it represents a structural default of the US Government. (Smart contract handles negative price protection in the oracle wrapper).

3. **Restricted Mints**:
   No EOA (Externally Owned Account) can manually mint `TBILL` tokens. Mints are exclusively executed via the `YieldVault.deposit()` function when an equivalent underlying stablecoin is locked.

## 3. Defense in Depth Mechanisms

- **Reentrancy Protection**: `YieldVault` uses OpenZeppelin's `ReentrancyGuard` (`nonReentrant`) on both `deposit` and `withdraw`.
- **Pausability**: OpenZeppelin's `Pausable` module is integrated into the `YieldVault` to freeze all asset movements if a vulnerability is detected.
- **SafeERC20**: All stablecoin transfers use `SafeERC20` (`safeTransfer`, `safeTransferFrom`) to handle non-standard ERC20 implementations seamlessly.
- **KYC Whitelist**: Leverages the inherited `requiresKYC` parameter from `BaseRWA.sol`. `_update` transfer hooks revert any transfer between non-whitelisted addresses, strictly complying with US securities regulations.
- **Token Recovery**: `rescueTokens()` allows admins to retrieve mistakenly sent ERC20s, but *explicitly hardcodes a revert* if an admin attempts to withdraw the underlying stablecoin collateral.

## 4. Audit Coverage
- **Unit & Fuzz Testing**: The protocol achieves 100% statement and branch coverage via Foundry. Fuzz tests simulate extreme deposit/withdraw limits to verify mathematical rounding integrity.
