// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "shared/contracts/BaseRWA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title TBillToken
 * @dev Tokenized US Treasury Bill (TBILL)
 * Extends BaseRWA to leverage shared architecture.
 */
contract TBillToken is BaseRWA {
    uint256 private currentPrice; // Fixed 18 decimals, USD value of 1 TBILL token
    uint256 public yieldRate; // APY in basis points (e.g. 500 = 5.00%)
    
    // Custom events
    event YieldRateUpdated(uint256 oldRate, uint256 newRate);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor() BaseRWA("TreasuryYield T-Bill", "TBILL", "US_TREASURY_BILL") {
        currentPrice = 1e18; // 1 TBILL = $1.00 USD initially
        requiresKYC = true; // Regulatory compliance for T-Bills
    }

    /**
     * @notice Mint TBILL tokens to a user
     * @dev Only MINTER_ROLE can call this (usually the YieldVault)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @notice Update the current price of the T-Bill token (e.g., from an Oracle)
     */
    function updatePrice(uint256 newPrice) external onlyRole(ORACLE_ROLE) {
        require(newPrice > 0, "Invalid price");
        uint256 oldPrice = currentPrice;
        currentPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }

    /**
     * @notice Update the yield rate / APY
     */
    function setYieldRate(uint256 _yieldRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldRate = yieldRate;
        yieldRate = _yieldRate;
        emit YieldRateUpdated(oldRate, _yieldRate);
    }

    /**
     * @notice BaseRWA override
     * @return current price of the asset
     */
    function getAssetPrice() public view override returns (uint256) {
        return currentPrice;
    }

    /**
     * @notice BaseRWA override
     * T-Bills are typically 100% collateralized 1:1 with USD/T-Bills
     */
    function getCollateralizationRatio() public pure override returns (uint256) {
        return 10000; // 100% (basis points)
    }
}
