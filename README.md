# LookupDropdown.PCF 
![GitHub all releases](https://img.shields.io/github/downloads/drivardxrm/LookupDropdown.PCF/total)

 PowerApps Component framework (PCF) Control that renders a lookup field as a dropdown
 
**IMPORTANT : The control needs to be configured using the Classic UI see issue [#29](https://github.com/drivardxrm/LookupDropdown.PCF/issues/29) for more info**

**UPDATE 2022-01-20 : PLEASE USE v1.0.0.2 or above, a 🐛 was found in earlier versions**

 
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


![image](https://user-images.githubusercontent.com/38399134/147574921-388d1e41-3873-4a03-aa8d-9e64a103621f.png)

* Support for Related Record Filtering (cascading)


![lookupdropdown-dependant2](https://user-images.githubusercontent.com/38399134/153111779-cceb0486-65f3-45b8-a12a-6bc5414b9d21.gif)



# Dependencies
FluentUI : https://github.com/microsoft/fluentui

react-query : https://react-query.tanstack.com/

# Parameters
| Parameter         | Description                                                                                  | Default     |
|-------------------|----------------------------------------------------------------------------------------------|----------   |
| lookupfield  | REQUIRED: Bound Lookup field to render as dropdown                             |             |
| customtext  | OPTIONAL: Customize display text with any text attributes of the record. put attribute schema names between brackets {}. Ex. {new_firstname} {new_lastname}. Leave blank to show record primaryname. Support multiple language using the format LANGUAGECODE1##{attrib1lang1} {attrib2lang1}__LANGUAGECODE2##{attrib1lang2} {attrib1lang2} ex: 1033##{new_nameen}__1036##{new_namefr} |             |
| customselecttext    | OPTIONAL: Custom text for dropdown selector text (default = Select)    | |
| dependentlookupfield | OPTIONAL: Dependent Lookup field. Use when Related Records Filtering is set on the Field Properties    | |
| showRecordImage   | Show the record image beside the text | false  |
| showOpenRecordButton | Show a button next to the dropdown to open the selected record form.|  false    |
| sortByTextValue | Sort the dropdown list by the displayed text value instead of the default lookup view sorting order.|  false    |

# Screenshots

![lookupdropdown](https://user-images.githubusercontent.com/38399134/147582453-e507d7ab-d83d-476e-96af-d48a85d495c1.gif)


# Installation
You can install the component directly from solution files contained in the 'Release' section
https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest
