import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

export const useLookupViewFetchXml = () => {
  const pcfcontext = usePcfContext()

  const { data, isLoading, isError } =
    useQuery<Document, Error>(
      ['fetchxml', pcfcontext.instanceid],
      () => pcfcontext.getLookupViewFetchXml(),
      {
        staleTime: Infinity
      }
    )

  return {
    fetchxml: data,
    isLoading,
    isError
  }
}
