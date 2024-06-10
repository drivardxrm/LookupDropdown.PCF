import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  // stackHorizontal: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'nowrap',
  //   width: 'auto',
  //   height: 'auto',
  //   boxSizing: 'border-box',
  //   alignSelf: 'flex-start',
  //   '> *': {
  //     textOverflow: 'ellipsis',
  //   },
  //   '> :not(:first-child)': {
  //     marginTop: '0px',
  //   },
  //   '> :not(:last-child)': {
  //     marginRight: '3px',
  //   },
  //   '> *:not(.ms-StackItem)': {
  //     flexShrink: 1,
  //   },
  // },
  // stackVertical: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   flexWrap: 'nowrap',
  //   width: 'auto',
  //   height: 'auto',
  //   ...shorthands.overflow('auto'),
  //   boxSizing: 'border-box',
  //   '> *': {
  //     textOverflow: 'ellipsis',
  //   },
  //   '> :not(:first-child)': {
  //     marginTop: '0px',
  //   },
  //   '> *:not(.ms-StackItem)': {
  //     flexShrink: 1,
  //   },
  // },
  // stackItem: {
  //   height: 'auto',
  //   width: 'auto',
  //   flexShrink: 1,
  // }, 
  // spacer10: {
  //   marginTop: '10px',
  // },
  // main: {
  //   ...shorthands.gap("36px"),
  //   display: "flex",
  //   flexDirection: "column",
  //   flexWrap: "wrap",
  // },

  // title: {
  //   ...shorthands.margin(0, 0, "12px"),
  // },

  // description: {
  //   ...shorthands.margin(0, 0, "12px"),
  // },

  // card: {
  //   maxWidth: "100%",
  //   height: "fit-content",
  // },

  // caption: {
  //   color: tokens.colorNeutralForeground3,
  // },

  // logo: {
  //   ...shorthands.borderRadius("4px"),
  //   width: "48px",
  //   height: "48px",
  // },

  // text: {
  //   ...shorthands.margin(0),
  // },
  // selector: {
  //   // Stack the label above the field with a gap
  //   maxWidth: "500px", 
  //   marginLeft: "15px",
  //   marginTop: "5px",
  // },
  // grouptag: {
  //   fontWeight: "bold",
  // },
  // control: {
  //   maxWidth: "300px",
  // },
  // sidebarheader:{
  //   textAlign: "center",
  //   transform: "translate(0, 25%)",
  // },
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
  expandIconVisible: {
    visibility: 'visible'
  },
  expandIconHidden: {
    visibility: 'hidden'
  },
  icon12: { fontSize: "12px" },
});