// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId)
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

/**
 * @title TBillOracle
 * @dev Integrates Chainlink Price Feeds to provide T-Bill valuation
 */
contract TBillOracle is AccessControl {
    AggregatorV3Interface public priceFeed;

    // In case there isn't a direct T-Bill price feed, we might use a combination
    // or a specialized RWA oracle. For demo purposes, we connect to a standard Chainlink feed.

    event PriceFeedUpdated(address oldFeed, address newFeed);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Update the Chainlink price feed address
     * @param _priceFeed New price feed address
     */
    function updatePriceFeed(address _priceFeed) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_priceFeed != address(0), "Invalid feed address");
        address oldFeed = address(priceFeed);
        priceFeed = AggregatorV3Interface(_priceFeed);
        emit PriceFeedUpdated(oldFeed, _priceFeed);
    }

    /**
     * @notice Get the latest price of the T-Bill asset
     * @return price Normalized to 18 decimals
     */
    function getLatestPrice() public view returns (uint256) {
        (
            /*uint80 roundId*/,
            int256 price,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid oracle price");

        uint8 decimals = priceFeed.decimals();

        // Normalize to 18 decimals
        if (decimals < 18) {
            return uint256(price) * (10 ** (18 - decimals));
        } else if (decimals > 18) {
            return uint256(price) / (10 ** (decimals - 18));
        }

        return uint256(price);
    }
}
