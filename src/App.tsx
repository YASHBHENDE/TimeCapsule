/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import TimeCapsuleLanding from './components/landing';
import { config } from '../config.ts'
import { WalletOptions } from "./components/walletoptions.tsx";
import { Home } from "./components/home.tsx";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
function App(){
  // const [count, setCount] = useState(0)
  const queryClient = new QueryClient()
  return (<>
   <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}> 
          <RecoilRoot>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TimeCapsuleLanding/>}/>
              <Route path="/walletoptions" element={<WalletOptions/>}/>
              <Route path="/home" element={<Home/>}/>
            </Routes>
          </BrowserRouter>
          </RecoilRoot>
       
      </QueryClientProvider>
    </WagmiProvider>
    </>
  );

}
// {
  // todo:disconnect wallet, use recoil
// }
export default App
