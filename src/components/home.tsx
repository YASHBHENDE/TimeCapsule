/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Timer as TimeCapsule, Clock, Plus, Edit, Trash, AlarmClock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { ABI } from '../../abi';
import { motion } from 'framer-motion';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function Home() {
  const [data, setData] = useState('');
  const [duration, setDuration] = useState('');
  const [extension, setExtension] = useState('');
  const { address, isConnected } = useAccount();
  const [hasCapsule, setHasCapsule] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: capsuleData, refetch: refetchCapsuleData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getData',
    account: address,
  });

  const { data: isExpired, refetch: refetchExpiration } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'checkExpiration',
    account: address,
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (isConnected) {
      refetchExpiration().then(result => {
       
        if (typeof result.data === 'boolean') {
          setHasCapsule(true);
        } else {
          setHasCapsule(false);
        }
        setIsLoading(false);
      }).catch(error => {
        toast.error(error);
        setHasCapsule(false);
        setIsLoading(false);
      });
    }
  }, [isConnected, refetchExpiration]);

  const stringToHex = (str : string) => {
    let hex = '0x';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const hexChar = charCode.toString(16);
      hex += hexChar.padStart(2, '0');
    }
    return hex;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
        <motion.div 
          className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-xl font-semibold text-white">Please Connect Your Wallet</h2>
          <p className="text-gray-400 mt-2">To access TimeCapsule, connect your wallet first.</p>
        </motion.div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    await refetchCapsuleData();
    await refetchExpiration();
    setIsLoading(false);
  };

  const handleStore = async (e : any) => {
    e.preventDefault();
    if (!data || !duration || !address) return;

    try {
      const durationInSeconds = parseInt(duration) * 86400; 
      
      const encodedData = stringToHex(data);
      
      const promise = new Promise((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'storeData',
            args: [encodedData, durationInSeconds],
          },
          {
            onSuccess: () => resolve("Success"),
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
      handleRefresh();
    } catch (error) {
      console.error('Error storing data:', error);
      toast.error('Failed to store data');
    }
  };

  const handleUpdate = async (e : any) => {
    e.preventDefault();
    if (!data || !duration || !address) return;

    try {
      const durationInSeconds = parseInt(duration) * 86400; 
      
      const encodedData = stringToHex(data);
      
      const promise = new Promise((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'updateData',
            args: [encodedData, durationInSeconds],
          },
          {
            onSuccess: () => resolve("Success"),
            onError: (error) => reject(error),
          }
        );
      });

      await toast.promise(promise, {
        loading: 'Updating time capsule...',
        success: 'Time capsule updated!',
        error: 'Failed to update time capsule',
      });

      setData('');
      setDuration('');
      handleRefresh();
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Failed to update data');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your time capsule?')) return;

    try {
      const promise = new Promise((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'deleteData',
          },
          {
            onSuccess: () => resolve("Success"),
            onError: (error) => reject(error),
          }
        );
      });

      await toast.promise(promise, {
        loading: 'Deleting time capsule...',
        success: 'Time capsule deleted!',
        error: 'Failed to delete time capsule',
      });

      handleRefresh();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    }
  };

  const handleExtend = async (e : any) => {
    e.preventDefault();
    if (!extension || !address) return;

    try {
      const extensionInSeconds = parseInt(extension) * 86400; 
      
      const promise = new Promise((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'extendExpiration',
            args: [extensionInSeconds],
          },
          {
            onSuccess: () => resolve("Success"),
            onError: (error) => reject(error),
          }
        );
      });

      await toast.promise(promise, {
        loading: 'Extending time capsule expiration...',
        success: 'Expiration extended!',
        error: 'Failed to extend expiration',
      });

      setExtension('');
      handleRefresh();
    } catch (error) {
      console.error('Error extending expiration:', error);
      toast.error('Failed to extend expiration');
    }
  };

  const decodeData = (hexData : any) => {
    if (!hexData) return "";
    
    try {
      const hex = hexData.toString().startsWith('0x') ? hexData.toString().slice(2) : hexData.toString();
      
      let result = '';
      for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.substr(i, 2), 16);
        if (byte) { 
          result += String.fromCharCode(byte);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error decoding data:', error);
      return "Error decoding data";
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

        {isLoading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
            <p className="text-gray-300">Loading capsule data...</p>
          </div>
        ) : hasCapsule && typeof isExpired === 'boolean' ? (
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8 border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-purple-400">Current Capsule</h2>
            
            {isExpired && capsuleData ? (
              <div className="mt-2">
                <h3 className="text-green-400 mb-2">Your message has been unlocked!</h3>
                <p className="text-gray-300 p-4 bg-black/30 rounded-md">{decodeData(capsuleData)}</p>
              </div>
            ) : (
              <p className="text-gray-300 mt-2">Your message is locked until expiration.</p>
            )}
            
            <div className="flex items-center gap-2 mt-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isExpired ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                <Clock className="w-4 h-4" />
                {isExpired ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {!isExpired && (
                <>
                  <motion.button
                    onClick={handleUpdate}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg shadow-md transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!data || !duration}
                  >
                    <Edit className="w-4 h-4" />
                    Update
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('extendForm')?.classList.toggle('hidden');
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-md transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AlarmClock className="w-4 h-4" />
                    Extend
                  </motion.button>
                </>
              )}
              {isExpired && (
                <motion.button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg shadow-md transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </motion.button>
              )}
            </div>

            <div id="extendForm" className="mt-4 p-4 bg-black/30 rounded-md hidden">
              <form onSubmit={handleExtend} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Additional Days</label>
                  <input
                    type="number"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Enter additional days"
                    min="1"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md transition w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!extension}
                >
                  Extend Expiration
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : null}

        <motion.form 
          onSubmit={hasCapsule && !isExpired ? handleUpdate : handleStore} 
          className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            {hasCapsule && !isExpired ? "Update Your Capsule" : "Create New Capsule"}
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Capsule Message</label>
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
            disabled={!data || !duration}
          >
            <Plus className="w-5 h-5" />
            {hasCapsule && !isExpired ? "Update Capsule" : "Create New"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}