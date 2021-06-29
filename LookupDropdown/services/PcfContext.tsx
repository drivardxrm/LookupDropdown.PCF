/* eslint-disable no-use-before-define */
// import * as React from 'react'
import { useContext } from 'react'
import React = require('react')
import { PcfContextService } from './PcfContextService'
// import { PcfContextService } from './PcfContextService'

interface PcfContextProviderProps {
   pcfcontext:PcfContextService,
   children: React.ReactNode
};

export const PcfContextProvider = ({ pcfcontext, children }: PcfContextProviderProps) => {
  return (
     <PcfContext.Provider value={pcfcontext}>
       {children}
     </PcfContext.Provider>
  )
}

const PcfContext = React.createContext<PcfContextService>(undefined!)

export const usePcfContext = () => {
  return useContext(PcfContext)
}
