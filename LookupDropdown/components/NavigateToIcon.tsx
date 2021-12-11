/* eslint-disable no-use-before-define */
import { IconButton } from '@fluentui/react/lib/Button'
import { IIconProps } from '@fluentui/react/lib/Icon'
import * as React from 'react'
import { usePcfContext } from '../services/PcfContext'

// eslint-disable-next-line no-undef
const NavigateToIcon = ():JSX.Element => {
  const openbuttonicon: IIconProps = { iconName: 'OpenInNewWindow' }
  const pcfcontext = usePcfContext()

  return <IconButton
            iconProps={openbuttonicon}
            title="Open record"
            ariaLabel="Open record"
            disabled={pcfcontext.selectedValue === undefined}
            onClick={() => {
              pcfcontext.openRecord(pcfcontext.entityname, pcfcontext.selectedValue?.id ?? '')
            }}
          />
}
export default NavigateToIcon
