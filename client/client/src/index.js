import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from './components/HomePage';

// Material Touch Input injection
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <HomePage />
  </MuiThemeProvider>
)

render(<App />, document.getElementById('app'));