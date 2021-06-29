import { useQuery } from 'react-query'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
export const useRecords = () => {
  const pcfcontext = usePcfContext()

  return useQuery(['records'], () => pcfcontext.getRecords())
}

export const useRecordsOptions = () => {
  const pcfcontext = usePcfContext()
  const { data, isLoading, isError } = useRecords()

  const options = data
    ? data.map(e => (
      {
        key: e[`${pcfcontext.entityname}id`],
        text: e.xrm_name
      }
    ))
    : undefined

  return { options, isLoading, isError }
}
