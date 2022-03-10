/* eslint-disable no-use-before-define */
import { IconButton } from '@fluentui/react/lib/Button'
import { IIconProps } from '@fluentui/react/lib/Icon'
import * as React from 'react'
import { useLookupView } from '../hooks/useLookupView'
import { usePcfContext } from '../services/PcfContext'

const openbuttonicon: IIconProps = { iconName: 'OpenInNewWindow' }
// eslint-disable-next-line no-undef
const OpenRecordButton = ():JSX.Element => {
  const pcfcontext = usePcfContext()
  const { entityname } = useLookupView()

  return <IconButton
            iconProps={openbuttonicon}
            title="Open record"
            ariaLabel="Open record"
            disabled={pcfcontext.selectedValue === undefined}
            onClick={() => {
              pcfcontext.openRecord(entityname)
            }}
          />
}
export default OpenRecordButton
