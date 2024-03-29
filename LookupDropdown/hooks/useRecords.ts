/* eslint-disable no-undef */
import { IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { useQuery } from '@tanstack/react-query'

import { usePcfContext } from '../services/PcfContext'
import { useLookupView } from './useLookupView'
import { useMetadata } from './useMetadata'

export const useRecords = () => {
  const pcfcontext = usePcfContext()
  const { entityname, fetchxml } = useLookupView()
  const { primaryid, primaryname, primaryimage, metadata } = useMetadata(entityname)

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.WebApi.Entity[], Error>(
      ['lookuprecords', pcfcontext.instanceid, pcfcontext.dependentValue?.id],
      () => pcfcontext.getLookupRecords(entityname, primaryid, primaryname, primaryimage, fetchxml, metadata!),
      {
        enabled: !!entityname && !!primaryid && !!fetchxml,
        staleTime: Infinity
      }
    )

  return { records: data, isLoading, isError }
}

export const useRecordsAsOptions = () => {
  const pcfcontext = usePcfContext()
  const { records, isLoading, isError } = useRecords()
  const { entityname } = useLookupView()
  const { primaryid, primaryname, primaryimage } = useMetadata(entityname)

  const options:IDropdownOption[] = records
    ? [{ key: -1, text: pcfcontext.SelectText() }].concat(records.map(e => {
        const imagesrc = e?.[primaryimage] == null
          ? undefined
          : `data:image/jpeg;base64,${e?.[primaryimage]}`
        return {
          key: e[`${primaryid}`],
          text: pcfcontext.getRecordText(e, primaryname),
          data: {
            imagesrc: imagesrc,
            recordname: e[`${primaryname}`]
          }
        }
      }))
    : [{ key: -1, text: pcfcontext.SelectText() }]

  return { options, isLoading, isError }
}
