import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useQuery } from '@apollo/client'
import { GET_SHARED_RESOURCES } from '@/graphql/queries'
import { Resource } from '@/types/types'
// import Keys from './Dialogs/Keys'
// import Manage from './Dialogs/Manage'
import OpenResource from './Dialogs/OpenResource'


const Share = () => {
  const { address } = useAccount()
  const { loading, error, data } = useQuery(GET_SHARED_RESOURCES, {
    variables: {
      add: address
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
        <h2 className="text-2xl font-bold">Shared Access</h2>
        <Card>
          <CardHeader>
            <CardTitle>Shared Resources</CardTitle>
            <CardDescription>Resources shared with you</CardDescription>
          </CardHeader>
          <CardContent>
           {
            data.resources?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No shared keys yet</p>
                  <p className="text-sm">Keys shared with you will appear here</p>
                </div>
            ) : null
           }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                data.resources?.map((resource:Resource) => (
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
                      <div className="flex space-x-2">
                        <OpenResource resourceId={resource.resourceId}/>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          </CardContent>
        </Card>
    </>
  )
}

export default Share
