import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from '@radix-ui/react-dialog'
import { abi} from "../../abi.json";
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { CreateNFTKeyProps } from '@/types/types';
import { setTokenRefetch } from '@/store/refetchSlice';
import { useDispatch } from 'react-redux';

const CreateNFT = ({ refetch, quickCreate }:CreateNFTKeyProps) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
    const dispatch = useDispatch()
    

    console.log("Contract Address:", contractAddress)

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

    function mint() {
      if (!name) {
        toast.error("Please enter a name for the NFT key.");
        return;
      }

      writeContract({
        address: contractAddress,
        abi,
        functionName: "createNFT",
        args: [name],
      })
    }

    useEffect(() => {
      if(isConfirmed){
        toast.success("NFT Key created successfully!");
        setName("");
        dispatch(setTokenRefetch({
          dashboard: true,
          resourcesTab: true,
          tokensTab: true
        }));
        setTimeout(() => {
          refetch();
        }, 3000)
      }
      if(isCreating) {
        toast.loading("Creating NFT Key...");
      }
      if (error) {
        toast.error(`Error: ${error.message}`);
      }
      if (isPending) {
        toast.loading("Transaction is pending...");
      }

      return () => {
        toast.dismiss();
      }
    }, [isConfirmed, error, refetch, isPending, isCreating, dispatch]);

  return (
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          !quickCreate ? (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create NFT Key  
            </Button>
          ) : (
            <Button 
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create NFT Key
            </Button>
          )
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create NFT Key</DialogTitle>
          <DialogDescription>
            Create a new NFT key that can be used to access resources on the platform.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Key Name'/>
        </div>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-gray-600">
            <p>• Gas fees will be paid from your connected wallet</p>
            <p>• NFT will be minted to your address</p>
            <p>• Token ID will be automatically assigned</p>
          </div>
        </div>  
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={mint} disabled={isCreating || isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isCreating ? "Creating..." : "Create NFT Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNFT
