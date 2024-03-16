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
  customText: string | null | undefined;
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
      if (this.context.parameters.customtext.raw)
      {
        this.customText = this.context.parameters.customtext.raw.indexOf("##") > -1 ? this.context.parameters.customtext.raw.split("__").find(langcustomtext => langcustomtext.split("##")[0] === this.context.userSettings.languageId.toString())?.split("##")[1] : this.context.parameters.customtext.raw;
      }
      
      this.onChange = props.onChange
    }
  }

  // Returns all strings between curly braces in custom text
  CustomTextAttributes ():string[] {
    // eslint-disable-next-line no-useless-escape
    return this.context.parameters.customtext.raw?.match(/[^{\}]+(?=})/g) ?? []
  }

  SelectText ():string {
    return `--${this.context.parameters.customselecttext.raw ?? this.context.resources.getString("Select")}--`
  }

  replaceAll (string:string, search:string, replace:string) {
    return string.split(search).join(replace)
  }

  getRecordText (record:ComponentFramework.WebApi.Entity, primaryname:string):string {
    // Default = record primaryname
    if (!this.customText) {
      return record[`${primaryname}`]
    } else {
      // Custom text
      let customtext = this.customText;
        this.CustomTextAttributes().forEach(attribute => {
          // check if there is a formated value for the attribute (ex. Choice, Date, Lookup etc)
          const formatedValue = record[`${attribute}@OData.Community.Display.V1.FormattedValue`] ??
                                record[`_${attribute}_value@OData.Community.Display.V1.FormattedValue`] ??
                                record[`${attribute}`]
          customtext = this.replaceAll(customtext!, `{${attribute}}`, formatedValue ?? '')
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
      const manytoonerelationship = metadata.ManyToOneRelationships?.getByName(this.filterRelationshipName)
      const onetomanyrelationship = metadata.OneToManyRelationships?.getByName(this.filterRelationshipName)
      const manytomanyrelationship = metadata.ManyToManyRelationships?.getByName(this.filterRelationshipName)

      const linkentity = manytoonerelationship
        ? this.getManyToOneLinkEntity(manytoonerelationship)
        : (onetomanyrelationship
            ? this.getOneToManyLinkEntity(onetomanyrelationship, entityname)
            : this.getManyToManyLinkEntity(manytomanyrelationship, entityname))

      entityelement.appendChild(linkentity)
    }

    const fetchxmlstring = new XMLSerializer().serializeToString(fetchxmldoc)
    const result = await this.context.webAPI
      .retrieveMultipleRecords(entityname, `?fetchXml=${fetchxmlstring}`)

    if (result.entities)
    {
      if (this.context.parameters.sortByTextValue.raw === 'true')
      {
        return result.entities?.sort((a, b) => {
          const aText = this.getRecordText(a, primaryname);
          const bText = this.getRecordText(b, primaryname);
          return aText.localeCompare(bText);
        });
      }
      return result.entities;
    }
    return [];
  }

  private getManyToOneLinkEntity (manytoonerelationship:any) :HTMLElement {
    const from = `${this.dependentEntityName}id`
    const to = manytoonerelationship.ReferencingAttribute

    const linkentity = document.createElement('link-entity')
    linkentity.setAttribute('name', this.dependentEntityName)
    linkentity.setAttribute('from', from)
    linkentity.setAttribute('to', to)
    linkentity.setAttribute('alias', 'dependent')

    const filter = document.createElement('filter')
    filter.setAttribute('type', 'and')

    const condition = document.createElement('condition')
    condition.setAttribute('attribute', `${this.dependentEntityName}id`)
    condition.setAttribute('operator', 'eq')
    condition.setAttribute('uitype', this.dependentEntityName)
    condition.setAttribute('value', this.dependentValue?.id ?? '')

    filter.appendChild(condition)
    linkentity.appendChild(filter)

    return linkentity
  }

  private getOneToManyLinkEntity (onetomanyrelationship:any, baseentityname:string) :HTMLElement {
    const from = onetomanyrelationship.ReferencingAttribute
    const to = `${baseentityname}id`

    const linkentity = document.createElement('link-entity')
    linkentity.setAttribute('name', this.dependentEntityName)
    linkentity.setAttribute('from', from)
    linkentity.setAttribute('to', to)
    linkentity.setAttribute('alias', 'dependent')

    const filter = document.createElement('filter')
    filter.setAttribute('type', 'and')

    const condition = document.createElement('condition')
    condition.setAttribute('attribute', `${this.dependentEntityName}id`)
    condition.setAttribute('operator', 'eq')
    condition.setAttribute('uitype', this.dependentEntityName)
    condition.setAttribute('value', this.dependentValue?.id ?? '')

    filter.appendChild(condition)
    linkentity.appendChild(filter)

    return linkentity
  }

  private getManyToManyLinkEntity (manytomanyrelationship:any, baseentityname:string) :HTMLElement {
    const intersectentity = manytomanyrelationship.IntersectEntityName
    const intersectFromTo = manytomanyrelationship.Entity1LogicalName === baseentityname
      ? manytomanyrelationship.Entity1IntersectAttribute
      : manytomanyrelationship.Entity2IntersectAttribute

    const dependententity = manytomanyrelationship.Entity1LogicalName === baseentityname
      ? manytomanyrelationship.Entity2LogicalName
      : manytomanyrelationship.Entity1LogicalName

    const dependententityFromTo = manytomanyrelationship.Entity1LogicalName === baseentityname
      ? manytomanyrelationship.Entity2IntersectAttribute
      : manytomanyrelationship.Entity1IntersectAttribute

    const linkentity1 = document.createElement('link-entity')
    linkentity1.setAttribute('name', intersectentity)
    linkentity1.setAttribute('from', intersectFromTo)
    linkentity1.setAttribute('to', intersectFromTo)

    const linkentity2 = document.createElement('link-entity')
    linkentity2.setAttribute('name', dependententity)
    linkentity2.setAttribute('from', dependententityFromTo)
    linkentity2.setAttribute('to', dependententityFromTo)
    linkentity2.setAttribute('alias', 'dependent')

    const filter = document.createElement('filter')
    filter.setAttribute('type', 'and')

    const condition = document.createElement('condition')
    condition.setAttribute('attribute', dependententityFromTo)
    condition.setAttribute('operator', 'eq')
    condition.setAttribute('uitype', dependententity)
    condition.setAttribute('value', this.dependentValue?.id ?? '')

    filter.appendChild(condition)
    linkentity2.appendChild(filter)
    linkentity1.appendChild(linkentity2)
    return linkentity1
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
