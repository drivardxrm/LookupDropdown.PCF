/* eslint-disable no-undef */
import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'
// import { useMetadata } from './useMetadata'

export const useEntityImage = (entityname:string) => {
  const pcfcontext = usePcfContext()
  // const { objecttypecode, iconvectorname } = useMetadata(entityname)

  const { data, isLoading, isError } =
    useQuery<string, Error>(
      ['image', entityname, pcfcontext.instanceid],
      () => pcfcontext.getEntityImage(entityname),
      {
        staleTime: Infinity
      }
    )

  return {
    entityimagesrc: data,
    isLoading,
    isError
  }
}

// /_imgs/svg_2.svg for OOB entities
