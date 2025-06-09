import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Key, Plus, Upload, Users } from 'lucide-react'
import { Button } from './ui/button'
import { NFTKey, Resource } from '@/app/page'

const Dashboard = () => {
    const [showCreateNFT, setShowCreateNFT] = useState(false)
    const [showAddResource, setShowAddResource] = useState(false)
    const [resources, setResources] = useState<Resource[]>([
      {
        id: "1",
        name: "Project Documentation.pdf",
        type: "document",
        size: "2.4 MB",
        uploadedAt: "2024-01-15",
        requiredKeys: ["1"],
        accessCount: 12
      },
      {
        id: "2",
        name: "Design Assets.zip",
        type: "archive",
        size: "15.7 MB",
        uploadedAt: "2024-01-12",
        requiredKeys: ["1", "2"],
        accessCount: 8
      }
    ])

    const [nftKeys, setNftKeys] = useState<NFTKey[]>([
      {
        id: "1",
        name: "Premium Access Key",
        description: "Access to premium content",
        tokenId: "001",
        owner: "0x1234...5678",
        transferable: true,
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        name: "Developer Resources",
        description: "Access to development tools",
        tokenId: "002",
        owner: "0x1234...5678",
        transferable: false,
        createdAt: "2024-01-10"
      }
    ])


  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">Files uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFT Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nftKeys.length}</div>
              <p className="text-xs text-muted-foreground">Access keys created</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Access</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.reduce((sum, r) => sum + r.accessCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Times accessed</p>
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
              <Button 
                onClick={() => setShowCreateNFT(true)} 
                className="w-full justify-start"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create NFT Key
              </Button>
              <Button 
                onClick={() => setShowAddResource(true)} 
                className="w-full justify-start"
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Resource uploaded: Design Assets.zip</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">NFT Key created: Premium Access Key</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Key shared with 0x9876...4321</span>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  )
}

export default Dashboard
