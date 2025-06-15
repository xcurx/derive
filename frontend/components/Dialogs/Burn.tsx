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
import { Flame } from 'lucide-react'
import { BurnDialogProps } from '@/types/types'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { abi } from "../../abi.json"
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setTokenRefetch } from '@/store/refetchSlice'

const Burn = ({ tokenId, refetch }: BurnDialogProps) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  
  
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
  
  const handleRemove = async () => {
    if (!tokenId) {
      toast.error("Resource ID is required");
      return;
    }

    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: abi,
      functionName: "burnKey",
      args: [tokenId],
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      toast.success("NFT key burned successfully!");
      setOpen(false);
      dispatch(setTokenRefetch({ dashboard: true, resourcesTab: true }));
      setTimeout(() => {
        refetch();
      }, 3000);
    }
    if (isCreating) {
      toast.loading("Burning key...");
    }
    if (isPending) {
      toast.loading("Transaction is pending...");
    }
    if (error) {
      toast.error("Error burning key: " + error.message);
    }

    return () => {
      toast.dismiss();
    }
  }, [isConfirmed, error, refetch, isCreating, isPending, dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Flame className="mr-1 h-3 w-3" />
          Burn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Burn NFT key</DialogTitle>
          <DialogDescription>
            Do you want to burn this key?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={handleRemove} disabled={isCreating || isPending}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Burn
