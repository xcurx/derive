import { useEffect, useState } from 'react'
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
import Abi from "../../abi.json"
import { ReclaimDialogProps } from '@/types/types'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setTokenRefetch } from '@/store/refetchSlice'


const Reclaim = ({ tokenId, refetch }:ReclaimDialogProps) => {
    const [open, setOpen] = useState(false)
    const contractaddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
    const dispatch = useDispatch();

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

    useEffect(() => {
      if (isConfirmed) {
        toast.success("Reclaimed successfully!")
        setTimeout(() => {
          refetch()
        }, 3000)
        dispatch(setTokenRefetch({ 
          dashboard: true,
          resourcesTab: true,
          tokensTab: true,
        }))
        setOpen(false)
      }

      if (error) {
        toast.error(`Error: ${error.message}`)
      }
      if (isPending) {
        toast.loading("Transaction is pending...")
      }
      if (isCreating) {
        toast.loading("Waiting for confirmation...")
      }

      return () => {
        toast.dismiss() 
      }
    }, [isConfirmed, refetch, dispatch, error, isPending, isCreating])

    const handleReclaim = () => {
        writeContract({
            address: contractaddress,
            abi: Abi.abi,
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
