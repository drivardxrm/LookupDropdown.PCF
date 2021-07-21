import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
export const useMetadata = () => {
  const pcfcontext = usePcfContext()

  // eslint-disable-next-line no-undef
  const { data, isLoading, isError } = useQuery<ComponentFramework.PropertyHelper.EntityMetadata, Error>(['metadata', pcfcontext.instanceid], () => pcfcontext.getEntityMetadata())

  return {
    primaryid: data?.PrimaryIdAttribute,
    primaryname: data?.PrimaryNameAttribute,
    primaryimage: data?.PrimaryImageAttribute,
    isLoading,
    isError
  }
}
