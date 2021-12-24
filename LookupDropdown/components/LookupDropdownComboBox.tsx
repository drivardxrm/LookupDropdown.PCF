/* eslint-disable no-use-before-define */
import * as React from 'react'
import { useRef } from 'react'

import { IComboBox, IComboBoxOption, VirtualizedComboBox } from '@fluentui/react/lib/ComboBox'
import { Stack } from '@fluentui/react/lib/Stack'
import { useRecordsOptions } from '../hooks/useRecords'
import { usePcfContext } from '../services/PcfContext'
import LookupDropdownOption from './LookupDropdownOption'
import RecordIcon from './RecordIcon'
import NavigateToIcon from './NavigateToIcon'
// import AddRecordIcon from './AddRecordIcon'

export interface ILookupDropdownComboBoxProps{
  entity: string;
}

// eslint-disable-next-line no-undef
const LookupDropdownComboBox = ():JSX.Element => {
  const comboboxRef = useRef<IComboBox>(null)
  const pcfcontext = usePcfContext()
  // Custom Hook based on react-query
  const { options, isLoading, isError } = useRecordsOptions()

  // EVENTS
  // - When value of combobox changes, callback to PCF
  const onComboboxChanged = (event: React.FormEvent<IComboBox>, option?:IComboBoxOption|undefined, index? : number | undefined) => {
    // vm.setCountrycode!(option?.key.toString()!)
    let lookupvalue
    if (option === undefined) {
      lookupvalue = undefined
    } else {
      lookupvalue = [{ id: option.key.toString(), name: option.text, entityType: pcfcontext.lookupentityname }]
    }

    pcfcontext.onChange(lookupvalue)
  }

  // MAIN RENDERING
  if (isLoading) {
    return <div>Loading...</div>
  } if (isError) {
    return <div>Error fetching data...</div>
  // } if (vm.masked) {
  //   return <MasquedInput/>
  } else {
    return (
      <>
        {options && (
          <Stack horizontal>
              <RecordIcon/>
              <VirtualizedComboBox
                  componentRef={comboboxRef}
                  onRenderOption={LookupDropdownOption}
                  onChange={onComboboxChanged}
                  selectedKey={pcfcontext.selectedValue?.id ?? ''}
                  text={pcfcontext.selectedValue?.name ?? ''}
                  allowFreeform={true}
                  autoComplete="on"
                  options={options}
                  style={{ width: '100%' }}
                  disabled={pcfcontext.isReadOnly()}
              />
              {/* <AddRecordIcon/> */}
              <NavigateToIcon/>

          </Stack>
        )}
      </>
    )
  }
}

export default LookupDropdownComboBox
