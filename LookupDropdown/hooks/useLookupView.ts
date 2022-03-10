import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

export const useLookupView = () => {
  const pcfcontext = usePcfContext()

  const { data, isLoading, isError } =
    // eslint-disable-next-line no-undef
    useQuery<ComponentFramework.WebApi.Entity, Error>(
      ['savedquery', pcfcontext.instanceid],
      () => pcfcontext.getLookupView(),
      {
        staleTime: Infinity
      }
    )

  return {
    fetchxml: data?.fetchxml,
    entityname: data?.returnedtypecode,
    isLoading,
    isError
  }
}
