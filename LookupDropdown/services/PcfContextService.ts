/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */

import { IInputs } from '../generated/ManifestTypes'

export interface IPcfContextServiceProps{
  selectedValue: ComponentFramework.LookupValue | undefined;
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;
}

export class PcfContextService {
  selectedValue?: ComponentFramework.LookupValue | undefined;
  context: ComponentFramework.Context<IInputs>;
  lookupentityname:string;
	viewid:string;
  isReadOnly = ():boolean => this.context.mode.isControlDisabled || !this.context.parameters.lookupfield.security?.editable;
  isMasked = ():boolean => !this.context.parameters.lookupfield.security?.readable;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;
  showRecordImage = ():boolean => this.context.parameters.showRecordImage.raw === 'true';
  instanceid:string;

  constructor (props?:IPcfContextServiceProps) {
    if (props) {
      this.context = props.context
      this.lookupentityname = this.context.parameters.lookupfield.getTargetEntityType()
	    this.viewid = this.context.parameters.lookupfield.getViewId()
      this.selectedValue = props.selectedValue
      this.onChange = props.onChange
      this.instanceid = props.instanceid
    }
  }

  CustomTextAttributes ():string[] {
    // eslint-disable-next-line no-useless-escape
    return this.context.parameters.customtext.raw?.match(/[^{\}]+(?=})/g) ?? []
  }

  replaceAll (string:string, search:string, replace:string) {
    return string.split(search).join(replace)
  }

  getRecordText (record:ComponentFramework.WebApi.Entity, primaryname:string):string {
    // Default = record primaryname
    if (this.context.parameters.customtext.raw == null) {
      return record[`${primaryname}`]
    } else {
      // Custom text
      let customtext = this.context.parameters.customtext.raw
      this.CustomTextAttributes().forEach(attribute => {
        customtext = this.replaceAll(customtext, `{${attribute}}`, record[`${attribute}`] ?? '')
      })

      return customtext
    }
  }

  async getLookupRecords (primaryname:string, primaryimage:string, fetchxmldoc:Document) : Promise<ComponentFramework.WebApi.Entity[]> {
    // console.log('fetching : getLookupRecords (' + this.instanceid + ')')

    const entityelement = fetchxmldoc.getElementsByTagName('entity')[0]

    // remove existing attributes from view fetchxml
    fetchxmldoc.querySelectorAll('attribute').forEach(el => el.remove())

    // add primary name attribute
    const primarynameattribute = fetchxmldoc.createElement('attribute')

    primarynameattribute.setAttribute('name', primaryname)
    entityelement.appendChild(primarynameattribute)

    // add custom text attributes if needed
    this.CustomTextAttributes().forEach(attribute => {
      const customattribute = fetchxmldoc.createElement('attribute')
      customattribute.setAttribute('name', attribute)

      entityelement.appendChild(customattribute)
    })

    // add image attribute to fetchxml
    if (this.context.parameters.showRecordImage.raw === 'true') {
      const imageattribute = fetchxmldoc.createElement('attribute')
      imageattribute.setAttribute('name', primaryimage)

      entityelement.appendChild(imageattribute)
    }

    const fetchxmlstring = new XMLSerializer().serializeToString(fetchxmldoc)
    const result = await this.context.webAPI
      .retrieveMultipleRecords(this.lookupentityname, `?fetchXml=${fetchxmlstring}`)

    return result.entities ?? []
  }

  async getLookupViewFetchXml () : Promise<Document> {
    // console.log('fetching : getLookupViewFetchXml (' + this.instanceid + ')')

    const result = await this.context.webAPI
      .retrieveRecord('savedquery', this.context.parameters.lookupfield.getViewId())
    const parser = new DOMParser()
    const fetchxml = parser.parseFromString(result.fetchxml, 'text/xml')
    return fetchxml
  }

  async getEntityMetadata (entityname:string) : Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    // console.log(`fetching : getEntityMetadata ${entityname}(${this.instanceid})`)
    return this.context.utils.getEntityMetadata(this.lookupentityname)
  }

  async openRecord ():Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse> {
    return this.context.navigation.openForm(
      {
        entityName: this.lookupentityname,
        entityId: this.selectedValue?.id ?? ''
      }
    )
  }
}
