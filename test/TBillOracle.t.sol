// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TBillOracle.sol";

contract MockAggregator is AggregatorV3Interface {
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

    function description() external pure returns (string memory) {
        return "Mock Feed";
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function getRoundData(uint80) external pure returns (uint80, int256, uint256, uint256, uint80) {
        return (1, 0, 0, 0, 1);
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }
}

contract TBillOracleTest is Test {
    TBillOracle oracle;
    MockAggregator mockFeed;

    function setUp() public {
        mockFeed = new MockAggregator(1e8, 8); // e.g. Chainlink USD feeds are 8 decimals
        oracle = new TBillOracle(address(mockFeed));
    }

    function test_GetLatestPrice() public {
        uint256 price = oracle.getLatestPrice();
        assertEq(price, 1e18); // Normalized to 18 decimals
    }

    function test_UpdatePriceFeed() public {
        MockAggregator newFeed = new MockAggregator(2e18, 18);
        oracle.updatePriceFeed(address(newFeed));
        assertEq(oracle.getLatestPrice(), 2e18);
    }
}
