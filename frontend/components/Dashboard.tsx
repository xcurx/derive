import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Key } from 'lucide-react'
import { GET_ACCESSIBLE_RESOURCES, GET_NFT_KEYS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setResourceRefetch, setTokenRefetch } from "@/store/refetchSlice";
import CreateNFT from "./Dialogs/CreateNFT";
import AddResource from "./Dialogs/AddResource";
import Activity from "./Activity";

const Dashboard = () => {
  const { address } = useAccount();
  const shouldRefetch = useAppSelector((state) => state.refetch);
  const dispatch = useDispatch();

  const { loading:loadingResources, data:resources, error:resourcesError, refetch:refetchResources } = useQuery(GET_ACCESSIBLE_RESOURCES, {
    variables: {
      add: address
    }
  });

  const { loading:loadingTokens, data:tokens, error:tokensError,  refetch:refetchTokens } = useQuery(GET_NFT_KEYS, {
    variables: {
      add: address
    }
  });

  useEffect(() => {
    if (shouldRefetch.resource.dashboard) {
      refetchResources();
      dispatch(setResourceRefetch({
        dashboard: false,
        resourcesTab: shouldRefetch.resource.resourcesTab
      }));
    }
    if (shouldRefetch.token.dashboard) {
      refetchTokens();
      dispatch(setTokenRefetch({
        dashboard: false,
        resourcesTab: shouldRefetch.token.resourcesTab,
        tokensTab: shouldRefetch.token.tokensTab
      }));
    }
  }, [shouldRefetch, refetchResources, refetchTokens, dispatch]);

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between space-x-4">
              {
                (resources && !loadingResources) && (
                  <>
                    <div>
                      <div className="text-2xl font-bold text-center">{resources.ownedResources.length}</div>
                      <p className="text-xs text-muted-foreground">Files uploaded</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-center">{resources.sharedToOthersResources.length}</div>
                      <p className="text-xs text-muted-foreground">Files shared</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-center">{resources.sharedResources.length}</div>
                      <p className="text-xs text-muted-foreground">Files shared to you</p>
                    </div>
                  </>
                )
              }
              {
                loadingResources && <div className="text-center">Loading...</div>
              }
              {
                resourcesError && <div className="text-red-500">Error loading resources: {resourcesError.message}</div>
              }
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFT Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between space-x-4">
              {
                (tokens && !loadingTokens) && (
                  <>
                    <div>
                      <div className="text-2xl font-bold text-center">{tokens.ownedNFTKeys.length}</div>
                      <p className="text-xs text-muted-foreground">Access keys created</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-center">{tokens.sharedNFTKeys.length}</div>
                      <p className="text-xs text-muted-foreground">Access keys shared to you</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-center">{tokens.sharedToOthersNFTKeys.length}</div>
                      <p className="text-xs text-muted-foreground">Access keys shared to others</p>
                    </div>
                  </>
                )
              }
              {
                loadingTokens && <div className="text-center">Loading...</div>
              }
              {
                tokensError && <div className="text-red-500">Error loading NFT keys: {tokensError.message}</div>
              }
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common platform actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <CreateNFT refetch={refetchTokens} quickCreate={true} />
              <AddResource refetch={refetchResources} quickUpload={true} />
            </CardContent>
          </Card>

          <Activity shouldRefetch={shouldRefetch.resource.dashboard || shouldRefetch.token.dashboard}/>
        </div>
    </>
  )
}

export default Dashboard
