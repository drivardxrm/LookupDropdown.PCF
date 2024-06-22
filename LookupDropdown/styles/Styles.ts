import { makeStyles,  tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({

  tagPickerControl: {
    paddingLeft: '3px',
    height: '32px'
  },
  tagPickerGroup: {
    padding: '0 0 0 0'
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
  elementVisible: {
    visibility: 'visible'
  },
  elementHidden: {
    visibility: 'hidden'
  },
  icon12: { fontSize: "12px" },
  tagSelected: {
     backgroundColor: tokens.colorNeutralBackground1Pressed,
  },
  noborder: {
    border: 'none'
  },
  tagpicker: {
    height: '32px',
  },
  
});