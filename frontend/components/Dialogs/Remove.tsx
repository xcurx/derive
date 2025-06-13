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
import { Trash } from 'lucide-react'
import { RemoveDialogProps } from '@/types/types'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { abi } from "../../abi.json"
import { toast } from 'sonner'

const Remove = ({ resourceId, refetch }: RemoveDialogProps) => {
  const [open, setOpen] = useState(false)
  
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
    if (!resourceId) {
      toast.error("Resource ID is required");
      return;
    }

    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: abi,
      functionName: "removeResource",
      args: [resourceId as `0x${string}`],
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Resource removed successfully!");
      setOpen(false);
      setTimeout(() => {
        refetch();
      }, 2000);
    }
    if (isCreating) {
      toast.loading("Removing resource...");
    }
    if (isPending) {
      toast.loading("Transaction is pending...");
    }
    if (error) {
      toast.error("Error removing resource: " + error.message);
    }

    return () => {
      toast.dismiss();
    }
  }, [isConfirmed, error, refetch, isCreating, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash/>
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove resource</DialogTitle>
          <DialogDescription>
            Do you want to remove this resource? This action cannot be undone.
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

export default Remove
