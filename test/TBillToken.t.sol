// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TBillToken.sol";
import "../src/YieldVault.sol";
import "../src/TBillOracle.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock Stablecoin for testing
contract MockStablecoin is ERC20 {
    constructor() ERC20("Mock USD", "mUSD") {}
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract TBillTokenTest is Test {
    TBillToken tbill;
    YieldVault vault;
    MockStablecoin stablecoin;

    address admin = address(0x1);
    address user = address(0x2);

    function setUp() public {
        vm.startPrank(admin);
        
        stablecoin = new MockStablecoin();
        tbill = new TBillToken();
        vault = new YieldVault(address(stablecoin), address(tbill));

        // Grant roles
        tbill.grantRole(tbill.MINTER_ROLE(), address(vault));
        tbill.grantRole(tbill.ORACLE_ROLE(), admin);
        
        // Setup initial user state
        tbill.setWhitelist(user, true); // KYC the user
        stablecoin.mint(user, 10000 * 1e18); // Give user 10,000 mUSD
        
        vm.stopPrank();
    }

    function test_InitialState() public {
        assertEq(tbill.name(), "TreasuryYield T-Bill");
        assertEq(tbill.symbol(), "TBILL");
        assertEq(tbill.getAssetPrice(), 1e18); // 1 USD = 1 TBILL
    }

    function test_UpdatePrice() public {
        vm.prank(admin);
        tbill.updatePrice(1.05 * 1e18); // Price goes up by 5%
        assertEq(tbill.getAssetPrice(), 1.05 * 1e18);
    }

    function test_Deposit() public {
        vm.startPrank(user);
        
        stablecoin.approve(address(vault), 1000 * 1e18);
        vault.deposit(1000 * 1e18);
        
        // Price is 1e18, so 1000 mUSD = 1000 TBILL
        assertEq(tbill.balanceOf(user), 1000 * 1e18);
        assertEq(stablecoin.balanceOf(address(vault)), 1000 * 1e18);
        
        vm.stopPrank();
    }

    function test_Withdraw() public {
        vm.startPrank(user);
        
        // Deposit first
        stablecoin.approve(address(vault), 1000 * 1e18);
        vault.deposit(1000 * 1e18);
        
        // Withdraw 500 TBILL
        tbill.approve(address(vault), 500 * 1e18);
        vault.withdraw(500 * 1e18);
        
        // User should get 500 mUSD back, vault should have 500 mUSD remaining
        assertEq(tbill.balanceOf(user), 500 * 1e18);
        assertEq(stablecoin.balanceOf(address(vault)), 500 * 1e18);
        
        vm.stopPrank();
    }

    function test_YieldRate() public {
        vm.prank(admin);
        tbill.setYieldRate(500); // 5%
        assertEq(tbill.yieldRate(), 500);
    }

    function test_CollateralizationRatio() public {
        assertEq(tbill.getCollateralizationRatio(), 10000);
    }

    function test_RevertIf_UnwhitelistedTransfer() public {
        vm.startPrank(user);
        stablecoin.approve(address(vault), 1000 * 1e18);
        vault.deposit(1000 * 1e18);
        
        // Transfer to non-whitelisted address should fail
        address user2 = address(0x3);
        vm.expectRevert("KYC required");
        tbill.transfer(user2, 500 * 1e18);
        vm.stopPrank();
    }
}
