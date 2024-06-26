import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { usePcfContext } from '../services/PcfContext'
import { useLookupView } from '../hooks/useLookupView'
import { Button, Image, Link, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps, mergeClasses, useTagPickerFilter } from '@fluentui/react-components'
import { useTagPickerOptions } from '../hooks/useRecords'
import { ChevronDown20Regular, DismissRegular } from '@fluentui/react-icons';
import { useStyles } from '../styles/Styles'



export interface ILookupDropdownProps{
  entity: string;
}

const LookupDropdown = ():JSX.Element => {
  const pcfcontext = usePcfContext()
  const { options, status, isFetching} = useTagPickerOptions()
  const { entityname } = useLookupView()
  const [query, setQuery] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<
    string | undefined
  >(pcfcontext.selectedValue?.id ?? undefined);
  const [isFocused, setIsFocused] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
  const styles = useStyles()


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

  // if lookup is changed outside of PCF
  useEffect(
    () => {
      if (status === 'success' &&
            pcfcontext.selectedValue?.id !== selectedOption) {
        setSelectedOption(pcfcontext.selectedValue?.id)
      }
    }
    , [status, pcfcontext.selectedValue])

  // Signal back to Form 
  useEffect(
    () => {
      if (status === 'success' && selectedOption === undefined) {
        pcfcontext.onChange(undefined)
      }else if(status === 'success' && selectedOption !== pcfcontext.selectedValue?.id){
        pcfcontext.onChange([{id: selectedOption!, name: options.find((option) => option.id === selectedOption)?.primaryname, entityType: entityname}])
      }
    }
    , [selectedOption])

  const placeholder = useMemo(
    () => selectedOption === undefined ? '---' : '',
    [selectedOption]
  );

  const selectedOptions = useMemo(
    () => (selectedOption ? [selectedOption] : []),
    [selectedOption]
  );


  const handleBlur = () => {
    setQuery('')
    setInputFocused(false)
  };



  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputFocused(e.target.value != ''); // if there is a value in the input, set to true (will hide the selected tag)
    setQuery(e.target.value)    
  };

  const handleClear: React.MouseEventHandler = (event) => {
    setSelectedOption(undefined)
  };


  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === 'no-matches') {
      setQuery('')
      setInputFocused(false)
      return;
    }
    //setSelectedOption(selectedOption === data.value ? undefined : data.value);
    if(data.value === undefined || data.value === '-1'){
      setSelectedOption(undefined)
    }else if(data.value !== undefined && data.value !== pcfcontext.selectedValue?.id){
      setSelectedOption(data.value)
    }
    setQuery('');
    setInputFocused(false);
  };

  const children = useTagPickerFilter({
    query,
    options: options.map((option) => option.id),
    noOptionsElement: (
      <TagPickerOption value="no-matches">
        {pcfcontext.context.resources.getString('**no match**') || '**no match**'}
      </TagPickerOption>
    ),
    renderOption: (optionidToRender) => (
      <TagPickerOption
        className={mergeClasses(
          styles.tagPickerOption, 
          optionidToRender === selectedOption ? styles.tagSelected : '')
        }
        media={
          options.find((option) => option.id === optionidToRender)?.imagesrc &&
            <Image
                className={styles.tagPickerOption}
                alt={options.find((option) => option.id === optionidToRender)?.displaytext}
                key={options.find((option) => option.id === optionidToRender)?.id}
                shape="square"
                src={options.find((option) => option.id === optionidToRender)?.imagesrc}
                height={24}
                //width={25}
            />
        }
        text={options.find((option) => option.id === optionidToRender)?.displaytext ?? ''}
        value={optionidToRender}
        key={optionidToRender}
      >
         {options.find((option) => option.id === optionidToRender)?.displaytext}
      </TagPickerOption>
    ),

    filter: (option) =>
      (options.find((o) => o.id === option)?.displaytext.toLowerCase().includes(query.toLowerCase()) ?? false)
  });

  

  // MAIN RENDERING
  if (status === 'pending' || isFetching) {
    return <Spinner size='tiny' appearance='primary' label={pcfcontext.context.resources.getString('Loading...') || 'Loading...'} />
  } if (status === 'error') {
    return <div>{pcfcontext.context.resources.getString('Error fetching data...') || 'Error fetching data...'}</div>
  } else {
    return (
      <div className={styles.tagpicker}>
        {options && (
          <TagPicker
            onOptionSelect={onOptionSelect}
            selectedOptions={selectedOptions}
            appearance={'filled-darker'}
            disabled={pcfcontext.isReadOnly || pcfcontext.isMasked}
          >
            <TagPickerControl 
              className={styles.tagPickerControl}
              onMouseEnter={()=>{setIsFocused(true)}} 
              onMouseLeave={()=>{setIsFocused(false)}}
              expandIcon={<ChevronDown20Regular className={isFocused ? styles.elementVisible : styles.elementHidden}/>}
              secondaryAction={
                selectedOption && !pcfcontext.isReadOnly && !pcfcontext.isMasked  ?
                 
                    <Button
                      className={mergeClasses(
                        styles.clearButton, 
                        isFocused ? styles.elementVisible : styles.elementHidden)
                      }
                      appearance="transparent"
                      size="small"
                      shape="rounded"
                      onClick={handleClear}
                      icon={<DismissRegular/>}
                    >
                     
                    </Button>
                 :
                 null 
              }
            >
              {selectedOption && (
                <TagPickerGroup 
                  className={mergeClasses(
                    styles.tagPickerGroup, 
                    isInputFocused ? styles.tagPickerGroupHidden : styles.tagPickerGroupVisible)
                  }>
                  <Tag
                    key={selectedOption}
                    className={styles.tag}
                    shape={'rounded'}
                    size={'medium'}
                    appearance={'outline'}
                    media={
                      options.find((option) => option.id === selectedOption)?.imagesrc &&
                        <Image
                            alt={options.find((option) => option.id === selectedOption)?.displaytext}
                            key={options.find((option) => option.id === selectedOption)?.id}
                            shape="square"
                            src={options.find((option) => option.id === selectedOption)?.imagesrc}
                            height={24}
                        />
                    
                    }
                    value={selectedOption}
                    title={options.find((option) => option.id === selectedOption)?.displaytext}
                    dismissible = {false}
                    primaryText={{className: styles.tagOverflow }}
                  >
                    {pcfcontext.openRecordEnabled ? 
                      <Link className={styles.tagOverflowLink}
                        onClick={() => pcfcontext.openRecord(entityname)}>
                          {options.find((option) => option.id === selectedOption)?.displaytext}
                      </Link>
                      :
                      options.find((option) => option.id === selectedOption)?.displaytext
                    }
                    {}
                  </Tag>
                </TagPickerGroup>
              )}
    
              <TagPickerInput 
                className={styles.tagPickerInput}
                aria-label={pcfcontext.SelectText()}
                placeholder={placeholder}
                value={query}
                onChange={handleOnChange} 
                onBlur={handleBlur}
                clearable={true}
              />
            </TagPickerControl>
            <TagPickerList>
              {children}
            </TagPickerList>
          </TagPicker>
        )}
      </div>
    )
  }
}

export default LookupDropdown
