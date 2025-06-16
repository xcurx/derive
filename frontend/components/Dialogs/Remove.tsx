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
import { useDispatch } from 'react-redux'
import { setResourceRefetch } from '@/store/refetchSlice'
// import { PinataSDK } from "pinata";

const Remove = ({ resourceId, refetch }: RemoveDialogProps) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch();
  // const { address } = useAccount()
  // const [isRemoving, setIsRemoving] = useState(false);

  // const pinata = new PinataSDK({
  //   pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  //   pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud",
  // });

  // const { 
  //   data: resource,
  //   isError: isErrorReading,
  //   isLoading: isReading,
  // } = useReadContract({
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  //   abi,
  //   functionName: "getResource",
  //   args: [address as `0x${string}`, resourceId as `0x${string}`],
  // })
  
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
    // if (isReading) {
    //   toast("Reading resource data...");
    //   return;
    // }
    if( isCreating || isPending) {
      toast.error("Transaction is already in progress. Please wait.");
      return;
    }
    // if( isErrorReading) {
    //   toast.error("Could not read resource data");
    //   return;
    // }

    // setIsRemoving(true);
    // const unpin = await pinata.files.public.delete([
    //   (resource as Resource).cid as string,
    // ])
    // setIsRemoving(false);

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
      }, 3000);
      dispatch(setResourceRefetch({
        dashboard: true,
        resourcesTab: true
      }));
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
    // if (isRemoving) {
    //   toast.loading("Removing resource from IPFS");
    // }

    return () => {
      toast.dismiss();
    }
  }, [isConfirmed, error, refetch, isCreating, isPending, dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="destructive">
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
