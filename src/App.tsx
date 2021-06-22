import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {store} from './store';
import { Provider } from 'react-redux';
import ROUTES, { RenderRoutes } from "./routes";
import './assets/global.css'
import './assets/font.css'
import { ThemeProvider } from '@material-ui/core';
import ThemeMUI from './helpers/theme';

function App() {
  return (
    <ThemeProvider theme={ThemeMUI}>
      <Provider store={store}>
        <Router>
          <RenderRoutes routes={ROUTES}/>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
