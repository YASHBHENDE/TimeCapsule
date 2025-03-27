/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useConnect,useAccount } from 'wagmi';


export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const navigate = useNavigate()
  
  
  
  useEffect(() => {
      if(isConnected) {
        navigate('/home')
      }
      
  },[isConnected])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-semibold text-purple-400">Connect Your Wallet</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="px-6 py-3 w-full bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold rounded-lg shadow-md transition"
          >
            {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}
