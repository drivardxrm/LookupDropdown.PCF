/* eslint-disable no-use-before-define */
import * as React from 'react'
import { ImageIcon } from '@fluentui/react/lib/Icon'
import { useRecordImage } from '../hooks/useRecords'
import { usePcfContext } from '../services/PcfContext'
import { IDropdownOption } from '@fluentui/react/lib/Dropdown'

// eslint-disable-next-line no-undef
const LookupDropdownTitle = (options: IDropdownOption<any>[] | undefined): JSX.Element => {
  const pcfcontext = usePcfContext()
  const { imagesrc } = useRecordImage(pcfcontext.selectedValue!.id)
  const option = options![0]

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

export default LookupDropdownTitle
