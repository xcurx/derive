"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet } from 'lucide-react'
import Dashboard from "@/components/Dashboard"
import Resources from "@/components/Resources"
import NFT from "@/components/NFT"
import Share from "@/components/Share"
import { useAccount } from "wagmi"

export default function Component() {
  const { isConnected, chain } = useAccount()

  console.log("isConnected:", chain)

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Wallet className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">Connect your wallet to start using the platform</p>
      </div>
    )
  }

  if (chain?.name !== "Sepolia") {
    return (
      <div className="text-center py-20">
        <Wallet className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Switch to the Sepolia Testnet</h2>
        <p className="text-gray-400 mb-6">Please switch to the correct network to access the platform</p>
      </div>
    )
  }

  return (
     <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
              <TabsTrigger value="nfts" className="text-xs sm:text-sm">NFT Keys</TabsTrigger>
              <TabsTrigger value="shared" className="text-xs sm:text-sm">Shared Access</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard/>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Resources/>
            </TabsContent>

            {/* NFT Keys Tab */}
            <TabsContent value="nfts" className="space-y-6">
              <NFT/>
            </TabsContent>

            {/* Shared Access Tab */}
            <TabsContent value="shared" className="space-y-6">
              <Share/>
            </TabsContent>
          </Tabs>
      </main>
  );
}
