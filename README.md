# LookupDropdown.PCF
 PowerApps Component framework (PCF) Control that renders a lookup field as a dropdown
 
 * Download latest version here : https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest

#### Features:

* Will honour the default view that is set on the field to fetch the dropdown records.

* Can include the record images.

* Ability to customize the records display text with record text fields other than the primary name attribute.

# Dependencies
FluentUI : https://github.com/microsoft/fluentui

react-query : https://react-query.tanstack.com/

# Parameters
| Parameter         | Description                                                                                  | Default     |
|-------------------|----------------------------------------------------------------------------------------------|----------   |
| lookupfield  | REQUIRED: Bound Lookup field to render as dropdown                             |             |
| customtext  | OPTIONAL: Customize display text with any text attributes of the record. put attribute schema names between brackets {}. Ex. {new_firstname} {new_lastname}. Leave blank to show record primaryname|             |
| customselecttext    | OPTIONAL: Custom text for dropdown selector text (default = Select)    | |
| showRecordImage   | Show the record image beside the text | false  |
| showOpenRecordButton | Show a button next to the dropdown to open the selected record form.|  false    |

# Installation
You can install the component directly from solution files contained in the 'Release' section
https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest
