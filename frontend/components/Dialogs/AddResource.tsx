"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'
import { toast } from "sonner"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { abi } from "../../abi.json"
import { zeroAddress } from 'viem'
import { GET_MY_NFT_KEYS } from "@/graphql/queries"
import { useQuery } from "@apollo/client"
import { Token } from "@/types/types"
import { Lit } from "@/lit"

export default function AddResource() {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [open, setOpen] = useState(false)
  const contractaddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { address } = useAccount()

  const { loading, error:errorInquery, data } = useQuery(GET_MY_NFT_KEYS, {
    variables: {
      realOwner: address || zeroAddress // Use zeroAddress if address is not available
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!name) {
        setName(selectedFile.name)
      }
    }
  }

  console.log("name", name, tokenId)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (!file) {
      toast("Please select a file to upload")
      return
    }

    if (!name.trim()) {
      toast("Please enter a resource name")
      return
    }

    if (tokenId === null) {
      toast("Please select a token for access control")
      return
    }

    const data = new FormData();
    data.set("file", file);
    // const uploadRequest = await fetch("/api/files", {
    //   method: "POST",
    //   body: data,
    // });
    // const signedUrl = await uploadRequest.json();
    // console.log("Signed URL:", signedUrl, uploadRequest);
    const lit = new Lit("sepolia");
    await lit.connect();

    const res = await lit.encryptFile(file, "");
    console.log("Encrypted file:", res);

    // const res = await lit.decryptFile(
    //   "twcEa1f9A9B4t6CzAkjVrORvX3BQ1WMOzHklSbOJxkArBJ91U+…4eo4RX3MpNgFcbzLyQ5bqd1MQosFCLA6NiCfsHPulp2C4Ag==",
    //   "5ab8ccbc08ff6dc324803b95aa421fbb94967539a09bafb675f9a545a7ea7962"
    // )
    // console.log("Decrypted file:", res);

    // writeContract({
    //   address: contractaddress,
    //   abi,
    //   functionName: "addResource",
    //   args: [name, "c1", tokenId],
    // })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
        <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resource
        </Button>
      </DialogTrigger>      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Upload a file to the platform. You can assign NFT keys for access control later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : "Click to select a file"}
                </p>
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              placeholder="Enter resource name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Token</Label>
            {
              data && 
              <Select value={tokenId?.toString()} onValueChange={(e) => setTokenId(Number(e))}>
                <SelectTrigger>
                  <SelectValue placeholder={"Select a token"}/>
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
            {
              loading && <div className="text-gray-500">Loading NFT keys...</div>
            }
            {
              errorInquery && <div className="text-red-500">Error loading NFT keys: {errorInquery.message}</div>
            }
          </div>
          <div className="text-sm text-gray-600">
            <p>• File will be encrypted and stored securely</p>
            <p>• Upload costs will be paid from your wallet</p>
            <p>• You can assign access keys after upload</p>
          </div>
        </div>
        {
          hash && (
            <div className="mt-4">
              {isCreating && <div className='text-blue-600'>Waiting for confirmation...</div>}
              {isConfirmed && <div className='text-blue-600'>Resource Successfully Uploaded</div>}
            </div>
          )
        }
        {error && <div className='text-red-500'>Error: {error.message}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isCreating}>
            {isCreating ? "Uploading..." : "Upload Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
