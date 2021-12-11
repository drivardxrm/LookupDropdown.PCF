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

  async getLookupRecords (primaryname:string, primaryimage:string, fetchxmldoc:Document) : Promise<ComponentFramework.WebApi.Entity[]> {
    // const entitymetadata = await this.getEntityMetadata()
    // const fetchXml = await this.getLookupViewFetchXml()

    const entityelement = fetchxmldoc.getElementsByTagName('entity')[0]

    // remove existing attributes from view fetchxml
    fetchxmldoc.querySelectorAll('attribute').forEach(el => el.remove())

    // add primary name attribute
    const primarynameattribute = fetchxmldoc.createElement('attribute')

    primarynameattribute.setAttribute('name', primaryname)
    entityelement.appendChild(primarynameattribute)

    // add image attribute to fetchxml
    if (this.context.parameters.showRecordImage.raw === 'true') {
      const imageattribute = fetchxmldoc.createElement('attribute')
      imageattribute.setAttribute('name', primaryimage)

      entityelement.appendChild(imageattribute)
    }

    // todo delete order node and recreate, order alphabetically (primary name)

    const fetchxmlstring = new XMLSerializer().serializeToString(fetchxmldoc)
    const result = await this.context.webAPI
      .retrieveMultipleRecords(this.entityname, `?fetchXml=${fetchxmlstring}`)

    return result.entities ?? []
  }

  async getLookupViewFetchXml () : Promise<Document> {
    const result = await this.context.webAPI
      .retrieveRecord('savedquery', this.context.parameters.lookupfield.getViewId())
    // eslint-disable-next-line no-debugger
    debugger
    const parser = new DOMParser()
    const fetchxml = parser.parseFromString(result.fetchxml, 'text/xml')
    return fetchxml
  }

  async getEntityMetadata () : Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    return this.context.utils.getEntityMetadata(this.entityname)
  }
}
