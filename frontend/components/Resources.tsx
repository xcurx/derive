import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from 'lucide-react'
import { Button } from './ui/button'
import AddResource from './Dialogs/AddResource'
import { useAccount } from 'wagmi'
import { GET_RESOURCES } from '@/graphql/queries'
import { useQuery } from '@apollo/client'
import { Resource } from '@/types/types'
import Manage from './Dialogs/Manage'
import Keys from './Dialogs/Keys'

const Resources = () => {
    const { address } = useAccount()

    const { loading, error, data } = useQuery(GET_RESOURCES, {
      variables: {
         owner: address
      }
    });

    console.log("Resources data:", data);

    if(loading) {
      return <div>Loading</div>
    }

    if(error) {
      return <div>Error: {error.message}</div>
    }
  
  return (
    <>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Resources</h2>
            <AddResource/>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources created by you</CardTitle>
            {/* <CardDescription>NFT keys that you own and have not shared to others</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.resources.map((resource:Resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-4 w-4" />
                      <CardTitle className="text-lg truncate w-[200]">{resource.name}</CardTitle>
                    </div>
                    {/* <CardDescription>
                      {resource.size} • Uploaded {resource.uploadedAt}
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Required Keys:</span>
                      <Badge variant="secondary">{resource.requiredKeys.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Access Count:</span>
                      <span className="text-sm font-medium">{resource.accessCount}</span>
                    </div> */}
                    <div className="flex space-x-2">
                      <Keys tokens={resource.tokens || []} resourceId={resource.resourceId}/>
                      <Manage tokens={resource.tokens || []}/>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
    </>
  )
}

export default Resources
