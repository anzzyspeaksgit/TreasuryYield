// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TBillToken.sol";
import "./TBillOracle.sol";

// Minimal Chainlink Automation Compatible Interface
interface AutomationCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

/**
 * @title TBillKeeper
 * @dev Chainlink Automation contract to regularly update the TBILL price
 */
contract TBillKeeper is AutomationCompatibleInterface, Ownable {
    TBillToken public tbillToken;
    TBillOracle public tbillOracle;
    
    uint256 public updateInterval;
    uint256 public lastTimeStamp;

    constructor(address _tbillToken, address _tbillOracle, uint256 _updateInterval) {
        tbillToken = TBillToken(_tbillToken);
        tbillOracle = TBillOracle(_tbillOracle);
        updateInterval = _updateInterval;
        lastTimeStamp = block.timestamp;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) >= updateInterval;
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        require((block.timestamp - lastTimeStamp) >= updateInterval, "Interval not reached");
        lastTimeStamp = block.timestamp;
        
        uint256 latestPrice = tbillOracle.getLatestPrice();
        tbillToken.updatePrice(latestPrice);
    }

    function setUpdateInterval(uint256 _interval) external onlyOwner {
        updateInterval = _interval;
    }

    function setOracle(address _tbillOracle) external onlyOwner {
        tbillOracle = TBillOracle(_tbillOracle);
    }
}
