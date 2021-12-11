/* eslint-disable no-undef */
import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'
import { useLookupViewFetchXml } from './useLookupViewFetchXml'
import { useMetadata } from './useMetadata'

export const useRecords = () => {
  const pcfcontext = usePcfContext()
  const { primaryname, primaryimage } = useMetadata()
  const { fetchxml } = useLookupViewFetchXml()

  const { data, isLoading, isError } =
    useQuery<ComponentFramework.WebApi.Entity[], Error>(
      ['lookuprecords', pcfcontext.instanceid],
      () => pcfcontext.getLookupRecords(primaryname, primaryimage, fetchxml!),
      {
        enabled: Boolean(primaryname) && Boolean(fetchxml)
      }
    )

  return { records: data, isLoading, isError }
}

export const useRecordsOptions = () => {
  const { records, isLoading, isError } = useRecords()
  const { primaryid, primaryname } = useMetadata()

  const options = records
    ? records.map(e => (
      {
        key: e[`${primaryid}`],
        text: e[`${primaryname}`]
      }
    ))
    : undefined

  return { options, isLoading, isError }
}

export const useRecord = (id:string) => {
  const pcfcontext = usePcfContext()
  const { records, isLoading, isError } = useRecords()
  const record = records?.find(record => record[`${pcfcontext.entityname}id`] === id)

  return { record: record, isLoading, isError }
}

export const useRecordImage = (id:string) => {
  const { record, isLoading, isError } = useRecord(id)
  const { primaryimage } = useMetadata()

  const rawImage = record?.[primaryimage]
  if (rawImage == null) {
    return { imagesrc: undefined, isLoading, isError }
  } else {
    return { imagesrc: `data:image/jpeg;base64,${rawImage}`, isLoading, isError }
  }
}
