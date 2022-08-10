/* eslint-disable no-use-before-define */
import * as React from 'react'
import { useRef, useEffect } from 'react'
import { Stack } from '@fluentui/react/lib/Stack'
import { usePcfContext } from '../services/PcfContext'
import OpenRecordButton from './OpenRecordButton'
import { Dropdown, IDropdownOption, IDropdown, IDropdownProps } from '@fluentui/react/lib/Dropdown'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useRecordsAsOptions } from '../hooks/useRecords'
import { dropdownIconOptionStyle, dropdownIcontitleStyle, dropdownStyles, dropdownTextStyle, dropdownTheme } from '../styles/DropdownStyles'
import { useLookupView } from '../hooks/useLookupView'
export interface ILookupDropdownProps{
  entity: string;
}

// eslint-disable-next-line no-undef
const LookupDropdown = ():JSX.Element => {
  const dropdownRef = useRef<IDropdown>(null)
  const pcfcontext = usePcfContext()
  // Custom Hook based on react-query
  const { options, isLoading, isError } = useRecordsAsOptions()
  const { entityname } = useLookupView()

  // Clear the value if the selected value is not in the options
  // Only Used when a dependent lookup is changed
  useEffect(
    () => {
      if (!isLoading &&
          !isError &&
           pcfcontext.dependentValue !== undefined && // Only clear if a dependent value is set
           options.length > 1 && // IMPORTANT There is always a blank option
           pcfcontext.selectedValue !== undefined &&
           !options.some(option => option.key === pcfcontext.selectedValue?.id)) {
        pcfcontext.onChange(undefined)
      }
    }
    , [options, isLoading, isError, pcfcontext.selectedValue])

  const placeholder = pcfcontext.selectedValue === undefined || options.some(option => option.key === pcfcontext.selectedValue?.id) ? '---' : `--${pcfcontext.selectedValue?.name}--`

  // EVENTS
  // eslint-disable-next-line no-undef
  const onRenderPlaceholder = (props: IDropdownProps|undefined): JSX.Element => {
    return (
      <div style={dropdownTextStyle}>
          <em>{props?.placeholder}</em>
      </div>
    )
  }

  // - When value of combobox changes, callback to PCF
  const onDropdownChanged = (event: React.FormEvent<HTMLDivElement>, option?:IDropdownOption<any>|undefined, index? : number | undefined) => {
    let lookupvalue
    if (option === undefined || option.key === -1) {
      lookupvalue = undefined
    } else {
      lookupvalue = [{
        id: option.key.toString(),
        name: option.data.recordname,
        entityType: entityname
      }]
    }

    pcfcontext.onChange(lookupvalue)
  }

  // eslint-disable-next-line no-undef
  const onRenderOption = (option: IDropdownOption | undefined): JSX.Element => {
    return (
      <div style={dropdownTextStyle}>
        {pcfcontext.showRecordImage && option && option.data && (
          <ImageIcon
            style={dropdownIconOptionStyle}
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
      <div style={dropdownTextStyle}>
        {pcfcontext.showRecordImage && option && option.data && option.data.imagesrc && (
          <ImageIcon
            style={dropdownIcontitleStyle}
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
  } else {
    return (
      <>
        {options && (
          <Stack horizontal>
            <Stack.Item grow={9}>
              <Dropdown
                placeholder={placeholder}
                componentRef={dropdownRef}
                onRenderPlaceholder={onRenderPlaceholder}
                onRenderTitle={onRenderTitle}
                onRenderOption={onRenderOption}
                onChange={onDropdownChanged}
                selectedKey={pcfcontext.selectedValue?.id ?? ''}
                options={options}
                styles = {dropdownStyles}
                theme = {dropdownTheme}
                disabled={pcfcontext.isReadOnly}
              />
            </Stack.Item>
            {pcfcontext.context.parameters.showOpenRecordButton.raw === 'true' && (
              <Stack.Item grow>
                <OpenRecordButton/>
              </Stack.Item>
            )}
          </Stack>
        )}
      </>
    )
  }
}

export default LookupDropdown
