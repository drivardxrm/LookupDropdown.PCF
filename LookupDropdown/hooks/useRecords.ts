import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
export const useRecords = () => {
  const pcfcontext = usePcfContext()

  // eslint-disable-next-line no-undef
  const { data, isLoading, isError } = useQuery<ComponentFramework.WebApi.Entity[], Error>(['records'], () => pcfcontext.getRecords())

  return { records: data, isLoading, isError }
}

export const useRecordsOptions = () => {
  const pcfcontext = usePcfContext()
  const { records, isLoading, isError } = useRecords()

  const options = records
    ? records.map(e => (
      {
        key: e[`${pcfcontext.entityname}id`],
        text: e.xrm_name
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

  return { imagesrc: `data:image/jpeg;base64,${record?.entityimage.toString()}`, isLoading, isError }
}
