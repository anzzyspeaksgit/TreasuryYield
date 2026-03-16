"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Shield, Sparkles } from "lucide-react";

import { 
  TBILL_TOKEN_ADDRESS, 
  YIELD_VAULT_ADDRESS, 
  STABLECOIN_ADDRESS, 
  TBILL_TOKEN_ABI, 
  YIELD_VAULT_ABI, 
  ERC20_ABI 
} from "@/config/contracts";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  const { data: tbillBalance } = useReadContract({
    address: TBILL_TOKEN_ADDRESS,
    abi: TBILL_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  const { data: assetPrice } = useReadContract({
    address: TBILL_TOKEN_ADDRESS,
    abi: TBILL_TOKEN_ABI,
    functionName: "getAssetPrice",
  });

  const { data: yieldRate } = useReadContract({
    address: TBILL_TOKEN_ADDRESS,
    abi: TBILL_TOKEN_ABI,
    functionName: "yieldRate",
  });

  const { writeContractAsync } = useWriteContract();

  const handleDeposit = async () => {
    if (!depositAmount || !address) return;
    try {
      const amountParsed = parseUnits(depositAmount, 18);
      await writeContractAsync({
        address: STABLECOIN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [YIELD_VAULT_ADDRESS, amountParsed],
      });
      await writeContractAsync({
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "deposit",
        args: [amountParsed],
      });
      setDepositAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) return;
    try {
      const amountParsed = parseUnits(withdrawAmount, 18);
      await writeContractAsync({
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "withdraw",
        args: [amountParsed],
      });
      setWithdrawAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const formattedBalance = tbillBalance ? Number(formatUnits(tbillBalance as bigint, 18)).toFixed(4) : "0.0000";
  const formattedPrice = assetPrice ? Number(formatUnits(assetPrice as bigint, 18)).toFixed(4) : "1.0000";
  const formattedYield = yieldRate ? (Number(yieldRate) / 100).toFixed(2) : "5.00";
  const portfolioValue = tbillBalance && assetPrice 
    ? (Number(formatUnits(tbillBalance as bigint, 18)) * Number(formatUnits(assetPrice as bigint, 18))).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      <div className="fixed inset-0 -z-10 opacity-20" 
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} 
      />

      <div className="relative z-10">
        <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl">
              🏛️
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              TreasuryYield
            </span>
          </div>
          <ConnectButton />
        </header>

        <main className="px-6 py-12 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">US Treasury Bills on Chain</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Earn Government-Backed
              <br />
              Yields On-Chain
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Deposit stablecoins, receive TBILL tokens backed by real US Treasury Bills.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Current APY</span>
              </div>
              <div className="text-2xl font-bold">{formattedYield}%</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">TBILL Price</span>
              </div>
              <div className="text-2xl font-bold">${formattedPrice}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Your Balance</span>
              </div>
              <div className="text-2xl font-bold">{formattedBalance}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Portfolio Value</span>
              </div>
              <div className="text-2xl font-bold">${portfolioValue}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'deposit' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" /> Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'withdraw' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowUpFromLine className="w-4 h-4" /> Withdraw
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'deposit' ? (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (USDC)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-4 mb-4 bg-black/50 border border-white/10 rounded-xl text-2xl font-medium focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={!isConnected || !depositAmount}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      {isConnected ? 'Deposit' : 'Connect Wallet'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (TBILL)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-4 mb-4 bg-black/50 border border-white/10 rounded-xl text-2xl font-medium focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={handleWithdraw}
                      disabled={!isConnected || !withdrawAmount}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                    >
                      {isConnected ? 'Withdraw' : 'Connect Wallet'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-2">100% Backed</h3>
              <p className="text-sm text-gray-400">Every TBILL token is backed 1:1 by real US Treasury Bills</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-2">Instant Liquidity</h3>
              <p className="text-sm text-gray-400">Deposit and withdraw anytime with no lock-up periods</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-2">Chainlink Oracles</h3>
              <p className="text-sm text-gray-400">Real-time price feeds ensure accurate valuations</p>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-6 px-6 text-center text-gray-500 text-sm">
          © 2026 TreasuryYield. Built for RWA Demo Day.
        </footer>
      </div>
    </div>
  );
}
