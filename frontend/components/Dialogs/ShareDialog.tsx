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
import { RefetchType, Token } from '@/types/types'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { abi } from "../../abi.json"
import { isAddress } from 'viem'

interface ShareDialogProps extends RefetchType {
  token: Token;
}

const ShareDialog = ({ token, refetch }:ShareDialogProps) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

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
        setValue("")
        refetch?.()
        setOpen(false)
      }
    }, [isConfirmed, refetch])

    const handleShare = async () => {
        if(!value) {
            toast.error("Please enter an address to share with.");
            return;
        }

        if (!isAddress(value)) {
          throw new Error('Invalid Ethereum address');
        }

        writeContract({
          address: "0x73E1873c16eAE9C71a5a3a836EA7553203450AaF",
          abi: abi,
          functionName: "share",
          args: [value, token.tokenId],
        })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2/>
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Access Keys</DialogTitle>
          <DialogDescription>
            Manage NFT keys that have access to this file. You can remove access, reclaim keys, or burn them permanently.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h2 className='my-1'>Share to others</h2>
            <div>
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Enter address'/>
            </div>
            {
                isPending && <p className="text-sm text-gray-500 mt-2">Sharing in progress...</p>
            }
            {
                isCreating && <p className="text-sm text-gray-500 mt-2">Transaction is being processed...</p>
            }
            {
                isConfirmed && <p className="text-sm text-green-500 mt-2">Shared successfully!</p>
            }
            {
                error && <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>
            }
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={handleShare}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
