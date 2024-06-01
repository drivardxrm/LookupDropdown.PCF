/* eslint-disable no-use-before-define */
import * as React from 'react'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Stack } from '@fluentui/react/lib/Stack'
import { usePcfContext } from '../services/PcfContext'
import OpenRecordButton from './OpenRecordButton'
import { Dropdown, IDropdownOption, IDropdown, IDropdownProps } from '@fluentui/react/lib/Dropdown'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useRecordsAsOptions, useTagPickerOptions } from '../hooks/useRecords'
import { dropdownIconOptionStyle, dropdownIcontitleStyle, dropdownStackItemStyle, dropdownStyles, dropdownTextStyle, dropdownTheme, dropdownTitleSpanStyles, dropdownTitleStyles } from '../styles/DropdownStyles'
import { useLookupView } from '../hooks/useLookupView'
import { useStyles } from '../styles/Styles'
import { Image, Avatar, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps, useTagPickerFilter } from '@fluentui/react-components'
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
  const [query, setQuery] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<
    string | undefined
  >();

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

  //const placeholder = pcfcontext.selectedValue === undefined || options.some(option => option.id === pcfcontext.selectedValue?.id) ? '---' : ''

  const placeholder = useMemo(
    () => selectedOption === undefined ? '---' : '',
    [selectedOption]
  );



  

  
  const selectedOptions = useMemo(
    () => (selectedOption ? [selectedOption] : []),
    [selectedOption]
  );
  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === "no-matches") {
      return;
    }
    setSelectedOption(selectedOption === data.value ? undefined : data.value);
    if(data.value === undefined){
      pcfcontext.onChange(undefined)
    }else if(data.value !== undefined && data.value !== pcfcontext.selectedValue?.id){
      pcfcontext.onChange([{id: data.value, name: options.find((option) => option.id === data.value)?.primaryname, entityType: entityname}])
    }
    setQuery("");
  };

  const children = useTagPickerFilter({
    query,
    options: options.map((option) => option.id),
    noOptionsElement: (
      <TagPickerOption value="no-matches">
        We couldn't find any matches
      </TagPickerOption>
    ),
    renderOption: (optionidToRender) => (
      <TagPickerOption
        //secondaryContent="Microsoft FTE"
        media={
            <Image
                alt={options.find((option) => option.id === optionidToRender)?.displaytext}
                key={options.find((option) => option.id === optionidToRender)?.id}
                shape="square"
                src={options.find((option) => option.id === optionidToRender)?.imagesrc}
                height={25}
                width={25}
            />
        }
        value={optionidToRender}
        key={optionidToRender}
      >
        {options.find((option) => option.id === optionidToRender)?.displaytext}
      </TagPickerOption>
    ),

    filter: (option) =>
      !selectedOptions.includes(option) &&
      (options.find((o) => o.id === option)?.displaytext.toLowerCase().includes(query.toLowerCase()) ?? false)
  });

  

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
            //size={'large'}
            onOptionSelect={onOptionSelect}
            selectedOptions={selectedOptions}
            appearance={'filled-darker'}
          >
            <TagPickerControl>
              {selectedOption && (
                <TagPickerGroup>
                  <Tag
                    key={selectedOption}
                    shape="rounded"
                    media={
                    
                        <Image
                            alt={options.find((option) => option.id === selectedOption)?.displaytext}
                            key={options.find((option) => option.id === selectedOption)?.id}
                            shape="square"
                            src={options.find((option) => option.id === selectedOption)?.imagesrc}
                            height={20}
                            width={20}
                        />
                    
                    }
                    value={selectedOption}
                  >
                    {options.find((option) => option.id === selectedOption)?.displaytext}
                  </Tag>
                </TagPickerGroup>
              )}
    
              <TagPickerInput 
                aria-label={pcfcontext.SelectText()}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
              />
            </TagPickerControl>
            <TagPickerList>
              {children}
            </TagPickerList>
          </TagPicker>
        )}
      </>
    )
  }
}

export default LookupDropdown2
