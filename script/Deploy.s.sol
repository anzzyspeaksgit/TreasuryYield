// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TBillToken.sol";
import "../src/YieldVault.sol";
import "../src/TBillOracle.sol";
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

        // 4. Grant roles
        tbill.grantRole(tbill.MINTER_ROLE(), address(vault));

        vm.stopBroadcast();
    }
}
