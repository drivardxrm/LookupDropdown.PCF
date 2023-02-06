import React, { createRef, useEffect, useRef, useState } from 'react';
import { ComponentStory, ComponentMeta, Meta, StoryObj } from '@storybook/react';

import { ComponentFrameworkMockGenerator, EnumPropertyMock, LookupPropertyMock, ShkoOnline, StringPropertyMock } from '@shko.online/componentframework-mock';


import { LookupDropdown as Component } from '../LookupDropdown/index';
import { IInputs, IOutputs } from '../LookupDropdown/generated/ManifestTypes';
import { useArgs } from '@storybook/client-api';
import { useMemo } from '@storybook/addons';

interface StoryArgs {
  customselecttext: string,
  customtext: string,
  dependentlookupfield: ComponentFramework.LookupValue,
  lookupfield: ComponentFramework.LookupValue,
  showOpenRecordButton: boolean,
  showRecordImage: boolean
}


export default {
  title: "PCF Component/LookupDropdown",
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/html/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/html/api/argtypes
  argTypes: {
  },
} as Meta<StoryArgs>;


const Template = ({ }: StoryArgs) => {
  const container = useRef<HTMLDivElement>(null);
  const [, setLoaded] = useState<boolean>(false);
  const [args, updateArgs] = useArgs() as unknown as [
    args: StoryArgs,
    updateArgs: (args: Partial<StoryArgs>) => void,
  ];

  const mockGenerator = useMemo(() => {
    if (container.current === null) return;
    const innerContainer = document.createElement('div');
    container.current.appendChild(innerContainer);
    const mockGenerator: ComponentFrameworkMockGenerator<IInputs, IOutputs> =
      new ComponentFrameworkMockGenerator(Component, {
        customselecttext: StringPropertyMock,
        customtext: StringPropertyMock,
        dependentlookupfield: LookupPropertyMock,
        lookupfield: LookupPropertyMock,
        showOpenRecordButton: EnumPropertyMock<'false' | 'true'>,
        showRecordImage: EnumPropertyMock<'false' | 'true'>
      }, innerContainer);


      mockGenerator.metadata.initMetadata([{
        LogicalName: 'contact',
        SchemaName: 'Contact',
        PrimaryIdAttribute: 'contactid',
        PrimaryNameAttribute: 'fullname',
        PrimaryImageAttribute: 'enityimage',
        ManyToOneRelationships: [],
        OneToManyRelationships: [],
      }])

    mockGenerator.context._parameters.lookupfield.security = {
      editable: true,
      readable: true,
      secured: false
    };

    mockGenerator.context.webAPI.retrieveRecord.callsFake((entityType:string, id:string, options?:string)=>{
      if(entityType==='savedquery'){
        return new Promise((resolve)=>resolve({
          returnedtypecode: 'contact',
          fetchxml: `<fetch>
<entity>
</entity>
</fetch>`
        } as ComponentFramework.WebApi.Entity));
      }
      return new Promise((resolve,reject)=>{
        reject('invalid');
      });    
    });


    mockGenerator.context.webAPI.retrieveMultipleRecords.callsFake((entityType:string, options?: string, maxPageSize?: number)=>{
      return new Promise((resolve)=>{
        resolve({
          entities: [
            {
              contactid: '1',
              fullname: 'Betim Beja'
            },
            {
              contactid: '2',
              fullname: 'David Rivard'
            }
          ],
          nextLink: ''
        })
      })
    });
    mockGenerator.context._SetCanvasItems(
      {
        customselecttext: args.customselecttext,
        customtext: args.customtext,
        showOpenRecordButton: args.showOpenRecordButton ? 'true' : 'false',
        showRecordImage: args.showRecordImage ? 'true' : 'false'
      },
    );

    mockGenerator.notifyOutputChanged.callsFake(() => {
      const { dependentlookupfield, lookupfield } = mockGenerator.control.getOutputs?.() || {};
      console.log(dependentlookupfield);
      console.log(lookupfield);
      updateArgs({ lookupfield: lookupfield?.[0], dependentlookupfield: dependentlookupfield?.[0] });
    });

    mockGenerator.ExecuteInit();

    return mockGenerator;
  }, [container.current]);

  if (mockGenerator) {
    mockGenerator.metadata.UpdateValue("customtext", "!CanvasApp", args.customtext);
    mockGenerator.metadata.UpdateValue("customselecttext", "!CanvasApp", args.customselecttext);
    mockGenerator.metadata.UpdateValue("showOpenRecordButton", "!CanvasApp", args.showOpenRecordButton ? 'true' : 'false');
    mockGenerator.ExecuteUpdateView();
  }

  useEffect(() => { setLoaded(true) }, [container.current]);
  return <div><div ref={container} ></div></div>;

};

export const LookupDropdown = Template.bind({}) as StoryObj<StoryArgs>;

LookupDropdown.args = {
  customselecttext: 'Custom Select',
  customtext: undefined,
  showOpenRecordButton: true
}
