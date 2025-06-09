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
import { Share2 } from 'lucide-react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { abi } from "../../abi.json"
import { RefetchType } from '@/types/types'
import { toast } from 'sonner'

interface ReclaimDialogProps extends RefetchType {
  tokenId: number
}

const Reclaim = ({ tokenId, refetch }:ReclaimDialogProps) => {
    const [open, setOpen] = useState(false)
    const contractaddress = "0x73E1873c16eAE9C71a5a3a836EA7553203450AaF";

    const { 
      writeContract,
      data: hash,
      error,
      isPending
    } = useWriteContract()   

    const {
      isLoading: isCreating,
      isSuccess: isConfirmed
    } = useWaitForTransactionReceipt({
      hash
    })

    React.useEffect(() => {
      if (isConfirmed) {
        toast.success("Shared successfully!")
        refetch?.()
        setOpen(false)
      }
    }, [isConfirmed, refetch])

    const handleReclaim = () => {
        writeContract({
            address: contractaddress,
            abi,
            functionName: 'reclaimKey',
            args: [tokenId]
        })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2/>
          Reclaim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reclaim Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to reclaim a key?
          </DialogDescription>
        </DialogHeader>
        <div>
          {
            isPending && <p className="text-sm text-gray-500">Transaction is pending...</p>
          }
          {
            isCreating && <p className="text-sm text-gray-500">Waiting for confirmation...</p>
          }
          {
            error && <p className="text-sm text-red-500">Error: {error.message}</p>
          }
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleReclaim}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Reclaim
