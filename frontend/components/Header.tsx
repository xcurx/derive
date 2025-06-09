import React from 'react'
import WalletConnection from './WalletConnection'

const Header = () => {
  return (
    <header className='w-full h-16 flex items-center justify-center border-b-2 border-muted'>
        <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* <Shield className="h-8 w-8 text-blue-600" /> */}
                <h1 className="text-2xl font-bold text-white">Derive</h1>
              </div>
              <WalletConnection/>
        </div>
    </header>
  )
}

export default Header
