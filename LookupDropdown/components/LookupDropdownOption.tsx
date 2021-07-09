import * as React from 'react'
import { IComboBoxOption } from '@fluentui/react/lib/ComboBox'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useRecordImage } from '../hooks/useRecords'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
const LookupDropdownOption = (option:IComboBoxOption|undefined): JSX.Element => {
  const { imagesrc } = useRecordImage(option?.key.toString() ?? '')
  const pcfcontext = usePcfContext()

  return (
      <>
        {pcfcontext.showRecordImage() && option && option.key && (
            <div>

                    <ImageIcon
                        style={{ marginRight: '8px', width: 25, height: 25 }}
                        imageProps={{
                          src: imagesrc,
                          width: 25,
                          height: 25
                        }}/>

            </div>
        )}
        <div className="option-text">

            {option && option.text && (
                <span>{option.text}</span>
            )}
        </div>
    </>
  )
}

export default LookupDropdownOption
