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

  // Returns all strings between curly braces in custom text
  CustomTextAttributes ():string[] {
    // eslint-disable-next-line no-useless-escape
    return this.context.parameters.customtext.raw?.match(/[^{\}]+(?=})/g) ?? []
  }

  SelectText ():string {
    return `--${this.context.parameters.customselecttext.raw ?? 'Select'}--`
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

  // Get the list of fields to fetch
  getAttributes (primaryid:string, primaryname:string, primaryimage:string):string[] {
    const attributes:string[] = [primaryid, primaryname] // primaryid and primaryname is always fetched

    // add custom text attributes if needed
    this.CustomTextAttributes().forEach(attribute => {
      if (!attributes.includes(attribute)) {
        attributes.push(attribute)
      }
    })

    // add primaryimage if needed
    if (this.context.parameters.showRecordImage.raw === 'true') {
      attributes.push(primaryimage)
    }
    return attributes
  }

  async getLookupRecords (primaryid:string, primaryname:string, primaryimage:string, fetchxmldoc:Document) : Promise<ComponentFramework.WebApi.Entity[]> {
    // Manipulate fetch xml to include only the fields we need
    const entityelement = fetchxmldoc.getElementsByTagName('entity')[0]

    // remove existing attributes from view fetchxml
    fetchxmldoc.querySelectorAll('attribute').forEach(el => el.remove())

    // add attributes to fetchxml
    this.getAttributes(primaryid, primaryname, primaryimage).forEach(attribute => {
      const customattribute = fetchxmldoc.createElement('attribute')
      customattribute.setAttribute('name', attribute)

      entityelement.appendChild(customattribute)
    })

    const fetchxmlstring = new XMLSerializer().serializeToString(fetchxmldoc)
    const result = await this.context.webAPI
      .retrieveMultipleRecords(this.lookupentityname, `?fetchXml=${fetchxmlstring}`)

    return result.entities ?? []
  }

  async getLookupViewFetchXml () : Promise<Document> {
    const result = await this.context.webAPI
      .retrieveRecord('savedquery', this.context.parameters.lookupfield.getViewId())
    const parser = new DOMParser()
    const fetchxml = parser.parseFromString(result.fetchxml, 'text/xml')
    return fetchxml
  }

  async getEntityMetadata (entityname:string) : Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    return this.context.utils.getEntityMetadata(entityname)
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
