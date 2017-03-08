import React from 'react';
import Chip from 'material-ui/Chip';
import {blue300, indigo300, yellow500, amber500, deepOrange300, greenA400, grey700} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import LocationIcon from 'material-ui/svg-icons/maps/place';
import CalendarIcon from 'material-ui/svg-icons/action/today';
import SkillPanelIcon from 'material-ui/svg-icons/action/class';

// Helpers
import formatPercent from '../../helpers/formatPercent';
import formatDate from '../../helpers/formatDate';

// App
import FilterBar from '../components/filters/FilterBar';
import Map from '../components/map/Map';
import SkillPanel from '../components/skills/SkillsPanel';

const styles = {
  inkBar: {
    backgroundColor: greenA400,
    top: 1,
    height: 3,
  },
  tabItemContainer: {
    backgroundColor: 'none',
  },
  tabLabel: {
    color: grey700,
    textTransform: 'none',
  }
};

export default class ResultScreen extends React.Component {

    constructor(props) {
        super(props);
        let {list, map} = this._setListAndMap(this.props.results);
        this.state = {
            value: props.mode,
            open: false,
            list: list,
            map: map,
            mapFiltering : {enable: false, from: 'list'},
            refreshMapKey : 0,
            skillsPanel: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.triggerRefresh && !nextProps.triggerRefresh) {
            this.setState(this._setListAndMap(nextProps.results));
            this.setState({refreshMapKey:this.state.refreshMapKey+1});
        }
    }

    _setListAndMap = (resultsIn) => {
        if(!resultsIn) return ({list:[],map:[]});
        let list = [], map = [];
        resultsIn.map((result)=>{
            list.push({
                company: result.company,
                title_fr: result.title_fr,
                description_fr: result.description_fr,
                location: result.location,
                date: result.date,
                id: result.id
            });
            if (result.geolocation){
                map.push({
                    lat: result.geolocation.lat,
                    lng: result.geolocation.lon,
                    weight: 40,
                    id: result._id,
                });
            }
        });
        return ({list:list,map:map});
    }

    _handleChange = (value) => {
        this.setState({
            value: value,
            open: false
        });
    };

    _mapJobs() {
        let jobs_ = this.state.list;
        if (jobs_.length == 0) {
            return(
                <div className="jobRow">
                    <div className="jobCell jobDescription">
                        <h3>:(</h3>
                        <p>Aucun résultat ne correspond à votre recherche</p>
                    </div>
                </div>
            );
        }
        return jobs_.map((job)=>{
            return (
                <div className="jobRow" key={job.id}>
                    <div className="jobCell jobDescription">
                        <h3>{job.company}</h3>
                        <h4>{job.title_fr}</h4>
                        <p>{job.description_fr.length > 155 ? job.description_fr.substring(0,155)+"..." : job.description_fr}</p>
                        <div className="info">
                            <LocationIcon/>
                            <span>{job.location}</span>
                            <CalendarIcon/>
                            <span>{"Publié le "+formatDate(job.date)}</span>
                        </div>
                    </div>
                </div>
            );
        });
    }

    _toggleFilterBar = () => {
        this.setState({open: !this.state.open});
    }

    _toggleSkillsPanel = () => {
        this.setState({skillsPanel: !this.state.skillsPanel});
    }

    _handleMapFilter = () => {
        this.setState({open: false, value: 'map', mapFiltering: {enable: true, from: this.state.value}});
    }
    _handleFilteringResult = (filteringCenter, filteringRadius) => {
        console.log('Promise resolve');
        this.state.prom.resolve({filteringCenter, filteringRadius});
    }

    _handleFilteringResult = (filteringCenter, filteringRadius) => {
        this.setState({value: this.state.mapFiltering.from, mapFiltering: {enable: false, from: 'list'}});
    }

    render () {
        let resultView = '';
        switch(this.state.value) {
            case('list'):
                resultView = (
                    <div className="jobTable">
                        {this._mapJobs()}
                    </div>
                );
                break;
            case('map'):
                resultView = (
                    <div className="jobMap">
                        <Map
                        key={this.state.refreshMapKey}
                        markers={this.state.map}
                        mapFiltering={this.state.mapFiltering.enable}
                        handleFilteringResult={this._handleFilteringResult}
                        query={this.props.query}
                        />
                    </div>
                );
        }
        return (
            <div className={"resultScreen "+this.state.value}>
                <div className="firstScreen">
                    <Tabs value={this.state.value} onChange={this._handleChange} inkBarStyle={styles.inkBar} tabItemContainerStyle={styles.tabItemContainer} tabTemplateStyle={styles.tabTemplate} className="tabs">
                        <Tab label="Liste" value="list" className="tab" buttonStyle={styles.tabLabel}></Tab>
                        <Tab label="Carte" value="map" className="tab" buttonStyle={styles.tabLabel}></Tab>
                    </Tabs>
                    <FlatButton label="Compétences" className={"options hidden-xs " + this.state.skillsPanel} onClick={this._toggleSkillsPanel}/>
                    <IconButton className="options-xs visible-xs-inline-block" onClick={this._toggleSkillsPanel}>
                        <SkillPanelIcon />
                    </IconButton>
                    <FlatButton label="Filtres" className={"options hidden-xs " + this.state.open} onClick={this._toggleFilterBar}/>
                    <IconButton className="options-xs visible-xs-inline-block" onClick={this._toggleFilterBar}>
                        <ContentFilter />
                    </IconButton>
                </div>
                <FilterBar filter={this.props.filter} open={this.state.open} handleClose={this._toggleFilterBar} handleMapFilter={this._handleMapFilter} mode={this.state.value} handleChange={this.props.handleFilterChange}/>
                <div className="jobOutter">
                    {resultView}
                    <SkillPanel open={this.state.skillsPanel} mode={this.state.value}/>
                </div>
            </div>
        );
    }
}