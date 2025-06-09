"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet } from 'lucide-react'
// import WalletConnection from "@/components/wallet-connection"
// import CreateNFTModal from "@/components/create-nft-modal"
// import AddResourceModal from "@/components/add-resource-modal"
// import AssignKeysModal from "@/components/assign-keys-modal"
// import ShareKeyModal from "@/components/share-key-modal"
// import ManageKeysModal from "@/components/manage-keys-modal"
import Dashboard from "@/components/Dashboard"
import Resources from "@/components/Resources"
import NFT from "@/components/NFT"
import Share from "@/components/Share"
import { useAccount } from "wagmi"

// Mock data types
export interface NFTKey {
  id: string
  name: string
  description: string
  tokenId: string
  owner: string
  transferable: boolean
  createdAt: string
}

export interface Resource {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'archive'
  size: string
  uploadedAt: string
  requiredKeys: string[]
  accessCount: number
}

export default function Component() {
  const { isConnected, status } = useAccount()

  console.log("Wallet State:", status);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Wallet className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">Connect your wallet to start using the platform</p>
      </div>
    )
  }

  return (
     <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="nfts">NFT Keys</TabsTrigger>
              <TabsTrigger value="shared">Shared Access</TabsTrigger>
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
