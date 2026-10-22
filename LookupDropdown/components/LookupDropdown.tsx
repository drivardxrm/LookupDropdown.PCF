import * as React from 'react'
import { useEffect, useState, useMemo, Activity } from 'react'
import { usePcfContext } from '../services/PcfContext'
import { useLookupView } from '../hooks/useLookupView'
import { Button, Image, Link, Spinner, Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps, mergeClasses, useTagPickerFilter } from '@fluentui/react-components'
import { useTagPickerOptions } from '../hooks/useRecords'
import { ChevronDown20Regular, DismissRegular } from '@fluentui/react-icons';
import { useStyles } from '../styles/Styles'




export interface ILookupDropdownProps{
  entity: string;
}

const LookupDropdown = ():React.JSX.Element => {
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
  const [isDisabled, setIsDisabled] = useState(pcfcontext.isReadOnly || pcfcontext.isMasked)

  // if lookup is changed outside of PCF
  useEffect(
    () => {
      if (status === 'success' &&
            pcfcontext.selectedValue?.id !== selectedOption) {
        setSelectedOption(pcfcontext.selectedValue?.id)
      }
    }
    , [status, pcfcontext.selectedValue])

  // if readonly or masked is changed outside of PCF
  useEffect(
    () => {
      setIsDisabled(pcfcontext.isReadOnly || pcfcontext.isMasked)
    }
    , [pcfcontext.isReadOnly, pcfcontext.isMasked])

  const placeholder = useMemo(
    () => selectedOption === undefined ? '---' : '',
    [selectedOption]
  );

  const selectedRecord = options.find((option) => option.id === selectedOption)
  const selectedText = selectedRecord?.displaytext ?? pcfcontext.selectedValue?.name

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

  const clearSelection = () => {
    setSelectedOption(undefined)
    pcfcontext.onChange(undefined)
  };

  const handleClear: React.MouseEventHandler = () => {
    clearSelection()
  };


  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === 'no-matches') {
      setQuery('')
      setInputFocused(false)
      return;
    }
    if(data.value === undefined || data.value === '-1'){
      clearSelection()
    }else if(data.value !== undefined && data.value !== pcfcontext.selectedValue?.id){
      setSelectedOption(data.value)
      const selectedRecord = options.find((option) => option.id === data.value)
      pcfcontext.onChange([{
        id: data.value,
        name: selectedRecord?.primaryname,
        entityType: entityname
      }])
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
        <Activity mode={options  ? 'visible' : 'hidden'}>
          <TagPicker
            onOptionSelect={onOptionSelect}
            selectedOptions={selectedOptions}
            appearance={'filled-darker'}
            disabled={isDisabled}
          >
            <TagPickerControl 
              className={mergeClasses(
                styles.tagPickerControl, 
                !selectedOption ? styles.tagPickerControlEmpty : '',
                isDisabled ? styles.tagPickerControlDisabled : '')
              }
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
                    className={mergeClasses(
                      styles.tag,
                      isDisabled ? styles.tagDisabled : '',
                    )}
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
                    title={selectedText}
                    dismissible = {false}
                    primaryText={{className: styles.tagOverflow }}
                    color='brand'
                  >
                    {pcfcontext.openRecordEnabled ? 
                      <Link className={styles.tagOverflowLink}
                        onClick={() => pcfcontext.openRecord(entityname)}>
                          <span className={!selectedRecord ? styles.tagFallback : undefined}>{selectedText}</span>
                      </Link>
                      :
                      <span className={!selectedRecord ? styles.tagFallback : undefined}>{selectedText}</span>
                    }
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
        </Activity>
      </div>
    )
  }
}

export default LookupDropdown
