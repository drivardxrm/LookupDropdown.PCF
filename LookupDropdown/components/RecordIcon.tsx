/* eslint-disable no-use-before-define */
import { FontIcon, ImageIcon } from '@fluentui/react/lib/Icon'
import { mergeStyles } from '@fluentui/react/lib/Styling'
import * as React from 'react'
import { useRecordImage } from '../hooks/useRecords'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
const RecordIcon = ():JSX.Element => {
  const pcfcontext = usePcfContext()
  const { imagesrc } = useRecordImage(pcfcontext.selectedValue?.id ?? '')

  const iconclass = mergeStyles({
    fontSize: 30,
    height: 30,
    width: 50
  })

  return imagesrc !== undefined
    ? <ImageIcon
    className={iconclass}
    imageProps={{
      src: imagesrc,
      height: '100%',
      width: '100%'
    }}/>
    : <FontIcon iconName="Globe" className={iconclass} />
}
export default RecordIcon
