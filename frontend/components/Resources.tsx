import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from 'lucide-react'
import AddResource from './Dialogs/AddResource'
import { useAccount } from 'wagmi'
import { GET_RESOURCES } from '@/graphql/queries'
import { useQuery } from '@apollo/client'
import { Resource } from '@/types/types'
import Keys from './Dialogs/Keys'
import OpenResource from './Dialogs/OpenResource'
import Remove from './Dialogs/Remove'

const Resources = () => {
    const { address } = useAccount()

    const { loading, error, data, refetch } = useQuery(GET_RESOURCES, {
      variables: {
         owner: address
      }
    });

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
            <AddResource refetch={refetch}/>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources uploaded by you</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-2 xl:gap-6">
              {data.resources.map((resource:Resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-4 w-4" />
                      <CardTitle className="text-lg truncate w-[200]">{resource.name}</CardTitle>
                    </div>
                    <CardDescription className='w-full text-sm text-gray-500 break-all'>
                    {
                      resource.resourceId
                    }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Keys tokens={resource.tokens || []} resourceId={resource.resourceId} refetch={refetch}/>
                      <OpenResource resourceId={resource.resourceId}/>
                      <Remove resourceId={resource.resourceId} refetch={refetch}/>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {
                data.resources.length === 0 && (
                  <div className="text-center py-8 text-gray-500 col-span-full ">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No resources uploaded yet</p>
                    <p className="text-sm">Upload your first resource to get started</p>
                  </div>
                )
              }
            </div>
          </CardContent>
        </Card>
    </>
  )
}

export default Resources
