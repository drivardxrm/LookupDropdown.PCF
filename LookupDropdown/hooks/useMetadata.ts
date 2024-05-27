import { useQuery } from '@tanstack/react-query'
import { usePcfContext } from '../services/PcfContext'

export const useMetadata = (entityname:string) => {
  const pcfcontext = usePcfContext()

  const { data, status, error, isFetching } =
    useQuery<ComponentFramework.PropertyHelper.EntityMetadata, Error>(
      {
        queryKey: ['metadata', entityname, pcfcontext.instanceid],
        queryFn: () => pcfcontext.getEntityMetadata(entityname),
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
    status,
    error,
    isFetching
  }
}
