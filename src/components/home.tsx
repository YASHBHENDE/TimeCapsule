import React, { useState } from 'react';
import { Timer as TimeCapsule, Clock, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { ABI } from '../../abi';
import { motion } from 'framer-motion';


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export function Home() {
  const [data, setData] = useState('');
  const [duration, setDuration] = useState('');
  const { address, isConnected } = useAccount();

  const { data: capsuleData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getData',
  }) as { data?: string };

  const { data: isExpired } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'checkExpiration',
  }) as { data?: boolean };

  const { writeContract: writeStoreData } = useWriteContract();

  if (!isConnected) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
        <motion.div 
          className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
         
          <h2 className="text-xl font-semibold text-white">Please Connect Your Wallet</h2>
          <p className="text-gray-400 mt-2">To access TimeCapsule, connect your wallet first.</p>
        </motion.div>
  </div>
  }

  const handleStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !duration || !address) return;

    try {
      const durationInSeconds = parseInt(duration) * 86400;
      const promise = new Promise<void>((resolve, reject) => {
        writeStoreData(
          {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'storeData',
            args: [data, BigInt(durationInSeconds)],
          },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });

      await toast.promise(promise, {
        loading: 'Creating time capsule...',
        success: 'Time capsule created!',
        error: 'Failed to create time capsule',
      });

      setData('');
      setDuration('');
    } catch (error) {
      console.error('Error storing data:', error);
      toast.error('Failed to store data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <TimeCapsule className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Time Capsule
          </h1>
        </div>

        {capsuleData && typeof capsuleData === 'string' && (
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8 border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-purple-400">Current Capsule</h2>
            <p className="text-gray-300 mt-2">{capsuleData}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                <Clock className="w-4 h-4" />
                {isExpired ? 'Expired' : 'Active'}
              </span>
            </div>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleStore} 
          className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Capsule Data</label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-white"
              rows={4}
              placeholder="Enter your message..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter duration in days"
              min="1"
            />
          </div>

          <motion.button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Create New
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
