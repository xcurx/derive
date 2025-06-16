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
import { Download } from 'lucide-react'
import { useAccount, useReadContract } from 'wagmi'
import Abi from "../../abi.json"
import { Lit } from '@/lit'
import { PinataReturnType, Resource } from '@/types/types'
import { toast } from 'sonner'

const OpenResource = ({ resourceId }:{ resourceId:string }) => {
    const [open, setOpen] = useState(false)
    const { address } = useAccount()
    const [loadingData, setLoadingData] = useState(false)
    const [decrypting, setDecrypting] = useState(false)
    
    const { 
      data: resource,
      isError,
      isLoading,
      error
    } = useReadContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: Abi.abi,
      functionName: "getResource",
      args: [address as `0x${string}`, resourceId as `0x${string}`],
    })

    const handleGetResource = async () => {
      if(isLoading) {
        toast.loading("Loading resource...");
        return;
      }
      if(!resource) {
        toast.error("No resource found");
        return;
      }

      let fileData: JSON
      setLoadingData(true);
      try {
        const res = await fetch(`/api/get-resource`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cid: (resource as Resource).cid }),
        });
        if (!res.ok) {
          toast.error(`Failed to fetch resource: ${res.statusText}`);
          return;
        }
        const { data }= await res.json();
        fileData = data as JSON;
      } catch {
        toast.error("Failed to fetch resource");
        return;
      } finally {
        setLoadingData(false);
      }

      setDecrypting(true);
      try {
        const lit = new Lit("sepolia");
        await lit.connect();
        const res = await lit.decryptFile(JSON.parse((fileData as PinataReturnType).encryptedFile))
  
        const blob = new Blob([res.slice()], { type: 'application/octet-stream' });
  
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = (fileData as PinataReturnType).name as string || "downloaded_file"; 
        document.body.appendChild(a); 
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Resource downloaded and decrypted successfully");
      } catch {
        toast.error("Failed to decrypt resource");
      } finally {
        setDecrypting(false);
      }
    }

    useEffect(() => {
        if (loadingData) {
          toast.loading("Loading resource data...");
        } else {
          toast.dismiss();
        }
        if (decrypting) {
          toast.loading("Decrypting resource...");
        } else {
          toast.dismiss();
        }
        if (isError) {
          toast.error(`Error: ${error.cause}`);
        }

        return () => {
          toast.dismiss();
        }
    }, [loadingData, decrypting, resource, isError, error])

     return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          <Download className="mr-1 h-3 w-3" />
          Open
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access the Resource</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {
            isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>{error.message}</div>
            ) : resource ? (
              <div className="space-y-2 text-blue-600">
                You have access to this resource
              </div>
            ) : (
              <>
                <div>No resource found</div>
                <div className="text-sm text-gray-500">
                  Click &quot;`Open&quot;` to download and decrypt the resource.
                </div>
              </>
            )
          }
        </div>
        <DialogFooter className=''>
          <Button variant="outline" onClick={handleGetResource}>
            Open
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenResource