"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Shield, Sparkles, DollarSign, Percent, Clock, ChevronRight } from "lucide-react";

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
        args: [amountParsed, address],
      });
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
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
        args: [amountParsed, address, address],
      });
      setWithdrawAmount("");
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const formattedBalance = tbillBalance ? formatUnits(tbillBalance as bigint, 18) : "0";
  const formattedPrice = assetPrice ? formatUnits(assetPrice as bigint, 8) : "1.00";
  const formattedYield = yieldRate ? (Number(yieldRate) / 100).toFixed(2) : "5.25";

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white overflow-hidden">
      {/* Animated Background - Green/Emerald Theme */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0a] via-[#0f1a0f] to-[#0a0f0a]" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-emerald-600/15 via-green-600/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[80px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 lg:px-12 py-5 border-b border-emerald-500/10">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">TreasuryYield</span>
          </div>
          <ConnectButton />
        </nav>
      </header>

      <main className="relative z-10 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6"
            >
              <Shield className="w-4 h-4" />
              US Treasury-Backed Yields
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              <span className="text-white">Tokenized </span>
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">T-Bills</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Earn stable yields backed by US Treasury Bills. Deposit stablecoins, receive tokenized T-Bills, 
              and watch your portfolio grow with government-backed security.
            </motion.p>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: DollarSign, label: "T-Bill Price", value: `$${formattedPrice}`, color: "emerald" },
              { icon: Percent, label: "Current APY", value: `${formattedYield}%`, color: "green" },
              { icon: Wallet, label: "Your Balance", value: `${parseFloat(formattedBalance).toFixed(2)} TBILL`, color: "teal" },
              { icon: Clock, label: "Maturity", value: "30 Days", color: "cyan" },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-8">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'deposit'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'withdraw'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowUpFromLine className="w-4 h-4" />
                  Withdraw
                </button>
              </div>

              {activeTab === 'deposit' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (USDC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                        MAX
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">You will receive</span>
                      <span className="text-emerald-400 font-medium">
                        ~{depositAmount ? (parseFloat(depositAmount) / parseFloat(formattedPrice)).toFixed(4) : '0'} TBILL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Expected APY</span>
                      <span className="text-emerald-400 font-medium">{formattedYield}%</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={!isConnected || !depositAmount}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isConnected ? 'Deposit & Mint T-Bills' : 'Connect Wallet'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (TBILL)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <button 
                        onClick={() => setWithdrawAmount(formattedBalance)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">You will receive</span>
                      <span className="text-emerald-400 font-medium">
                        ~{withdrawAmount ? (parseFloat(withdrawAmount) * parseFloat(formattedPrice)).toFixed(2) : '0'} USDC
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={!isConnected || !withdrawAmount}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isConnected ? 'Withdraw USDC' : 'Connect Wallet'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { icon: Shield, title: "Treasury-Backed", desc: "Every token is backed 1:1 by US Treasury Bills" },
              { icon: TrendingUp, title: "Stable Yields", desc: "Earn predictable returns from government securities" },
              { icon: Sparkles, title: "Instant Liquidity", desc: "Redeem your T-Bills for stablecoins anytime" },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-emerald-500/10 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">© 2026 TreasuryYield. Built for RWA Demo Day.</p>
        </div>
      </footer>
    </div>
  );
}
