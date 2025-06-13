import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from 'lucide-react'
import { Button } from './ui/button'
import CreateNFT from './Dialogs/CreateNFT'
import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi'
import { zeroAddress } from 'viem'
import { GET_NFT_KEYS } from "@/graphql/queries";
import { Token } from "@/types/types";
import ShareDialog from "./Dialogs/ShareDialog";
import Reclaim from "./Dialogs/Reclaim";

const NFT = () => {
    const { address } = useAccount()
    const { loading, error, data, refetch } = useQuery(GET_NFT_KEYS, {
      variables: {
        add: address || zeroAddress
      }
    });

    console.log("NFT Address:", address, data);

  return (
    <>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">NFT Keys</h2>
          <CreateNFT refetch={refetch}/>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>NFT Keys Shared With You</CardTitle>
            <CardDescription>NFT keys that others have shared with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.sharedNFTKeys.map((nft:Token) => (
                <Card key={nft.tokenId} className="hover:shadow-lg transition-shadow bg-muted p-0">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mt-5">
                      <div>
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Token #{nft.tokenId}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  </CardContent>
                </Card>
              ))}
              {
                data?.sharedNFTKeys.length === 0 && !loading && (
                  <div className="text-gray-500">No NFT keys shared with you</div>
                )
              }
              {
                loading && <div className="text-gray-500">Loading NFT keys...</div>
              }
              {
                error && <div className="text-red-500">Error loading NFT keys: {error.message}</div>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NFT Keys Owned by you</CardTitle>
            <CardDescription>NFT keys that you own and have not shared to others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.ownedNFTKeys.map((nft:Token) => (
                <Card key={nft.tokenId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div>
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Token #{nft.currentOwner }</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                    </div>
                    <div className="flex space-x-2">
                      <ShareDialog token={nft} refetch={refetch}/>
                      <Button size="sm" variant="destructive">
                        <Flame className="mr-1 h-3 w-3" />
                        Burn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {
                data?.ownedNFTKeys.length === 0 && !loading && (
                  <div className="text-gray-500">No NFT keys owned by you</div>
                )
              }
              {
                loading && <div className="text-gray-500">Loading NFT keys...</div>
              }
              {
                error && <div className="text-red-500">Error loading NFT keys: {error.message}</div>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NFT Keys Shared to others</CardTitle>
            <CardDescription>NFT keys that you have shared to others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.sharedToOthersNFTKeys.map((nft:Token) => (
                <Card key={nft.tokenId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div>
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Token #{nft.tokenId}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                    </div>
                    <div className="flex space-x-2">
                      <Reclaim tokenId={nft.tokenId} refetch={refetch}/>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {
                data?.sharedToOthersNFTKeys.length === 0 && !loading && (
                  <div className="text-gray-500">No NFT keys shared to others</div>
                )
              }
              {
                loading && <div className="text-gray-500">Loading NFT keys...</div>
              }
              {
                error && <div className="text-red-500">Error loading NFT keys: {error.message}</div>
              }
            </div>
          </CardContent>
        </Card>
     
    </>
  )
}

export default NFT
