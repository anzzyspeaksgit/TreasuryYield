export const TBILL_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update after deployment
export const YIELD_VAULT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update after deployment
export const STABLECOIN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update after deployment

export const TBILL_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function getAssetPrice() view returns (uint256)",
  "function yieldRate() view returns (uint256)"
];

export const YIELD_VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 shares) external"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)"
];
