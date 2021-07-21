/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */

import { IInputs } from '../generated/ManifestTypes'

export interface IPcfContextServiceProps{
  selectedValue: ComponentFramework.LookupValue | undefined;
  context: ComponentFramework.Context<IInputs>;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;
}

export class PcfContextService {
  selectedValue?: ComponentFramework.LookupValue | undefined;
  context: ComponentFramework.Context<IInputs>;
  entityname:string;
	viewid:string;
  isReadOnly = ():boolean => this.context.mode.isControlDisabled || !this.context.parameters.lookupfield.security?.editable;
  isMasked = ():boolean => !this.context.parameters.lookupfield.security?.readable;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;
  showRecordImage = ():boolean => this.context.parameters.showRecordImage.raw === 'true';
  instanceid:string = '';

  constructor (props?:IPcfContextServiceProps) {
    if (props) {
      this.context = props.context

      this.entityname = this.context.parameters.lookupfield.getTargetEntityType()
	    this.viewid = this.context.parameters.lookupfield.getViewId()
      this.selectedValue = props.selectedValue
      this.onChange = props.onChange
      this.instanceid = Date.now().toString()
    }
  }

  async getRecords () : Promise<ComponentFramework.WebApi.Entity[]> {
    const entitymetadata = await this.getEntityMetadata()
    let selectstatement = `$select=${entitymetadata.PrimaryIdAttribute},${entitymetadata.PrimaryNameAttribute}`
    if (this.context.parameters.showRecordImage.raw === 'true') {
      selectstatement += `,${entitymetadata.PrimaryImageAttribute}`
    }
    const result = await this.context.webAPI
      .retrieveMultipleRecords(this.entityname, `?${selectstatement}`)

    return result?.entities ?? []
  }

  async getEntityMetadata () : Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    return this.context.utils.getEntityMetadata(this.entityname)
  }
}
