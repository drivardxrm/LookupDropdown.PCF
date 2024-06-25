import { useQuery } from '@tanstack/react-query'

import { usePcfContext } from '../services/PcfContext'
import { useLookupView } from './useLookupView'
import { useMetadata } from './useMetadata'

export const useRecords = () => {
  const pcfcontext = usePcfContext()
  const { entityname, fetchxml } = useLookupView()
  const { primaryid, primaryname, primaryimage, metadata } = useMetadata(entityname)

  const { data, status, error, isFetching } =
    useQuery<ComponentFramework.WebApi.Entity[], Error>(
      {
        queryKey: ['lookuprecords', pcfcontext.instanceid, pcfcontext.dependentValue?.id, pcfcontext.viewid],
        queryFn: () => pcfcontext.getLookupRecords(entityname, primaryid, primaryname, primaryimage, fetchxml, metadata!),
        enabled: !!entityname && !!primaryid && !!fetchxml,
        staleTime: Infinity
      }
    )

  return { records: data, status,
    error,
    isFetching }
}


export interface IRecord {
  id: string;
  primaryname?: string;
  displaytext: string;
  imagesrc?: string;
}

export const useTagPickerOptions = () => {
  const pcfcontext = usePcfContext()
  const { records, status, error, isFetching } = useRecords()
  const { entityname } = useLookupView()
  const { primaryid, primaryname, primaryimage } = useMetadata(entityname)

  const options:IRecord[] = records ? [{ id: '-1', displaytext: pcfcontext.SelectText() }].concat(records?.map(e => {
        const imagesrc = e?.[primaryimage] == null || pcfcontext.isMasked
          ? undefined
          : `data:image/jpeg;base64,${e?.[primaryimage]}`
        return {
          id: e[`${primaryid}`],
          primaryname: e[`${primaryname}`],
          displaytext: pcfcontext.isMasked ? '********' : pcfcontext.getRecordText(e, primaryname),
          imagesrc: imagesrc
        }
      })) : [{ id: '-1', displaytext: pcfcontext.SelectText() }]

  return { options, status, error, isFetching }
}


