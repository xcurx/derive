"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, ExternalLink, LogOut } from 'lucide-react'
import { toast } from "sonner"
// import { useAppSelector } from "@/store/store"
// import { connect, disconnect, update } from "@/store/walletSlice"
import { useAccount, useAccountEffect, useChainId, useChains, useConnect, useDisconnect } from "wagmi"
import { useEffect } from "react"

export default function WalletConnection() {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const chainId = useChainId()
  const chains = useChains()
  
  const currentChain = chains.find(c => c.id === chainId)
  console.log("Current chain:", currentChain)
  console.log("Available connectors:", connectors)
  console.log("Current chainId:",chainId)
  console.log("Available chains:", chains)

  useEffect(() => {
    console.log("Chain ID changed:", chainId)
  }, [chainId])

  useAccountEffect({
    onConnect(data) {
      console.log("Connected!", {
        address: data.address,
        chainId: data.chainId,
        isReconnected: data.isReconnected
      })
      toast.success(`Wallet connected: ${data.address}`)
    },
    onDisconnect() {
      console.log("Disconnected!")
      toast.info("Wallet disconnected")
    },
  })

  if (!address) {
    return (
      <>
        {connectors.map((connector) => (
          <Button 
            key={connector.id} 
            onClick={() => {
              connect({ connector })
                // .then(() => {
                //   // onConnect(true)
                //   // onAddressChange(address)
                //   toast.success("Wallet connected successfully!")
                // })
                // .catch((error) => {
                //   toast.error(`Connection failed: ${error.message}`)
                // })
            }}
            className="bg-blue-600 hover:bg-blue-700 mb-2"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect {connector.name}
          </Button>
        ))}
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{address}</span>
          <Badge variant="secondary" className="ml-2">Connected</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
