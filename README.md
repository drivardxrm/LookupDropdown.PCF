# LookupDropdown.PCF 
![GitHub all releases](https://img.shields.io/github/downloads/drivardxrm/LookupDropdown.PCF/total)

 PowerApps Component framework (PCF) Control that renders a lookup field as a dropdown
 
**IMPORTANT : The control needs to be configured using the Classic UI see issue [#29](https://github.com/drivardxrm/LookupDropdown.PCF/issues/29) for more info**

**IMPORTANT** : since v2.0.0.0 the control as been refactored to use FluentUI v9 to blend with Model-driven apps [new Look](https://learn.microsoft.com/en-us/power-apps/user/modern-fluent-design?WT.mc_id=DX-MVP-5004959) 

![image](https://github.com/drivardxrm/LookupDropdown.PCF/assets/38399134/a5377ed4-66be-4594-88c0-59e65258a8d0)



 
**Blog posts :** 
 * https://itmustbecode.com/better-ux-with-a-lookup-dropdown-pcf-control/
 * https://itmustbecode.com/related-record-filtering-with-the-lookup-dropdown-pcf/
 
 
 * 📚[Try Component in Storybook](https://drivardxrm.github.io/LookupDropdown.PCF/)
 * Download latest version here : https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest

#### Features:

* Will honour the **default view** filtering and ordering that is set in the field properties of the form.

![image](https://user-images.githubusercontent.com/38399134/147574119-8022ced0-ef53-42b5-806b-dadbdc7cc7e8.png)


* Show the record **'Primary Image'** field.

* **Customize** the records display text with text fields other than the 'Primary Name' field.

![image](https://user-images.githubusercontent.com/38399134/147574893-f2f5b658-6400-4e58-a854-7160428fe8dd.png)

![image](https://github.com/drivardxrm/LookupDropdown.PCF/assets/38399134/76f9d204-96a2-4fab-9848-1b8cda2a795f)


* Support for Related Record Filtering (cascading)

![LookupDropdownFiltering2](https://github.com/drivardxrm/LookupDropdown.PCF/assets/38399134/4294c1be-5412-455a-876b-803e95a48b05)





# Dependencies
FluentUI V9: [https://github.com/microsoft/fluentui](https://react.fluentui.dev/?path=/docs/concepts-introduction--page)

tanstack-query : [https://react-query.tanstack.com/](https://tanstack.com/query/latest)

# Parameters
| Parameter         | Description                                                                                  | Default     |
|-------------------|----------------------------------------------------------------------------------------------|----------   |
| lookupfield  | REQUIRED: Bound Lookup field to render as dropdown                             |             |
| customtext  | OPTIONAL: Customize display text with any text attributes of the record. put attribute schema names between brackets {}. Ex. {new_firstname} {new_lastname}. Leave blank to show record primaryname. Support multiple language using the format LANGUAGECODE1##{attrib1lang1} {attrib2lang1}__LANGUAGECODE2##{attrib1lang2} {attrib2lang2} ex: 1033##{new_nameen}__1036##{new_namefr} |             |
| customselecttext    | OPTIONAL: Custom text for dropdown selector text (default = Select)    | |
| dependentlookupfield | OPTIONAL: Dependent Lookup field. Use when Related Records Filtering is set on the Field Properties    | |
| showRecordImage   | Show the record image beside the text | false  |
| showOpenRecordButton | Show a button next to the dropdown to open the selected record form.|  false    |
| sortByTextValue | Sort the dropdown list by the displayed text value instead of the default lookup view sorting order.|  false    |

# Screenshots

![Recording_Screenshot](https://github.com/drivardxrm/LookupDropdown.PCF/assets/38399134/e2aecc6a-94a3-4c4f-9cb2-0cac9002be9c)



# Installation
You can install the component directly from solution files contained in the 'Release' section
https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest
