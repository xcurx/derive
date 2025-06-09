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
import { RefetchType } from '@/types/types';

const CreateNFT = ({ refetch }:RefetchType) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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
        setName("");
        refetch();
      }
    }, [isConfirmed, error, refetch])

  return (
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create NFT Key  
        </Button>
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
        {
          hash && (
           <div>
              {/* Transaction Hash: {hash} */}
              {isCreating && <div className='text-blue-600'>Waiting for confirmation...</div>}
              {isConfirmed && <div className='text-blue-600'>NFT Successfully Created</div>}
            </div>
          )
        }
        {error && <div className='text-red-500'>Error: {error.message}</div>}
        {isPending && <div className='text-blue-600'>Transaction is pending...</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={mint} disabled={isCreating || isConfirmed || isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isCreating ? "Creating..." : "Create NFT Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNFT
