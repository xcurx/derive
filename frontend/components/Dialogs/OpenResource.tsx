import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Download } from 'lucide-react'
import { useAccount, useReadContract } from 'wagmi'

const OpenResource = ({ resourceId }:{ resourceId:string }) => {
    const [open, setOpen] = useState(false)
    const { address } = useAccount()
    console.log("OpenResource resourceId:", resourceId)

    const { 
      data: resource,
      isError,
      isLoading,
      error
    } = useReadContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: [
        {
         "inputs": [{"internalType": "bytes32","name": "resourceId","type": "bytes32"}],
         "name": "getResource",
         "outputs": [{"components": [{  "internalType": "string",  "name": "name",  "type": "string"},{  "internalType": "string",  "name": "cid",  "type": "string"},{  "internalType": "address",  "name": "owner",  "type": "address"},{  "internalType": "string",  "name": "dataToEncryptHash",  "type": "string"}  ],  "internalType": "struct Derive.Resource",  "name": "",  "type": "tuple"}
         ],
         "stateMutability": "view",
         "type": "function"
       },
      ],
      functionName: "getResource",
      args: [resourceId as `0x${string}`],
    })

     return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-1 h-3 w-3" />
          Open
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access the Resource</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {
            isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>{error.message}</div>
            ) : resource ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{resource.name}</h3>
                <p className="text-sm text-gray-500">CID: {resource.cid}</p>
                <p className="text-sm text-gray-500">Owner: {resource.owner}</p>
                <p className="text-sm text-gray-500">Data Hash: {resource.dataToEncryptHash}</p>
              </div>
            ) : (
              <div>No resource found</div>
            )
          }
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenResource