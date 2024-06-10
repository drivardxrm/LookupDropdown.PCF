import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { usePcfContext } from '../services/PcfContext'
import { useLookupView } from '../hooks/useLookupView'
import { Image, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps, makeStyles, mergeClasses, useTagPickerFilter } from '@fluentui/react-components'
import { useTagPickerOptions } from '../hooks/useRecords'
import { DismissFilled, ChevronDown20Regular } from '@fluentui/react-icons';
import { useStyles } from '../styles/Styles'
//import { useStyles } from '../styles/Styles'


export interface ILookupDropdownProps{
  entity: string;
}



// eslint-disable-next-line no-undef
const LookupDropdown2 = ():JSX.Element => {
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


  const handleFocus = () => {
    //setInputFocused(true);
  };

  const handleBlur = () => {
    setQuery('')
    setInputFocused(false);
  };

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputFocused(e.target.value != ''); // if there is a value in the input, set to true (will hide the selected tag)
    setQuery(e.target.value)    
  };


  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === 'no-matches') {
      setQuery('');
      setInputFocused(false);
      return;
    }
    setSelectedOption(selectedOption === data.value ? undefined : data.value);
    if(data.value === undefined){
      setSelectedOption(undefined)
      //pcfcontext.onChange(undefined)
    }else if(data.value !== undefined && data.value !== pcfcontext.selectedValue?.id){
      setSelectedOption(data.value)
      //pcfcontext.onChange([{id: data.value, name: options.find((option) => option.id === data.value)?.primaryname, entityType: entityname}])
    }
    setQuery('');
    setInputFocused(false);
  };

  const children = useTagPickerFilter({
    query,
    options: options.map((option) => option.id),
    noOptionsElement: (
      <TagPickerOption value="no-matches">
        **no match**
      </TagPickerOption>
    ),
    renderOption: (optionidToRender) => (
      <TagPickerOption
        //secondaryContent="Microsoft FTE"
        media={
          options.find((option) => option.id === optionidToRender)?.imagesrc &&
            <Image
                alt={options.find((option) => option.id === optionidToRender)?.displaytext}
                key={options.find((option) => option.id === optionidToRender)?.id}
                shape="square"
                src={options.find((option) => option.id === optionidToRender)?.imagesrc}
                height={25}
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
            disabled={pcfcontext.isReadOnly}
          >
            <TagPickerControl 
                onMouseEnter={()=>{setIsFocused(true)}} 
                onMouseLeave={()=>{setIsFocused(false)}}
                expandIcon={<ChevronDown20Regular className={isFocused ? styles.expandIconVisible : styles.expandIconHidden}/>}>
              {selectedOption && (
                <TagPickerGroup 
                  className={mergeClasses(
                    styles.tagPickerGroup, 
                    isInputFocused ? styles.tagPickerGroupHidden : styles.tagPickerGroupVisible)
                  }>
                  <Tag
                    key={selectedOption}
                    shape={'rounded'}
                    size={'medium'}
                    appearance={'brand'}
                    media={
                      options.find((option) => option.id === selectedOption)?.imagesrc &&
                        <Image
                            alt={options.find((option) => option.id === selectedOption)?.displaytext}
                            key={options.find((option) => option.id === selectedOption)?.id}
                            shape="square"
                            src={options.find((option) => option.id === selectedOption)?.imagesrc}
                            height={20}
                            //width={20}
                        />
                    
                    }
                    value={selectedOption}
                    dismissIcon = {pcfcontext.isReadOnly ? undefined : <DismissFilled className={styles.icon12}/>}
                    dismissible = {pcfcontext.isReadOnly ? false : true}
                  >
                    {options.find((option) => option.id === selectedOption)?.displaytext}
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
                onFocus={handleFocus}
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
