// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TBillKeeper.sol";
import "../src/TBillToken.sol";
import "../src/TBillOracle.sol";

contract MockAggregator {
    int256 _price;
    uint8 _decimals;

    constructor(int256 price, uint8 dec) {
        _price = price;
        _decimals = dec;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }
}

contract TBillKeeperTest is Test {
    TBillKeeper keeper;
    TBillToken tbill;
    TBillOracle oracle;
    MockAggregator mockFeed;

    function setUp() public {
        mockFeed = new MockAggregator(105e6, 8); // 1.05 USD, 8 decimals
        oracle = new TBillOracle(address(mockFeed));
        tbill = new TBillToken();
        keeper = new TBillKeeper(address(tbill), address(oracle), 1 days);
        
        // Grant Oracle role to Keeper so it can update price
        tbill.grantRole(tbill.ORACLE_ROLE(), address(keeper));
    }

    function test_CheckUpkeep() public {
        (bool upkeepNeeded, ) = keeper.checkUpkeep("");
        assertFalse(upkeepNeeded);
        
        vm.warp(block.timestamp + 1 days + 1);
        (bool upkeepNeeded2, ) = keeper.checkUpkeep("");
        assertTrue(upkeepNeeded2);
    }

    function test_PerformUpkeep() public {
        vm.warp(block.timestamp + 1 days + 1);
        keeper.performUpkeep("");
        
        // 105e6 * 10^(18-8) = 1.05e18
        assertEq(tbill.getAssetPrice(), 1.05e18);
    }

    function test_RevertIf_PerformUpkeepEarly() public {
        vm.expectRevert("Interval not reached");
        keeper.performUpkeep("");
    }
    
    function test_SetIntervalAndOracle() public {
        keeper.setUpdateInterval(2 days);
        assertEq(keeper.updateInterval(), 2 days);
        
        keeper.setOracle(address(0x1));
        assertEq(address(keeper.tbillOracle()), address(0x1));
    }
}
