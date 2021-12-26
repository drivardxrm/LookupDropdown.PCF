/* eslint-disable no-undef */
import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

export const useMetadata = (entityname:string) => {
  const pcfcontext = usePcfContext()

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.PropertyHelper.EntityMetadata, Error>(
      ['metadata', entityname, pcfcontext.instanceid],
      () => pcfcontext.getEntityMetadata(entityname),
      {
        staleTime: Infinity
      }
    )

  return {
    primaryid: data?.PrimaryIdAttribute,
    primaryname: data?.PrimaryNameAttribute,
    primaryimage: data?.PrimaryImageAttribute,
    isLoading,
    isError
  }
}
