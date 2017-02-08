import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SliderRange from './RangeSlider';
import {grey600} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';

// Filters
import TypeDropdown from './filters/TypeDropdown';
import StartDropdown from './filters/StartDropdown';

const styles = {
    menu: {
        width: 600,
        maxWidth: "100vw",
        overflow: "hidden"
    },
    dropdown: {
        fontSize: 12,
        color: grey600
    },
    mapButton: {
        fontSize: 12,
        color: grey600,
        lineHeight: "56px",
        position: "relative",
        top: 4,
        cursor: "pointer",
        marginLeft: 24,
    },
    dropdownIcon: {
        fill: grey600
    },
    dialog : {
        display : "flex",
        flexFlow: "column nowrap",
        overflowY: "auto"
    }
};

const defaultState = {
    durationMin : 0,
    durationMax : 6,
};

export default class FilterBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            durationMin: defaultState.durationMin,
            durationMax: defaultState.durationMax,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open});
    }

    _handleDurationChange = (min, max) => {
        this.setState({durationMin: min, durationMax: max});
    }

    _handleClose = () => {
        this.setState({open: false});
        this.props.handleClose();
    };

    render() {
        let toolbarClassName = this.state.open ? "filterBar hidden-xs" : "filterBar hidden-xs hidden";
        if (this.props.mapMode) toolbarClassName += " hidden";
        let durationLabel = "Durée";
        if(this.state.durationMin > defaultState.durationMin && this.state.durationMax < defaultState.durationMax) {
            durationLabel += " : entre "+(this.state.durationMin+1)+" et "+(this.state.durationMax+1)+" mois";
        } else if (this.state.durationMin > defaultState.durationMin) {
            durationLabel += " : au minimum "+(this.state.durationMin+1)+" mois";
        } else if (this.state.durationMax < defaultState.durationMax) {
            durationLabel += " : au maximum "+(this.state.durationMax+1)+" mois";
        }
        return(
            <div>
                <Toolbar className={toolbarClassName}>
                    <ToolbarGroup>
                        <TypeDropdown labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}/>
                        <StartDropdown labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}/>
                        <DropDownMenu value={0} menuStyle={styles.menu} labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}>
                            <MenuItem value={0} label={durationLabel} style={{display: "none"}}/>
                            <SliderRange labels={["1 mois","2 mois","3 mois","4 mois","5 mois","6 mois","∞"]} min={this.state.durationMin} max={this.state.durationMax} onChange={this._handleDurationChange}/>
                        </DropDownMenu>
                        <span style={styles.mapButton} onClick={this.props.handleMapFilter}>Filtre géographique...</span>
                    </ToolbarGroup>
                    <Dialog
                        title="Options"
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this._handleClose}
                        className={this.props.mapMode ? "dialog" : "dialog visible-xs-block"}
                        bodyStyle={styles.dialog}
                    >
                        <TypeDropdown labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}/>
                        <StartDropdown labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}/>
                        <DropDownMenu value={0} menuStyle={styles.menu} labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon} underlineStyle={{display: "none"}}>
                            <MenuItem value={0} label={durationLabel} style={{display: "none"}}/>
                            <SliderRange labels={["1 mois","2 mois","3 mois","4 mois","5 mois","6 mois","∞"]} min={this.state.durationMin} max={this.state.durationMax} onChange={this._handleDurationChange}/>
                        </DropDownMenu>
                        <span style={styles.mapButton} onClick={this.props.handleMapFilter}>Filtre géographique...</span>
                    </Dialog>
                </Toolbar>
            </div>
            
        );
    }
}