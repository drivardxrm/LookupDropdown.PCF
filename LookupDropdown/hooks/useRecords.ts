/* eslint-disable no-undef */
import { IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'
import { useLookupViewFetchXml } from './useLookupViewFetchXml'
import { useMetadata } from './useMetadata'

export const useRecords = () => {
  const pcfcontext = usePcfContext()
  const { primaryid, primaryname, primaryimage } = useMetadata(pcfcontext.lookupentityname())
  const { fetchxml } = useLookupViewFetchXml()

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.WebApi.Entity[], Error>(
      ['lookuprecords', pcfcontext.instanceid, pcfcontext.dependentValue()?.id],
      () => pcfcontext.getLookupRecords(primaryid, primaryname, primaryimage, fetchxml!),
      {
        enabled: Boolean(primaryname) && Boolean(fetchxml),
        staleTime: Infinity
      }
    )

  return { records: data, isLoading, isError }
}

export const useRecordsAsOptions = () => {
  const pcfcontext = usePcfContext()
  const { records, isLoading, isError } = useRecords()
  const { primaryid, primaryname, primaryimage } = useMetadata(pcfcontext.lookupentityname())

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
