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
import { Wallet, LogOut } from 'lucide-react'
import { toast } from "sonner"
// import { useAppSelector } from "@/store/store"
// import { connect, disconnect, update } from "@/store/walletSlice"
import { useAccount, useAccountEffect, useConnect, useDisconnect } from "wagmi"

export default function WalletConnection() {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

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
        {
          connectors.length === 0 ? (
            <div className="text-center py-20">
              No wallet connectors available.
            </div>
          ) : null
        }
        {
          connectors.length === 1 && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 mb-2"
              onClick={() => connect({ connector: connectors[0] })}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect {connectors[0].name}
            </Button>
          ) 
        }
        {
          connectors.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 mb-2">
                  <Wallet className="mr-2 h-4 w-4" />
                  <div className="">Connect Wallet</div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {connectors.map((connector) => (
                  <DropdownMenuItem key={connector.id}>
                      <div 
                        key={connector.id} 
                        onClick={() => {
                          connect({ connector })
                        }}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect {connector.name}
                      </div> 
                  </DropdownMenuItem> 
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-xs xl:max-w-sm">{address}</span>
          <Badge variant="secondary" className="ml-2">Connected</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
