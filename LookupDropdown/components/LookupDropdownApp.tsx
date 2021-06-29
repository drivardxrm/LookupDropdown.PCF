/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import { initializeIcons } from '@fluentui/react/lib/Icons'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PcfContextProvider } from '../services/PcfContext'
import { IPcfContextServiceProps, PcfContextService } from '../services/PcfContextService'
import LookupDropdownComboBox from './LookupDropdownComboBox'

// import IViewModel from '../services/ViewModel'
// import { ViewModelProvider } from '../services/ViewModelProvider'

// import LookupDropdownApp from './CountryPickerComboBox'
// initilize icons
initializeIcons()

// declare outside of FC element so it doesnt gets evaluated at each rerenders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
      // IMPORTANT otherwise data will be refreshed everytime the focus on the PCF is lost and regained
      // https://react-query.tanstack.com/guides/window-focus-refetching#_top
    }
  }
})

const LookupDropdownApp = (props:IPcfContextServiceProps): JSX.Element => {
// todo create pcfcontext in index
  const pcfcontextservice = new PcfContextService(props)

  return (
    <QueryClientProvider client={queryClient}>
      <PcfContextProvider pcfcontext={pcfcontextservice}>
        <LookupDropdownComboBox/>
      </PcfContextProvider>

    </QueryClientProvider>
  )
}

export default LookupDropdownApp
