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
import { Token } from '@/types/types'
import { useAccount } from 'wagmi'
import { useQuery } from '@apollo/client'
import { GET_OWNED_NFT_KEYS } from '@/graphql/queries'
import { zeroAddress } from 'viem'

const Manage = ({ tokens }:{ tokens:Token[] }) => {
    const [open, setOpen] = useState(false)
    const { address } = useAccount()

    const { loading, error:errorInquery, data } = useQuery(GET_OWNED_NFT_KEYS, {
      variables: {
        currentOwner: address || zeroAddress // Use zeroAddress if address is not available
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2/>
          Manage
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
          </div>
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

export default Manage
