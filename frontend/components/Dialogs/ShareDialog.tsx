import React, { useEffect, useState } from 'react'
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
import { ShareDialogProps } from '@/types/types'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { abi } from "../../abi.json"
import { isAddress } from 'viem'

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

    const handleShare = async () => {
        if(!value) {
            toast.error("Please enter an address to share with.");
            return;
        }

        if (!isAddress(value)) {
          toast.error('Invalid Ethereum address');
        }

        writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: abi,
          functionName: "share",
          args: [value, token.tokenId],
        })
    }

    useEffect(() => {
        if (isConfirmed) {
          toast.success("Key shared successfully!");
          setValue("")
          setTimeout(() => {
            refetch();
          }, 3000)
        }
        if (error) {
          toast.error(`Error adding key: ${error.message}`);
        }
        if (isPending && !isConfirmed && !error && !isCreating) {
          toast.loading("Transaction is pending...", {});
        }
        if (isCreating && !isConfirmed && !error && !isPending) {
          toast.loading("Waiting for transaction confirmation", {});
        }
  
        return () => {
          toast.dismiss();
        }
    }, [isConfirmed, error, isPending, isCreating, refetch])

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
