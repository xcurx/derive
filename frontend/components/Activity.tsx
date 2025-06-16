import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GET_ACTIVITY } from "@/graphql/queries";
import { EventEntity } from "@/types/types";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

const activityStyle = {
    upload: "w-2 h-2 bg-green-500 rounded-full flex-shrink-0",
    keyCreated: "w-2 h-2 bg-blue-500 rounded-full flex-shrink-0",
    keyShared: "w-2 h-2 bg-purple-500 rounded-full flex-shrink-0",
    keyburn: "w-2 h-2 bg-red-500 rounded-full flex-shrink-0",
    resourceRemoved: "w-2 h-2 bg-orange-500 rounded-full flex-shrink-0",
    accessAdded: "w-2 h-2 bg-pink-500 rounded-full flex-shrink-0",
    keyReclaimed: "w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0",
    keyRemovedFromList: "w-2 h-2 bg-gray-500 rounded-full flex-shrink-0"
}

const Activity = ({ shouldRefetch }:{ shouldRefetch: boolean }) => {
    const { address } = useAccount();

    const { loading, data, error, refetch } = useQuery(GET_ACTIVITY, {
      variables: {
        add: address
      }
    });

    useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
    }, [shouldRefetch, refetch]);

  return (
   <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {
            !loading && data?.eventEntities.map((event: EventEntity) => {
                if(event.eventType == "ResourceAdded") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.upload}`}></div>
                            <span className="text-sm break-all min-w-0">Resource added: {event.resourceAdded?.name}</span>
                        </div>
                    )
                }
                if(event.eventType == "Creation") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.keyCreated}`}></div>
                            <span className="text-sm break-all min-w-0">NFT Key created: {event.creation?.name}</span>
                        </div>
                    )
                }
                if(event.eventType == "AccessAdded") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.accessAdded}`}></div>
                            <span className="text-sm break-all min-w-0">Access added to resource for token#{event.accessAdded?.tokenId}</span>
                        </div>
                    )
                }
                if(event.eventType == "KeyReclaimed") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.keyReclaimed}`}></div>
                            <span className="text-sm break-all min-w-0">Key with token#{event.keyReclaimed?.tokenId} reclaimed from: {event.keyReclaimed?.prevOwner}</span>
                        </div>
                    )
                }
                if(event.eventType == "ResourceRemoved") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.resourceRemoved}`}></div>
                            <span className="text-sm break-all min-w-0">Resource removed: {event.resourceRemoved?.resourceId}</span>
                        </div>
                    )
                }
                if(event.eventType == "Transfer") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            {
                                event.transfer?.to == zeroAddress ? (
                                    <>
                                        <div className={`${activityStyle.keyburn}`}></div>
                                        <span className="text-sm break-all min-w-0">Key with token#{event.transfer?.internal_id} burned</span>
                                    </>
                                ) : (
                                    <>
                                        <div className={`${activityStyle.keyShared}`}></div>
                                        <span className="text-sm break-all min-w-0">Key with token#{event.transfer?.internal_id} shared to {event.transfer?.to}</span>
                                    </>
                                )
                            }
                        </div>
                    )
                }
                if(event.eventType == "RemovedFromList") {
                    return (
                        <div key={event.id} className="flex items-center space-x-3">
                            <div className={`${activityStyle.keyRemovedFromList}`}></div>
                            <span className="text-sm break-all min-w-0">Access to resource {event.removedFromList?.resourceId} with token#{event.removedFromList?.tokenId} removed</span>
                        </div>
                    )
                }
            })
        }
        {
            !loading && data?.eventEntities.length === 0 && <div className="text-gray-500 text-center">No recent activity</div>
        }
        {
            loading && <div className="text-center">Loading...</div>
        }
        {
            error && <div className="text-red-500">Failed to load data</div>
        }
      </CardContent>
    </Card>
  )
}

export default Activity
