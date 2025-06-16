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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { Key } from 'lucide-react'
import { KeysDialogProps, Token } from '@/types/types'
import { Card } from '../ui/card'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useQuery } from '@apollo/client'
import { GET_OWNED_NFT_KEYS } from '@/graphql/queries'
import { zeroAddress } from 'viem'
import { toast } from 'sonner'
import Abi from '../../abi.json'    
import { useDispatch } from 'react-redux'
import { setResourceRefetch } from '@/store/refetchSlice'
import { useAppSelector } from '@/store/store'
import Reclaim from './Reclaim'

const Keys = ({ tokens, resourceId, refetch:tokenRefetch }:KeysDialogProps) => {
    const [open, setOpen] = useState(false)
    const { address } = useAccount()
    const [tokenId, setTokenId] = useState<number | undefined>(undefined);
    const contractaddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
    const [isRemoving, setIsRemoving] = useState(false);
    const dispatch = useDispatch();
    const shouldRefetch = useAppSelector((state) => state.refetch);

    const { loading, error:errorInquery, data, refetch } = useQuery(GET_OWNED_NFT_KEYS, {
      variables: {
        realOwner: address || zeroAddress
      }
    });

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

    const handleAddKey = async () => {
        if (!tokenId) {
          toast.error("Please select a token ID");
          return;
        }

        console.log(resourceId)

        writeContract({
          address: contractaddress,
          abi: Abi.abi,
          functionName: "addAccess",
          args: [resourceId, tokenId],
        })
    }

    const handleRemoveKey = async (tokenId: number) => {
        if (!tokenId) {
          toast.error("Please select a token ID");
          return;
        }
        setIsRemoving(true);

        writeContract({
          address: contractaddress,
          abi: Abi.abi,
          functionName: "removeNFTFromList",
          args: [resourceId, tokenId],
        })
    }

    useEffect(() => {
      if (isConfirmed) {
        if (isRemoving) {
          setIsRemoving(false);
          toast.success("Key removed successfully!");
        } else {
          toast.success("Key added successfully!");
        }
        setTimeout(() => {
          tokenRefetch();
          refetch();
        }, 3000)
        dispatch(setResourceRefetch({
          dashboard:true,
          resourcesTab: shouldRefetch.resource.resourcesTab
        }))
      }
      if (error) {
        toast.error(`Error adding key: ${error.cause}`);
        if(isRemoving) {
          setIsRemoving(false);
        }
      }
      if (isPending && !isConfirmed && !error && !isCreating) {
        toast.loading("Transaction is pending...", {});
      }
      if (isCreating && !isConfirmed && !error && !isPending) {
        toast.loading("Waiting for transaction confirmation", {});
      }

      return () => {
        toast.dismiss();
        setIsRemoving(false);
      }
    }, [isConfirmed, error, isPending, isCreating, refetch, isRemoving, dispatch, shouldRefetch, tokenRefetch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
        >
          <Key className="mr-1 h-3 w-3" />
          Keys
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
            <h2 className='my-1'>Add key</h2>
            <div className="flex justify-between items-center">
              {/* <Label htmlFor="type">Select a key to add</Label> */}
              {
                data && 
                <Select value={tokenId?.toString()} onValueChange={(e) => setTokenId(Number(e))}>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a key"}/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                        data?.tokens?.map((nft:Token) => {
                            return <SelectItem key={nft.tokenId} value={nft.tokenId.toString()}>
                                {`Token #${nft.tokenId}`}
                            </SelectItem> 
                    })
                    }
                  </SelectContent>
                </Select>
              }
              <Button size={"sm"} onClick={handleAddKey}>Add</Button>
            </div>
            <div>
              {
                loading && <div className="text-gray-500">Loading NFT keys...</div>
              }
              {
                errorInquery && <div className="text-red-500">Error loading NFT keys: {errorInquery.message}</div>
              }
            </div>
          </div>
          {   
            tokens?.length > 0 ? tokens.map(token => (
              <Card key={token.tokenId} className='py-2 px-3'>
                <div className=''>
                  <div className="">
                    <div>Token #{token.tokenId}</div>
                    <div className='text-xs'>Current Owner: {token.currentOwner}</div>
                  </div>
                  <div className='flex my-2 space-x-4 justify-end'>
                    {
                        token.currentOwner !== token.realOwner &&
                        <Reclaim tokenId={token.tokenId} refetch={refetch}/>
                    }
                    <Button size={"sm"} onClick={() => handleRemoveKey(token.tokenId)}>
                      Remove
                    </Button>
                  </div>
                  </div>
              </Card>
            ))  : null
          }   
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Keys
