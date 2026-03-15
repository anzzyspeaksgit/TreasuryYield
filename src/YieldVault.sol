// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./TBillToken.sol";

/**
 * @title YieldVault
 * @dev Vault for users to deposit stablecoins and mint TBILL tokens
 */
contract YieldVault is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    IERC20 public stablecoin;
    TBillToken public tbillToken;

    event Deposited(address indexed user, uint256 amount, uint256 sharesMinted);
    event Withdrawn(address indexed user, uint256 amount, uint256 sharesBurned);

    constructor(address _stablecoin, address _tbillToken) {
        stablecoin = IERC20(_stablecoin);
        tbillToken = TBillToken(_tbillToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /**
     * @notice Deposit stablecoins to mint TBILL tokens
     * @param amount Amount of stablecoins to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        require(tbillToken.isWhitelisted(msg.sender) || !tbillToken.requiresKYC(), "KYC required");

        // Transfer stablecoin from user to vault
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);

        // Get current price of TBILL (assumes both are 18 decimals or normalized)
        uint256 price = tbillToken.getAssetPrice();
        uint256 sharesToMint = (amount * 1e18) / price;

        // Mint TBILL
        tbillToken.mint(msg.sender, sharesToMint);

        emit Deposited(msg.sender, amount, sharesToMint);
    }

    /**
     * @notice Withdraw stablecoins by burning TBILL tokens
     * @param shares Amount of TBILL to burn
     */
    function withdraw(uint256 shares) external nonReentrant whenNotPaused {
        require(shares > 0, "Shares must be > 0");
        require(tbillToken.balanceOf(msg.sender) >= shares, "Insufficient balance");

        uint256 price = tbillToken.getAssetPrice();
        uint256 amountToReturn = (shares * price) / 1e18;

        require(stablecoin.balanceOf(address(this)) >= amountToReturn, "Insufficient vault liquidity");

        // Burn TBILL tokens
        tbillToken.burnFrom(msg.sender, shares);

        // Transfer stablecoins back
        stablecoin.safeTransfer(msg.sender, amountToReturn);

        emit Withdrawn(msg.sender, amountToReturn, shares);
    }

    /**
     * @notice Pauses deposits and withdrawals
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses deposits and withdrawals
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
