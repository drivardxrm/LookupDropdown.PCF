/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-undef */

import { IInputs } from '../generated/ManifestTypes'

export interface IPcfContextServiceProps{
  context: ComponentFramework.Context<IInputs>;
  instanceid: number;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;
}

export class PcfContextService {
  instanceid:number;
  context: ComponentFramework.Context<IInputs>;
  viewid:string;
  isReadOnly:boolean;
  isMasked:boolean;
  showRecordImage:boolean;
  selectedValue:ComponentFramework.LookupValue | undefined;
  dependentValue:ComponentFramework.LookupValue | undefined;
  dependentEntityName:string;
  filterRelationshipName:string;
  onChange: (selectedOption?: ComponentFramework.LookupValue[] | undefined) => void;

  constructor (props?:IPcfContextServiceProps) {
    if (props) {
      this.instanceid = props.instanceid
      this.context = props.context
      this.viewid = props.context.parameters.lookupfield.getViewId()
      this.isReadOnly = props.context.mode.isControlDisabled || !props.context.parameters.lookupfield.security?.editable
      this.isMasked = !props.context.parameters.lookupfield.security?.readable
      this.showRecordImage = props.context.parameters.showRecordImage.raw === 'true'
      this.selectedValue = props.context.parameters.lookupfield.raw[0] ?? undefined
      this.dependentValue = props.context.parameters.dependentlookupfield?.raw !== null
        ? props.context.parameters.dependentlookupfield?.raw[0]
        : undefined
      this.dependentEntityName = (props.context.parameters.lookupfield as any).dependentAttributeType ?? ''
      this.filterRelationshipName = (props.context.parameters.lookupfield as any).filterRelationshipName ?? ''
      // this.dependentAttribute = 'TODO'
      this.onChange = props.onChange
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
    if (this.showRecordImage) {
      attributes.push(primaryimage)
    }
    return attributes
  }

  async getLookupRecords (entityname:string, primaryid:string, primaryname:string, primaryimage:string, fetchxml:string, metadata:ComponentFramework.PropertyHelper.EntityMetadata) : Promise<ComponentFramework.WebApi.Entity[]> {
    const parser = new DOMParser()
    const fetchxmldoc = parser.parseFromString(fetchxml, 'text/xml')

    // Manipulate fetch xml to include only the fields we need
    const entityelement = fetchxmldoc.getElementsByTagName('entity')[0]

    // remove existing attributes from view fetchxml
    fetchxmldoc.querySelectorAll('attribute').forEach(el => el.remove())
    fetchxmldoc.querySelectorAll('link-entity[alias="dependent"]').forEach(el => el.remove())

    // add attributes to fetchxml
    this.getAttributes(primaryid, primaryname, primaryimage).forEach(attribute => {
      const customattribute = fetchxmldoc.createElement('attribute')
      customattribute.setAttribute('name', attribute)
      entityelement.appendChild(customattribute)
    })

    // set dependent filter if needed
    if (this.filterRelationshipName !== '' &&
        this.dependentEntityName !== '' &&
        this.dependentValue !== undefined &&
        this.dependentValue?.id !== '') {
      const manytoonerelationship = metadata.ManyToOneRelationships.getByName(this.filterRelationshipName)
      const onetomanyrelationship = metadata.OneToManyRelationships.getByName(this.filterRelationshipName)

      const from = manytoonerelationship ? `${this.dependentEntityName}id` : onetomanyrelationship.ReferencingAttribute
      const to = manytoonerelationship ? manytoonerelationship.ReferencingAttribute : `${entityname}id`

      const linkentity = fetchxmldoc.createElement('link-entity')
      linkentity.setAttribute('name', this.dependentEntityName)
      linkentity.setAttribute('from', from)
      linkentity.setAttribute('to', to)
      linkentity.setAttribute('alias', 'dependent')
      const filter = fetchxmldoc.createElement('filter')
      filter.setAttribute('type', 'and')
      const condition = fetchxmldoc.createElement('condition')
      condition.setAttribute('attribute', `${this.dependentEntityName}id`)
      condition.setAttribute('operator', 'eq')
      condition.setAttribute('uitype', this.dependentEntityName)
      condition.setAttribute('value', this.dependentValue?.id ?? '')
      filter.appendChild(condition)
      linkentity.appendChild(filter)
      entityelement.appendChild(linkentity)
    }

    const fetchxmlstring = new XMLSerializer().serializeToString(fetchxmldoc)
    const result = await this.context.webAPI
      .retrieveMultipleRecords(entityname, `?fetchXml=${fetchxmlstring}`)

    return result.entities ?? []
  }

  async getLookupView () : Promise<ComponentFramework.WebApi.Entity> {
    return await this.context.webAPI
      .retrieveRecord('savedquery', this.viewid, '?$select=returnedtypecode,fetchxml')
  }

  async getEntityMetadata (entityname:string) : Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    // console.log(this.instanceid + ' | ' + `${entityname} : Getting metadata`)
    return this.context.utils.getEntityMetadata(entityname)
  }

  async openRecord (entityname:string):Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse> {
    return this.context.navigation.openForm(
      {
        entityName: entityname,
        entityId: this.selectedValue?.id ?? ''
      }
    )
  }
}
