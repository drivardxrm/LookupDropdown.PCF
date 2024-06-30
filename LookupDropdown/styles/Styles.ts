import { makeStyles,  tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({

  tagPickerControl: {
    minWidth: '200px',
    paddingLeft: '3px',
    height: '32px'
  },
  tagPickerControlEmpty: {
    paddingLeft: '10px',
  },
  tagPickerGroup: {
    padding: '0 0 0 0',
  },
  
  tagPickerGroupVisible: {
    display: 'block'
  },
  tagPickerGroupHidden: {
    display: 'none'
  },
  tagPickerInput: {
   padding: '0 0 0 0'
  },
  tagPickerOption : {
    display: 'flex',
    alignItems: 'center' /* This centers the content vertically */
  },
  clearButton: {
    paddingLeft: '0',
    paddingRight: '0',
    minWidth: '10px'
  },
  
  elementVisible: {
    visibility: 'visible'
  },
  elementHidden: {
    visibility: 'hidden',
    display: 'none'     // gives back the space
  },
  icon12: { fontSize: "12px" },
  tagSelected: {
     backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  tagpicker: {
    height: '32px',
  },
  tag: {
    border: 'none'
  },
  tagOverflow: {
    whiteSpace: 'nowrap', /* Prevents the text from wrapping to the next line */
    overflow: 'hidden', /* Hides the overflow text */
    textOverflow: 'ellipsis', /* Adds an ellipsis to indicate text cut off */
  },
  tagOverflowLink: {
    maxWidth: '100%',
    display: 'inline-block',
  },
});