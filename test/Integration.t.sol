// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TBillToken.sol";
import "../src/YieldVault.sol";
import "../src/TBillOracle.sol";
import "../src/TBillKeeper.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockStablecoin is ERC20 {
    constructor() ERC20("Mock USD", "mUSD") {}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockAggregator {
    int256 _price;
    uint8 _decimals;

    constructor(int256 price, uint8 dec) {
        _price = price;
        _decimals = dec;
    }

    function setPrice(int256 price) external {
        _price = price;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }
}

contract TreasuryYieldIntegrationTest is Test {
    MockStablecoin stablecoin;
    TBillToken tbill;
    YieldVault vault;
    TBillOracle oracle;
    TBillKeeper keeper;
    MockAggregator mockFeed;

    address admin = address(0x1);
    address user = address(0x2);

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy Core
        stablecoin = new MockStablecoin();
        tbill = new TBillToken();
        vault = new YieldVault(address(stablecoin), address(tbill));

        // 2. Deploy Oracle & Keeper
        mockFeed = new MockAggregator(1e8, 8); // $1.00 initially
        oracle = new TBillOracle(address(mockFeed));
        keeper = new TBillKeeper(address(tbill), address(oracle), 1 days);

        // 3. Grant Roles
        tbill.grantRole(tbill.MINTER_ROLE(), address(vault));
        tbill.grantRole(tbill.ORACLE_ROLE(), address(keeper));
        
        // 4. Setup User
        tbill.setWhitelist(user, true);
        stablecoin.mint(user, 10000 * 1e18);

        vm.stopPrank();
    }

    function test_FullYieldLifecycle() public {
        // Phase 1: User Deposits Stablecoin
        vm.startPrank(user);
        uint256 depositAmount = 10000 * 1e18;
        stablecoin.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        
        // User should have exactly 10,000 TBILL because price is $1.00
        assertEq(tbill.balanceOf(user), 10000 * 1e18);
        assertEq(stablecoin.balanceOf(user), 0);
        vm.stopPrank();

        // Phase 2: Time Passes & Yield Accrues
        // Oracle price increases to $1.05 (5% yield)
        mockFeed.setPrice(105000000); // 1.05 * 10^8
        
        // Fast forward time past the Keeper interval
        vm.warp(block.timestamp + 1 days + 1);

        // Keeper performs upkeep
        keeper.performUpkeep("");
        
        // TBILL token internal price should now be $1.05
        assertEq(tbill.getAssetPrice(), 1.05 * 1e18);

        
        // Yield Injection: The institutional partner must deposit the yield back into the vault
        // Since price went from 1.00 to 1.05 for 10,000 TBILL, the yield is 500 mUSD.
        stablecoin.mint(address(vault), 500 * 1e18);

        // Phase 3: User Withdraws with Profit
        vm.startPrank(user);
        uint256 sharesToWithdraw = tbill.balanceOf(user); // 10,000 TBILL
        
        // Ensure user expects 10,500
        uint256 expectedReturn = (sharesToWithdraw * tbill.getAssetPrice()) / 1e18;
        assertEq(expectedReturn, 10500 * 1e18);

        tbill.approve(address(vault), sharesToWithdraw);
        vault.withdraw(sharesToWithdraw);
        vm.stopPrank();

        // User should receive 10,500 mUSD back (Initial 10,000 + 500 Yield)
        assertEq(tbill.balanceOf(user), 0);
        assertEq(stablecoin.balanceOf(user), 10500 * 1e18);
        assertEq(stablecoin.balanceOf(address(vault)), 0);
    }
}
