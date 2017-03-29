import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {greenA400, grey500, grey300} from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import {primary700, accentA200, accentA400, accentA100} from '../colors';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import { hashHistory } from 'react-router';
import LogoIcon from './Logo';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Help from 'material-ui/svg-icons/communication/live-help';
import Github from 'mdi-svg/d/github';
import SvgIcon from 'material-ui/SvgIcon';

const styles = {
  tabItemContainer : {
    background: 'none'
  },
  selectField: {
    alignSelf: 'center',
    marginLeft: 25,
    marginRight: 25,
  },
  separator: {
    flex: "1 1 0",
  },
  menuStyle: {
    color: "white",
    lineHeight: "32px",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    border: "2px solid rgba(255,255,255,.5)"
  },
  menuStyleScrolled: {
    color: grey500,
    lineHeight: "32px",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    marginTop: 11,
    marginBottom: 11,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: grey300
  },
  titleStyle : {
    flex: "0 0 auto",
  },
  underline: {
    display: 'none'
  },
  selectedMenuItem: {
    color: greenA400
  },
  tabTemplate: {
    
  },
  tabTemplateScrolled: {
    color: grey500
  },
  inkBar: {
    background: greenA400
  }
};

const tabs = [
  {label: "Aide", location: "aide"},
  {label: "A propos", location: "a-propos"},
];

const menuItems = [
  {text: "Accueil", value: "accueil"},
  {text: "Emplois et stages", value: "rechercher"},
];

let inertiaTrigger = 30;
let appBarHeight = 64;
let handleClose = () => {return 1;}

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: null,
      altLocation: false,
      translateY: 0
    };
  }

  _handleTabChange = (value) => {
    this.setState({
      altLocation: value,
      open: true,
    });
    document.body.className = (window.innerWidth < 1200) ? "body pushed" : "body pushed600";
  };

  _handleSelectFieldChange = (event, index, value) => {
    this.setState({value});
    if (this.state.value != value) hashHistory.push(value);
  }

  componentWillMount () {
    handleClose = () => {
      this.setState({open: false, altLocation: false});
      document.body.className = "body";
    };
    let path = this.props.location.replace(/^\/([^\/]*).*$/, '$1');
    if (path == '') path = 'rechercher';
    this.setState({value: path});
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.inertia > inertiaTrigger || this.state.open) this.setState({translateY: 0});
    else if (nextProps.inertia < 0 && nextProps.top > 200) {
      this.setState({translateY: -100});
    };
  }

  _mapTabs = () => {
    return tabs.map((tab)=>{
      if (this.props.isAtTop && !this.state.open) {
        return (
          <Tab label={tab.label} value={tab.location} key={tab.location}></Tab>
        );
      } else {
        return (
          <Tab label={tab.label} value={tab.location} key={tab.location} buttonStyle={styles.tabTemplateScrolled}></Tab>
        );
      }
    });
  }

  _mapMenuItem = () => {
    return menuItems.map((menuItem)=>{
      return (
        <MenuItem value={menuItem.value} key={menuItem.value} primaryText={menuItem.text} />
      );
    });
  }

  render() {

    return (
      <div>
        <AppBar
          title={<LogoIcon className={(this.props.isAtTop || this.state.open) ? "logoIcon atTop" : "logoIcon scrolled"}/>}
          className={(this.props.isAtTop) ? "menuAppBar atTop" : "menuAppBar scrolled"}
          showMenuIconButton={false}
          zDepth={(this.props.isAtTop) ? 0 : 1}
          titleStyle={styles.titleStyle}
          style={{transform: "translateY("+this.state.translateY+"%)"}}
        >
          <SelectField
            value={this.state.value}
            onChange={this._handleSelectFieldChange}
            className={this.state.open ? "menuSelect open" : "menuSelect"}
            style={styles.selectField}
            labelStyle={(this.props.isAtTop) ? styles.menuStyle : styles.menuStyleScrolled}
            underlineStyle={styles.underline}
            selectedMenuItemStyle={styles.selectedMenuItem}
          >
            {this._mapMenuItem()}
          </SelectField>
          <div style={styles.separator}/>
          <Tabs
            value={this.state.altLocation}
            onChange={this._handleTabChange}
            className={(this.state.open) ? "menuTabs":"menuTabs hidden-xs"}
            tabItemContainerStyle={styles.tabItemContainer}
            inkBarStyle={styles.inkBar}
          >
            {this._mapTabs()}
          </Tabs>
          <IconButton
            className={(this.state.open) ? "helpIcon open visible-xs-block":"helpIcon visible-xs-block"}
            onClick={()=>this._handleTabChange('aide')}>
            <Help/>
          </IconButton>

          <Drawer
            open={this.state.open}
            docked={false}
            openSecondary={true}
            width={Math.min(window.innerWidth-84,600)}
            className="drawerContainer"
            onRequestChange={handleClose}
            overlayClassName="overlay"
            disableSwipeToOpen={true}>
              <AppBar
                className="drawerAppBar"
                iconElementLeft={<IconButton><NavigationClose/></IconButton>}
                onLeftIconButtonTouchTap={handleClose}
                style={{background: "white"}}
                />
                <div className={"drawerContent "+this.state.altLocation}>
                    <div className="drawerTabContent">
                        <h3>Aide</h3>
                        <p>L'application JobApp vous permet de <b>trouver des offres de stage ou d'emploi</b> et vous offre des <b>outils d'analyse de compétences</b></p>
                        <p>Lancez votre recherche, puis via le panneau <span className="fakeButton">Compétences</span> importez votre CV ou ajoutez manuellement votre CV et laissez nos algorithmes travailler !</p>
                        <p>Vous obtiendrez alors :</p>
                        <ul>
                            <li>La liste des offres correspondant à votre profil</li>
                            <li>La liste des compétences attendues pour ces offres</li>
                        </ul>
                        <p>Vous avez égalment la possibilité de filtrer les résultats via le panneau <span className="fakeButton">Filtres</span>.</p>
                        <p> Les offres qui correspondent à votre profil peuvent être <b>affichées sous forme de liste ou réparties sur une carte de France </b> pour faciliter une recherche selon des critères géographiques.</p>
                    </div>
                    <div className="drawerTabContent">
                        <h3>A propos</h3>
                        <p>Cette application a été développée par une équipe mixte de l'École Centrale de Lyon et emlyon business school dans le cadre d'un projet de fin d'étude.</p>
                        <p>Les données sont fournies et utilisées dans un but pédagogique.</p>
                        <p>Les documents de développement sont stockés sur deux <i>repositories</i> Github publics accessibles via les boutons ci-après.</p>
                        <IconButton href="https://github.com/tpucci/jobads-webapp">
                            <SvgIcon color={"black"}>
                                <path d={Github} />
                            </SvgIcon>
                        </IconButton>
                        <IconButton href="https://github.com/yannvgn/jobads-textminer">
                            <SvgIcon color={"black"}>
                                <path d={Github} />
                            </SvgIcon>
                        </IconButton>
                        <p>Nous vous informons que les données de votre CV ne sont pas collectées : elles sont temporairement conservées par l’app de manière à en extraire les compétences et vous proposer une analyse de ces dernières.</p>
                    </div>
                </div>
          </Drawer>
        </AppBar>
      </div>
    );
  }
}

export {handleClose};