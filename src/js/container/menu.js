import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import {primary700, accentA200, accentA400, accentA100} from '../colors';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';

// Icons
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionAssessment from 'material-ui/svg-icons/action/assessment';
import ActionClose from 'material-ui/svg-icons/content/clear';

var _colors = require('material-ui/styles/colors');

var _colorManipulator = require('material-ui/utils/colorManipulator');

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: primary700,
    primary2Color: primary700,
    accent1Color: accentA200,
    accent2Color: accentA400,
    accent3Color: accentA100,
    textColor: _colors.fullWhite,
    secondaryTextColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3),
    disabledColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3),
    pickerHeaderColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.12),
    clockCircleColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.12)
  }
});

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Drawer open={this.state.open}>
            <AppBar title={<img height="36" src="images/logo.png"/>} showMenuIconButton={false} className="menuAppBar" zDepth={0} iconElementRight={<IconButton><ActionClose/></IconButton>}/>
            <MenuItem href="#/rechercher" primaryText="Rechercher" leftIcon={<ActionSearch />}/>
            <MenuItem href="#/analyser" primaryText="Analyse de CV" leftIcon={<ActionAssessment />}/>
            <Subheader>PRODUIT</Subheader>
            <MenuItem href="#/a-propos" primaryText="A propos"/>
        </Drawer>
      </MuiThemeProvider>
    );
  }
}