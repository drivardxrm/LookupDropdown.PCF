/* eslint-disable no-use-before-define */
import { IconButton } from '@fluentui/react/lib/Button'
import { IIconProps } from '@fluentui/react/lib/Icon'
import * as React from 'react'
import { usePcfContext } from '../services/PcfContext'

const addrecordicon: IIconProps = { iconName: 'Add' }
// eslint-disable-next-line no-undef
const AddRecordIcon = ():JSX.Element => {
  const pcfcontext = usePcfContext()

  return <IconButton
            iconProps={addrecordicon}
            title="Create New Record"
            ariaLabel="Create New Record"
            onClick={() => {
              pcfcontext.createRecord()
            }}
          />
}
export default AddRecordIcon
