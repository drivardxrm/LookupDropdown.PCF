/* eslint-disable no-use-before-define */
import * as React from 'react'
import { useRef } from 'react'

// import { IComboBox, IComboBoxOption, VirtualizedComboBox } from '@fluentui/react/lib/ComboBox'
import { Stack } from '@fluentui/react/lib/Stack'
// import { useRecordsOptions } from '../hooks/useRecords'
import { usePcfContext } from '../services/PcfContext'
import NavigateToIcon from './NavigateToIcon'
import { Dropdown, IDropdownOption, IDropdown } from '@fluentui/react/lib/Dropdown'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useDropdownOptions } from '../hooks/useRecords'
// import { ModernDrivenDropdownStyle } from '../styles/ModernDrivenDropdownStyle'
import { dropdownStyles, myTheme } from '../styles/DropdownStyles'
// import { optionProperties } from '@fluentui/react'

const iconoptionstyle = { marginRight: '8px', width: 25, height: 25 }
const icontitlestyle = { marginRight: '8px', marginTop: '3px', width: 25, height: 25 }

const textstyle = { display: 'inline-flex' }

export interface ILookupDropdownProps{
  entity: string;
}

// eslint-disable-next-line no-undef
const LookupDropdown = ():JSX.Element => {
  const dropdownRef = useRef<IDropdown>(null)
  const pcfcontext = usePcfContext()
  // Custom Hook based on react-query
  const { options, isLoading, isError } = useDropdownOptions()

  // EVENTS
  // - When value of combobox changes, callback to PCF
  const onDropdownChanged = (event: React.FormEvent<HTMLDivElement>, option?:IDropdownOption<any>|undefined, index? : number | undefined) => {
    let lookupvalue
    if (option === undefined || option.key === -1) {
      lookupvalue = undefined
    } else {
      lookupvalue = [{ id: option.key.toString(), name: option.text, entityType: pcfcontext.lookupentityname }]
    }

    pcfcontext.onChange(lookupvalue)
  }

  // eslint-disable-next-line no-undef
  const onRenderOption = (option: IDropdownOption | undefined): JSX.Element => {
    return (
      <div style={textstyle}>
        {pcfcontext.showRecordImage() && option && option.data && (
          <ImageIcon
            style={iconoptionstyle}
            imageProps={{
              src: option.data.imagesrc,
              width: 25,
              height: 25
            }}
          />
        )}
        {option && option.text && (
          <span>{option.text}</span>
        )}
      </div>
    )
  }

  // eslint-disable-next-line no-undef
  const onRenderTitle = (options: IDropdownOption[] | undefined): JSX.Element => {
    const option = options![0]
    return (
      <div style={textstyle}>
        {pcfcontext.showRecordImage() && option && option.data && option.data.imagesrc && (
          <ImageIcon
            style={icontitlestyle}
            imageProps={{
              src: option.data.imagesrc,
              width: 25,
              height: 25
            }}
          />
        )}
        {option && option.text && (
          <span>{option.text}</span>
        )}
      </div>
    )
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
            <Stack.Item grow={9}>
              <Dropdown
                placeholder="---"
                componentRef={dropdownRef}
                onRenderTitle={onRenderTitle}
                onRenderOption={onRenderOption}
                onChange={onDropdownChanged}
                selectedKey={pcfcontext.selectedValue?.id ?? ''}
                options={options}
                styles = {dropdownStyles}
                theme = {myTheme}
                // style={{ width: '100%' }}
                disabled={pcfcontext.isReadOnly()}
              />
            </Stack.Item>
            <Stack.Item grow>
              <NavigateToIcon/>
            </Stack.Item>
          </Stack>
        )}
      </>
    )
  }
}

export default LookupDropdown
