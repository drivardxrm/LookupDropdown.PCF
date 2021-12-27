/* eslint-disable no-undef */
// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { mergeStyles } from '@fluentui/react/lib/Styling'
import { FontIcon } from '@fluentui/react/lib/Icon'
import { Stack } from '@fluentui/react/lib/Stack'
import { TextField } from '@fluentui/react/lib/TextField'

const MaskedInput = (): JSX.Element => {
  // STYLES
  const maskedinputclass = mergeStyles({
    fontSize: 30,
    height: 30,
    width: 50,
    margin: '1px'
  })

  return (
        <Stack tokens={{ childrenGap: 2 }} horizontal>
            <FontIcon iconName="Lock" className={maskedinputclass} />
            <TextField value="*********" style={{ width: '100%' }}/>
        </Stack>
  )
}

export default MaskedInput
