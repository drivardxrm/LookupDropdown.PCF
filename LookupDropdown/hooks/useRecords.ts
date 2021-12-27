/* eslint-disable no-undef */
import { IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'
import { useLookupViewFetchXml } from './useLookupViewFetchXml'
import { useMetadata } from './useMetadata'

export const useRecords = () => {
  const pcfcontext = usePcfContext()
  const { primaryname, primaryimage } = useMetadata(pcfcontext.lookupentityname)
  const { fetchxml } = useLookupViewFetchXml()

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.WebApi.Entity[], Error>(
      ['lookuprecords', pcfcontext.instanceid],
      () => pcfcontext.getLookupRecords(primaryname, primaryimage, fetchxml!),
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
  const { primaryid, primaryname, primaryimage } = useMetadata(pcfcontext.lookupentityname)

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

export const useRecord = (id:string) => {
  const pcfcontext = usePcfContext()
  const { records, isLoading, isError } = useRecords()
  const record = records?.find(record => record[`${pcfcontext.lookupentityname}id`] === id)

  return { record: record, isLoading, isError }
}

export const useRecordImage = (id:string) => {
  const pcfcontext = usePcfContext()
  const { record, isLoading, isError } = useRecord(id)
  const { primaryimage } = useMetadata(pcfcontext.lookupentityname)

  const rawImage = record?.[primaryimage]
  if (rawImage == null) {
    return { imagesrc: undefined, isLoading, isError }
  } else {
    return { imagesrc: `data:image/jpeg;base64,${rawImage}`, isLoading, isError }
  }
}
