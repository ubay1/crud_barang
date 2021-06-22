import { createMuiTheme } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { blue, grey } from "@material-ui/core/colors";

const ThemeMUI = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      light: grey[50],
      // dark: grey[900],
    },
    secondary: {
      main: pink[500],
    },
    grey: grey 
  },
});

export default ThemeMUI;