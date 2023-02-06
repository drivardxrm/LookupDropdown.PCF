import { useEffect, useRef, useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import { ComponentFrameworkMockGenerator, EnumPropertyMock, LookupPropertyMock, StringPropertyMock } from '@shko.online/componentframework-mock'

import { LookupDropdown as Component } from '../LookupDropdown/index'
import { IInputs, IOutputs } from '../LookupDropdown/generated/ManifestTypes'
import { useArgs } from '@storybook/client-api'
import { useMemo } from '@storybook/addons'
import { ImgBetim, ImgDavid } from './mock/EntityImages'

interface StoryArgs {
  customselecttext: string,
  customtext: string,
  dependentlookupfield: ComponentFramework.LookupValue,
  lookupfield: ComponentFramework.LookupValue,
  showOpenRecordButton: boolean,
  showRecordImage: boolean
}

export default {
  title: 'PCF Component/LookupDropdown',
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' , maxWidth:'350px'}}>
        {Story()}
      </div>
    )
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/html/configure/story-layout
    layout: 'fullscreen'
  },
  // More on argTypes: https://storybook.js.org/docs/html/api/argtypes
  argTypes: {
  }
} as Meta<StoryArgs>


// eslint-disable-next-line no-empty-pattern
const Template = ({ }: StoryArgs) => {
  const container = useRef<HTMLDivElement>(null)
  const [, setLoaded] = useState<boolean>(false)
  const [args, updateArgs] = useArgs() as unknown as [
    args: StoryArgs,
    updateArgs: (args: Partial<StoryArgs>) => void,
  ]

  const mockGenerator = useMemo(() => {
    if (container.current === null) return
    const innerContainer = document.createElement('div')
    container.current.innerHTML = '' // clear on re-render
    container.current.appendChild(innerContainer)
    const mockGenerator: ComponentFrameworkMockGenerator<IInputs, IOutputs> =
      new ComponentFrameworkMockGenerator(Component, {
        customselecttext: StringPropertyMock,
        customtext: StringPropertyMock,
        dependentlookupfield: LookupPropertyMock,
        lookupfield: LookupPropertyMock,
        showOpenRecordButton: EnumPropertyMock<'false' | 'true'>,
        showRecordImage: EnumPropertyMock<'false' | 'true'>
      }, innerContainer)

    mockGenerator.metadata.initMetadata([{
      LogicalName: 'contact',
      SchemaName: 'Contact',
      PrimaryIdAttribute: 'contactid',
      PrimaryNameAttribute: 'fullname',
      PrimaryImageAttribute: 'entityimage',
      ManyToOneRelationships: [],
      OneToManyRelationships: []
    }])

    mockGenerator.context._parameters.lookupfield.security = {
      editable: true,
      readable: true,
      secured: false
    }

    mockGenerator.context.webAPI.retrieveRecord.callsFake((entityType:string, id:string, options?:string) => {
      if (entityType === 'savedquery') {
        return new Promise((resolve) => resolve({
          returnedtypecode: 'contact',
          fetchxml: `<fetch>
                      <entity>
                      </entity>
                    </fetch>`
        // eslint-disable-next-line no-undef
        } as ComponentFramework.WebApi.Entity))
      }
      return new Promise((_resolve, reject) => {
        reject(new Error('invalid'))
      })
    })

    mockGenerator.context.webAPI.retrieveMultipleRecords.callsFake((entityType:string, options?: string, maxPageSize?: number) => {
      return new Promise((resolve) => {
        resolve({
          entities: [
            {
              contactid: '1',
              fullname: 'Betim Beja',
              country: 'Albania',
              entityimage: ImgBetim
            },
            {
              contactid: '2',
              fullname: 'David Rivard',
              country: 'Canada',
              entityimage: ImgDavid
            }
          ],
          nextLink: ''
        })
      })
    })
    mockGenerator.context._SetCanvasItems(
      {
        lookupfield: args.lookupfield,
        customselecttext: args.customselecttext,
        customtext: args.customtext,
        showOpenRecordButton: args.showOpenRecordButton ? 'true' : 'false',
        showRecordImage: args.showRecordImage ? 'true' : 'false'
      }
    )

    mockGenerator.notifyOutputChanged.callsFake(() => {
      const { dependentlookupfield, lookupfield } = mockGenerator.control.getOutputs?.() || {}
      console.log(dependentlookupfield)
      console.log(lookupfield)
      updateArgs({ lookupfield: lookupfield?.[0], dependentlookupfield: dependentlookupfield?.[0] })
    })

    mockGenerator.ExecuteInit()
    return mockGenerator
  }, [container.current])


  if (mockGenerator) {

    //mockGenerator.metadata.UpdateValue('customtext', '!CanvasApp', args.customtext)
    // mockGenerator.metadata.UpdateValue('customtext', '!CanvasApp', args.customtext)
    // mockGenerator.metadata.UpdateValue('customselecttext', '!CanvasApp', args.customselecttext)
    // mockGenerator.metadata.UpdateValue('showOpenRecordButton', '!CanvasApp', args.showOpenRecordButton ? 'true' : 'false')
    mockGenerator.ExecuteUpdateView()
  }
     
  

  useEffect(() => { setLoaded(true) }, [container.current])
  return <div><div ref={container} ></div></div>
}

export const Primary = Template.bind({}) as StoryObj<StoryArgs>
Primary.args = {
  customselecttext: 'Custom Select',
  customtext: undefined,
  showOpenRecordButton: true,
  showRecordImage: true
}

export const CustomText = Template.bind({}) as StoryObj<StoryArgs>
CustomText.args = {
  customselecttext: 'Custom Select',
  customtext: '{fullname} - {country} - MVP',
  showOpenRecordButton: true,
  showRecordImage: true
}

export const Selected = Template.bind({}) as StoryObj<StoryArgs>
Selected.args = {
  lookupfield : {
    name: "David Rivard",
    id: "2",
    entityType: "contact"
  },
  customselecttext: 'Custom Select',
  customtext: undefined,
  showOpenRecordButton: true,
  showRecordImage: true
}
