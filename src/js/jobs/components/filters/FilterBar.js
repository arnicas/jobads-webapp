import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey600} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';

// App
import FilterDropdown from './FilterDropdown';
import SliderRange from './RangeSlider';

const styles = {
    menu: {
        width: 600,
        maxWidth: "100vw",
        overflow: "hidden"
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
    dialog : {
        display : "flex",
        flexFlow: "column nowrap",
        overflowY: "auto"
    },
    dropdown: {
        fontSize: 12,
        color: grey600
    },
    dropdownIcon: {
        fill: grey600
    },
    dropdownWrapper: {
        flex: "0 1 auto"
    }
};

const labelStylesSearchScreenMode = {
    dropdown: {
        fontSize: 12,
        color: "white",
        transition: ".3s"
    },
    dropdownIcon: {
        fill: "white"
    },
    mapButton: {
        fontSize: 12,
        color: "white",
        lineHeight: "56px",
        position: "relative",
        top: 4,
        cursor: "pointer",
        marginLeft: 24,
    },
};

const labelStylesDefault = {
    dropdown: {
        fontSize: 12,
        color: grey600
    },
    dropdownIcon: {
        fill: grey600
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
};

const typeMenu = {
    filter : "type",
    label : "Type",
    default: 0,
    values : [
        {value: 'CDI', label: 'CDI'},
        {value: 'stage', label: 'Stage'},
        {value: 'CDD', label: 'CDD'},
        {value: 'alternance', label: 'Alternance'},
        {value: 'graduate-program', label: 'Graduate Program'},
        {value: 'these', label: 'Thèse'},
        {value: 'interim', label: 'Intérim'},
        {value: 0, label: 'Indifférent'},
    ]
};

const publishedMenu = {
    filter: "beginning",
    label : "Date de publication",
    default: 0,
    values : [
        {value: 4, label: 'Il y a 2 mois'},
        {value: 3, label: 'Il y a 1 mois'},
        {value: 2, label: 'Cette semaine'},
        {value: 1, label: 'Dernières 24 heures'},
        {value: 0, label: 'Indifférent'},
    ]
};

const defaultState = {
    salaryMin : 0,
    salaryMax : 6,
    type : 0,
    published : 0,
    geo: {}
};

export default class FilterBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({open: props.open,}, defaultState, props.filter);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open});
    }

    _handleTypeChange = (value) => {
        this.setState({type: value});
    }
    _handlePublishedChange = (value) => {
        this.setState({published: value});
    }
    _handleDurationChange = (min, max) => {
        this.setState({salaryMin: min, salaryMax: max});
    }

    _handleClose = () => {
        this.setState({open: false});
        this.props.handleClose();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.published !== this.state.published ||
            prevState.salaryMin !== this.state.salaryMin ||
            prevState.salaryMax !== this.state.salaryMax ||
            prevState.type !== this.state.type) {
            let newFilters = {};
            if (this.state.published !== defaultState.published) newFilters = Object.assign(newFilters,{published : this.state.published});
            if (this.state.salaryMin !== defaultState.salaryMin) newFilters = Object.assign(newFilters,{salary_min : this.state.salaryMin*10000});
            if (this.state.salaryMax !== defaultState.salaryMax) newFilters = Object.assign(newFilters,{salary_max : this.state.salaryMax*10000});
            if (this.state.type !== defaultState.type) newFilters = Object.assign(newFilters,{jobtype : this.state.type});
            this.props.handleChange(newFilters);
        }
    }

    render() {
        let toolbarClassName = this.state.open ? "filterBar hidden-xs " : "filterBar hidden-xs hidden ";
        toolbarClassName += this.props.mode;
        if (this.props.mode == "map") toolbarClassName += " hidden";
        let durationLabel = "Salaire";
        if(this.state.salaryMin > defaultState.salaryMin && this.state.salaryMax < defaultState.salaryMax) {
            durationLabel += " : entre "+(this.state.salaryMin)+"0K€ et "+(this.state.salaryMax)+"0K€";
        } else if (this.state.salaryMin > defaultState.salaryMin) {
            durationLabel += " : au minimum "+(this.state.salaryMin)+"0K€";
        } else if (this.state.salaryMax < defaultState.salaryMax) {
            durationLabel += " : au maximum "+(this.state.salaryMax)+"0K€";
        }
        let labelStyles = (this.props.light) ? labelStylesSearchScreenMode : labelStylesDefault;
        return(
            <div className="filterBarWrapper">
                <Toolbar className={toolbarClassName}>
                    <ToolbarGroup>
                        <FilterDropdown menu={typeMenu} value={this.state.type} labelStyle={labelStyles.dropdown} iconStyle={labelStyles.dropdownIcon} onChange={this._handleTypeChange}/>
                        <FilterDropdown menu={publishedMenu} value={this.state.published} onChange={this._handlePublishedChange} labelStyle={labelStyles.dropdown} iconStyle={labelStyles.dropdownIcon}/>
                        <DropDownMenu value={0} menuStyle={styles.menu} labelStyle={labelStyles.dropdown} iconStyle={labelStyles.dropdownIcon} style={styles.dropdownWrapper}>
                            <MenuItem value={0} label={durationLabel} style={{display: "none"}}/>
                            <SliderRange labels={["Nul","10K€","20K€","30K€","40K€","50K€","+50K€"]} min={this.state.salaryMin} max={this.state.salaryMax} onChange={this._handleDurationChange}/>
                        </DropDownMenu>
                        {this.props.handleMapFilter &&
                            <span style={labelStyles.mapButton} onClick={this.props.handleMapFilter}>Filtre géographique...</span>
                        }
                    </ToolbarGroup>
                    <Dialog
                        title="Filtres"
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this._handleClose}
                        className={this.props.mode == "map" ? "dialog" : "dialog visible-xs-block"}
                        bodyStyle={styles.dialog}
                    >
                        <FilterDropdown menu={typeMenu} value={this.state.type} labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon} onChange={this._handleTypeChange}/>
                        <FilterDropdown menu={publishedMenu} value={this.state.published} onChange={this._handlePublishedChange} labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon}/>
                        <DropDownMenu value={0} menuStyle={styles.menu} labelStyle={styles.dropdown} iconStyle={styles.dropdownIcon} underlineStyle={{display: "none"}}>
                            <MenuItem value={0} label={durationLabel} style={{display: "none"}}/>
                            <SliderRange labels={["Nul","10K€","20K€","30K€","40K€","50K€","+50K€"]} min={this.state.salaryMin} max={this.state.salaryMax} onChange={this._handleDurationChange}/>
                        </DropDownMenu>
                        {this.props.handleMapFilter &&
                            <span style={styles.mapButton} onClick={this.props.handleMapFilter}>Filtre géographique...</span>
                        }
                    </Dialog>
                </Toolbar>
            </div>
            
        );
    }
}