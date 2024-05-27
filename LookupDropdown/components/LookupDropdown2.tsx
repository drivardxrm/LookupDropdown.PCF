/* eslint-disable no-use-before-define */
import * as React from 'react'
import { useRef, useEffect } from 'react'
import { Stack } from '@fluentui/react/lib/Stack'
import { usePcfContext } from '../services/PcfContext'
import OpenRecordButton from './OpenRecordButton'
import { Dropdown, IDropdownOption, IDropdown, IDropdownProps } from '@fluentui/react/lib/Dropdown'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useRecordsAsOptions, useTagPickerOptions } from '../hooks/useRecords'
import { dropdownIconOptionStyle, dropdownIcontitleStyle, dropdownStackItemStyle, dropdownStyles, dropdownTextStyle, dropdownTheme, dropdownTitleSpanStyles, dropdownTitleStyles } from '../styles/DropdownStyles'
import { useLookupView } from '../hooks/useLookupView'
import { useStyles } from '../styles/Styles'
import { Avatar, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps, useTagPickerFilter } from '@fluentui/react-components'
export interface ILookupDropdownProps{
  entity: string;
}

// eslint-disable-next-line no-undef
const LookupDropdown2 = ():JSX.Element => {
  const dropdownRef = useRef<IDropdown>(null)
  const pcfcontext = usePcfContext()
  const styles = useStyles()
  // Custom Hook based on react-query
  const { options, status, isFetching} = useTagPickerOptions()
  const { entityname } = useLookupView()

  // Clear the value if the selected value is not in the options
  // Only Used when a dependent lookup is changed
  useEffect(
    () => {
      if (status === 'success' &&
           pcfcontext.dependentValue !== undefined && // Only clear if a dependent value is set
           options.length > 1 && // IMPORTANT There is always a blank option
           pcfcontext.selectedValue !== undefined &&
           !options.some(option => option.id === pcfcontext.selectedValue?.id)) {
        pcfcontext.onChange(undefined)
      }
    }
    , [options, status, pcfcontext.selectedValue])

  const placeholder = pcfcontext.selectedValue === undefined || options.some(option => option.id === pcfcontext.selectedValue?.id) ? '---' : `--${pcfcontext.selectedValue?.name}--`

  // EVENTS
  // eslint-disable-next-line no-undef
  // const onRenderPlaceholder = (props: IDropdownProps|undefined): JSX.Element => {
  //   return (
  //     <div style={dropdownTextStyle}>
  //         <em>{props?.placeholder}</em>
  //     </div>
  //   )
  // }

  // - When value of combobox changes, callback to PCF
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const onDropdownChanged = (event: React.FormEvent<HTMLDivElement>, option?:IDropdownOption<any>|undefined, index? : number | undefined) => {
  //   let lookupvalue
  //   if (option === undefined || option.key === -1) {
  //     lookupvalue = undefined
  //   } else {
  //     lookupvalue = [{
  //       id: option.key.toString(),
  //       name: option.data.recordname,
  //       entityType: entityname
  //     }]
  //   }

  //   pcfcontext.onChange(lookupvalue)
  // }

  

  const [query, setQuery] = React.useState<string>("");
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >();
  const selectedOptions = React.useMemo(
    () => (selectedOption ? [selectedOption] : []),
    [selectedOption]
  );
  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    setSelectedOption(selectedOption === data.value ? undefined : data.value);
  };

  

  // MAIN RENDERING
  if (status === 'pending' || isFetching) {
    return <Spinner appearance="primary" label={pcfcontext.context.resources.getString("Loading...")} />
  } if (status === 'error') {
    return <div>{pcfcontext.context.resources.getString("Error fetching data...")}</div>
  } else {
    return (
      <>
        {options && (
          <TagPicker
          onOptionSelect={onOptionSelect}
          selectedOptions={selectedOptions}
        >
          <TagPickerControl>
            {selectedOption && (
              <TagPickerGroup>
                <Tag
                  key={selectedOption}
                  shape="rounded"
                  media={
                    <Avatar aria-hidden name={selectedOption} color="colorful" />
                  }
                  value={selectedOption}
                >
                  {selectedOption}
                </Tag>
              </TagPickerGroup>
            )}
  
            <TagPickerInput aria-label="Select Employees" />
          </TagPickerControl>
          <TagPickerList>
            {options
              .filter((option) => selectedOption !== option.id)
              .map((option) => (
                <TagPickerOption
                  secondaryContent="Microsoft FTE"
                  media={
                    <Avatar
                      shape="square"
                      aria-hidden
                      name={option.displaytext}
                      color="colorful"
                    />
                  }
                  value={option.id}
                  key={option.id}
                >
                  {option.displaytext}
                </TagPickerOption>
              ))}
          </TagPickerList>
        </TagPicker>
        )}
      </>
    )
  }
}

export default LookupDropdown2
