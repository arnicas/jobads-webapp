import React from 'react';
import {Router, Route, hashHistory} from 'react-router';
import {grey600, grey400} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Menu from './menu';
import {primary500, primary700, accentA200} from '../colors';

// Routes
import Home from '../home';
import Search from '../search';
import Analyse from '../analyse';
import NotFound from '../system';
import About from '../about';

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: primary500,
    primary2Color: primary700,
    accent1Color: accentA200,
    pickerHeaderColor: primary500,
  },
});

const Main = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div>
      <Menu/>
      <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        <Route path="/rechercher" component={Search}/>
        <Route path="/analyser" component={Analyse}/>
        <Route path="/a-propos" component={About}/>
        <Route path='*' component={NotFound} />
      </Router>
    </div>
  </MuiThemeProvider>
);

export default Main;