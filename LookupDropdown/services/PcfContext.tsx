/* eslint-disable no-use-before-define */
import { createContext, ReactNode, useContext } from 'react'
import { PcfContextService } from './PcfContextService'

interface PcfContextProviderProps {
   pcfcontext:PcfContextService,
   children: ReactNode
}

export const PcfContextProvider = ({ pcfcontext, children }: PcfContextProviderProps) => {
  return (
     <PcfContext.Provider value={pcfcontext}>
       {children}
     </PcfContext.Provider>
  )
}

const PcfContext = createContext<PcfContextService>(undefined!)

export const usePcfContext = () => {
  return useContext(PcfContext)
}
