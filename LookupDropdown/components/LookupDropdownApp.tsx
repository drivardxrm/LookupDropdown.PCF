/* eslint-disable no-use-before-define */
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PcfContextProvider } from '../services/PcfContext'
import { IPcfContextServiceProps, PcfContextService } from '../services/PcfContextService'
import LookupDropdown from './LookupDropdown'
import MaskedInput from './MaskedInput'

// declare outside of FC element so it doesnt gets evaluated at each rerenders
const queryClient = new QueryClient({
  queryCache: new QueryCache(), // creates a new querycahe for each instance of the control on a page
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false
      // IMPORTANT otherwise data will be refreshed everytime the focus on the PCF is lost and regained
      // https://react-query.tanstack.com/guides/window-focus-refetching#_top
    }
  }
})

// eslint-disable-next-line no-undef
const LookupDropdownApp = (props:IPcfContextServiceProps): JSX.Element => {
  const pcfcontextservice = new PcfContextService(props)

  return (
    <QueryClientProvider client={queryClient} contextSharing={false}>
      <PcfContextProvider pcfcontext={pcfcontextservice}>
      { pcfcontextservice.isMasked
        ? <MaskedInput/>
        : <LookupDropdown />
      }
      </PcfContextProvider>
    </QueryClientProvider>
  )
}

export default LookupDropdownApp
