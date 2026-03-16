# Smart Contract API Reference

## TBillToken
The `TBillToken` acts as the underlying token for the TreasuryYield protocol.

### `mint(address to, uint256 amount)`
- **Access**: `MINTER_ROLE` (YieldVault)
- **Description**: Mints fractionalized T-Bill tokens to the user based on Oracle pricing.

### `updatePrice(uint256 newPrice)`
- **Access**: `ORACLE_ROLE` (TBillKeeper)
- **Description**: Receives the normalized 18-decimal price from the Chainlink Oracle and updates the internal asset valuation.

### `setYieldRate(uint256 _yieldRate)`
- **Access**: `DEFAULT_ADMIN_ROLE`
- **Description**: Sets the nominal APY tracked by the UI (in basis points).

## YieldVault
The main entry point for user interaction.

### `deposit(uint256 amount)`
- **Description**: Users deposit the `STABLECOIN`. The vault calls `TBillToken.mint()` to issue them the equivalent TBILL tokens based on the current T-Bill valuation. 
- **Modifiers**: `nonReentrant`, `whenNotPaused`

### `withdraw(uint256 shares)`
- **Description**: Users burn their `TBILL` shares. The vault computes their appreciated value based on `TBillToken.getAssetPrice()` and returns the appropriate amount of `STABLECOIN`.
- **Modifiers**: `nonReentrant`, `whenNotPaused`

### `previewDeposit(uint256 amount)`
- **Description**: View function predicting how many TBILL shares will be minted.

### `previewWithdraw(uint256 shares)`
- **Description**: View function predicting how much STABLECOIN will be returned for burning TBILL.

### `pause()` / `unpause()`
- **Access**: `PAUSER_ROLE`
- **Description**: Emergency toggle to halt all deposits and withdrawals.

### `rescueTokens(address token, address to, uint256 amount)`
- **Access**: `DEFAULT_ADMIN_ROLE`
- **Description**: Recovers arbitrary ERC20 tokens mistakenly sent to the vault. Explicitly reverts if the token is the underlying stablecoin to protect user funds.
