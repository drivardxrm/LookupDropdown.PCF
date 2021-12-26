/* eslint-disable no-undef */
// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { mergeStyles, FontIcon, Stack, TextField } from '@fluentui/react'

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
