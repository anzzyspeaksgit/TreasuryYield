export const TBILL_TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 
export const YIELD_VAULT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 
export const STABLECOIN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export const TBILL_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function getAssetPrice() view returns (uint256)",
  "function yieldRate() view returns (uint256)"
];

export const YIELD_VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function previewDeposit(uint256 amount) view returns (uint256)",
  "function withdraw(uint256 shares) external",
  "function previewWithdraw(uint256 shares) view returns (uint256)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)"
];
