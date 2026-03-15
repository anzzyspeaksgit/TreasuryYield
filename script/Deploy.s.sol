// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
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

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy mock stablecoin
        MockStablecoin stablecoin = new MockStablecoin();

        // 2. Deploy TBillToken
        TBillToken tbill = new TBillToken();

        // 3. Deploy YieldVault
        YieldVault vault = new YieldVault(address(stablecoin), address(tbill));

        // 4. Deploy Oracle (Mock address for BSC testnet: use actual later)
        address mockChainlinkFeed = address(0x123);
        TBillOracle oracle = new TBillOracle(mockChainlinkFeed);

        // 5. Deploy Keeper (1 day interval)
        TBillKeeper keeper = new TBillKeeper(address(tbill), address(oracle), 1 days);

        // 6. Grant roles
        tbill.grantRole(tbill.MINTER_ROLE(), address(vault));
        tbill.grantRole(tbill.ORACLE_ROLE(), address(keeper));

        vm.stopBroadcast();
    }
}
