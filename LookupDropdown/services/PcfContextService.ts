/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */

import { IInputs } from '../generated/ManifestTypes'

export interface IPcfContextServiceProps{
  context: ComponentFramework.Context<IInputs>;
  notifyOutputChanged:() => void;
	// xrmPage: Xrm.Page;
}

export interface ILookupOptions{
  context: ComponentFramework.Context<IInputs>;
  notifyOutputChanged:() => void;
	// xrmPage: Xrm.Page;
}

export class PcfContextService {
  context: ComponentFramework.Context<IInputs>;
  entityname:string;
	viewid:string;
  isReadOnly = ():boolean => this.context.mode.isControlDisabled || !this.context.parameters.lookupfield.security?.editable;
  isMasked = ():boolean => !this.context.parameters.lookupfield.security?.readable;

  constructor (props?:IPcfContextServiceProps) {
    if (props) {
      this.context = props.context

      this.entityname = this.context.parameters.lookupfield.getTargetEntityType()
	    this.viewid = this.context.parameters.lookupfield.getViewId()
    }
  }

  async getRecords () : Promise<ComponentFramework.WebApi.Entity[]> {
    // todo find a way to remove magic strings. LINQ Style would be great
    const result = await this.context.webAPI
      .retrieveMultipleRecords(this.entityname, `?$select=${this.entityname}id,xrm_name`)

    return result?.entities ?? []
  }
}
