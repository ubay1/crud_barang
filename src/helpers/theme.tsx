import { createMuiTheme } from "@material-ui/core";
import { blue, grey } from "@material-ui/core/colors";

const ThemeMUI = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      light: grey[50],
      // dark: grey[900],
    },
    secondary: {
      main: '#42b72a',
    },
    grey: grey 
  },
});

export default ThemeMUI;