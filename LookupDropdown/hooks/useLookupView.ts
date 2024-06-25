import { useQuery } from '@tanstack/react-query'
import { usePcfContext } from '../services/PcfContext'

export const useLookupView = () => {
  const pcfcontext = usePcfContext()

  const { data, status, error, isFetching } =
    useQuery<ComponentFramework.WebApi.Entity, Error>(
      {
        queryKey: ['savedquery', pcfcontext.instanceid],
        queryFn: () => pcfcontext.getLookupView(),
        staleTime: Infinity
      }
    )

  return {
    fetchxml: data?.fetchxml,
    entityname: data?.returnedtypecode,
    status, error, isFetching
  }
}
