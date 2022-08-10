/* eslint-disable no-undef */

import { useQuery } from '@tanstack/react-query'
import { usePcfContext } from '../services/PcfContext'

export const useMetadata = (entityname:string) => {
  const pcfcontext = usePcfContext()

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.PropertyHelper.EntityMetadata, Error>(
      ['metadata', entityname, pcfcontext.instanceid],
      () => pcfcontext.getEntityMetadata(entityname),
      {
        enabled: entityname !== null && entityname !== undefined && entityname !== '',
        staleTime: Infinity
      }
    )

  return {
    metadata: data,
    primaryid: data?.PrimaryIdAttribute,
    primaryname: data?.PrimaryNameAttribute,
    primaryimage: data?.PrimaryImageAttribute,
    manytoonerelationships: data?.ManyToOneRelationships,
    onetomanyrelationships: data?.OneToManyRelationships,
    isLoading,
    isError
  }
}
