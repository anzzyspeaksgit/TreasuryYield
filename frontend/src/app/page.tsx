"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const [amount, setAmount] = useState("");
  
  // Hooks for reading
  const { data: tbillBalance } = useReadContract({
    address: TBILL_TOKEN_ADDRESS,
    abi: TBILL_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
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

  const displayBalance = tbillBalance ? formatUnits(tbillBalance as bigint, 18) : "0.00";
  const displayPrice = assetPrice ? formatUnits(assetPrice as bigint, 18) : "1.00";
  const displayAPY = yieldRate ? ((Number(yieldRate) / 10000) * 100).toFixed(2) : "5.00"; // Assuming basis points

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <nav className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          TreasuryYield
        </h1>
        <ConnectButton />
      </nav>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Dashboard Stats */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-neutral-200">Portfolio Overview</CardTitle>
              <CardDescription className="text-neutral-400">Your tokenized T-Bill holdings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-400">TBILL Balance</p>
                <p className="text-3xl font-bold text-white mt-2">{displayBalance}</p>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-400">TBILL Price (USD)</p>
                <p className="text-3xl font-bold text-white mt-2">${displayPrice}</p>
              </div>
              <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-900/50 col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-sm text-emerald-400">Current APY</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-1">{displayAPY}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Est. Value</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ${(Number(displayBalance) * Number(displayPrice)).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interaction */}
        <div>
          <Card className="bg-neutral-900 border-neutral-800 h-full">
            <CardHeader>
              <CardTitle className="text-neutral-200">Vault Interaction</CardTitle>
              <CardDescription className="text-neutral-400">Deposit stablecoins to mint TBILL</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-950">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount" className="text-neutral-300">Amount (USDC)</Label>
                    <Input 
                      id="deposit-amount" 
                      placeholder="0.00" 
                      className="bg-neutral-950 border-neutral-800 text-white"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" disabled={!isConnected || !amount}>
                    Approve & Deposit
                  </Button>
                </TabsContent>
                
                <TabsContent value="withdraw" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount" className="text-neutral-300">Shares (TBILL)</Label>
                    <Input 
                      id="withdraw-amount" 
                      placeholder="0.00" 
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                  <Button className="w-full bg-neutral-100 hover:bg-white text-neutral-950" disabled={!isConnected}>
                    Withdraw Stablecoins
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}
