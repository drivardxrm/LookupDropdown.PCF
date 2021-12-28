# LookupDropdown.PCF
 PowerApps Component framework (PCF) Control that renders a lookup field as a dropdown
 
 * Download latest version here : https://github.com/drivardxrm/LookupDropdown.PCF/releases/latest

#### Features:

* Will honour the default view filtering and ordering that is set in the field properties of the form.
![image](https://user-images.githubusercontent.com/38399134/147574119-8022ced0-ef53-42b5-806b-dadbdc7cc7e8.png)


* Show the record 'Primary Image' field.

* Customize the records display text with text fields other than the 'Primary Name' field.

![image](https://user-images.githubusercontent.com/38399134/147574639-15797398-1d53-44a5-a998-6e34acf2afd3.png)

![image](https://user-images.githubusercontent.com/38399134/147574666-236c4c7e-d813-4e6f-96af-026e7d6d4c13.png)



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
