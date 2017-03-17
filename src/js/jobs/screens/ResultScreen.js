import React from 'react';
import Chip from 'material-ui/Chip';
import {blue300, indigo300, yellow500, amber500, deepOrange300, greenA400, grey700} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import SkillPanelIcon from 'material-ui/svg-icons/action/class';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

// Helpers
import post from '../../helpers/post';

// App
import FilterBar from '../components/filters/FilterBar';
import Map from '../components/map/Map';
import SkillPanel from '../components/skills/SkillsPanel';
import Item from '../components/list/Item';


// Infinite
import Infinite from 'react-infinite';

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
        let list = this._setList(this.props.results);
        this.state = {
            value: props.mode,
            open: false,
            list: list,
            mapFiltering : {enable: false, from: 'map'},
            refreshMapKey : 0,
            skillsPanel: false,
            isInfiniteLoading: false,
            error: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.triggerRefresh && !nextProps.triggerRefresh) {
            this.setState({list:this._setList(nextProps.results), endReached:false});
            this.setState({refreshMapKey:this.state.refreshMapKey+1});
        }
    }

    _setList = (resultsIn) => {
        if(!resultsIn) return ([]);
        let list = [];
        resultsIn.map((result)=>{
            list.push({
                company: result.company,
                title_fr: result.title_fr,
                description_fr: result.description_fr,
                location: result.location,
                date: result.date,
                id: result.id,
                error: 0,
            });
        });
        return (list);
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
                <Item key={job.id} job={job}/>
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

    _handleFilteringResult = (filteringCenter, filteringRadius, clear) => {
        this.setState({value: this.state.mapFiltering.from, mapFiltering: {enable: false, from: 'map'}});
        this.props.handleFilteringResult(filteringCenter, filteringRadius, clear);
    }

    _handleInfiniteLoad = () => {
        if(this.state.endReached || this.state.error !== 0) return;
        console.log(this.state.list.length+' objects loaded, loading 20 more. isInfiniteLoading:'+this.state.isInfiniteLoading);
        this.setState({
            isInfiniteLoading: true,
        });
        post('/api/ja/search/', Object.assign({},this.props.query,{limit:20, offset:this.state.list.length})).then((response)=>{
            if(response.status == 200) {
                let rawListItems = response.res.results;
                let newList = this._setList(rawListItems);
                this.setState({
                    isInfiniteLoading: false,
                    list: this.state.list.concat(newList),
                    error: 0
                });
                if (response.res.results.length<20) {
                    this.setState({endReached : true});
                }
            } else {
                this.setState({isInfiniteLoading: false, error: response.status});
            }
        }).catch((err)=>{
            console.log(err);
            this.setState({isInfiniteLoading: false, error: err});
        });
    }

    render () {
        let resultView = '';
        let end = '';
        if(this.state.endReached) {
            switch(this.state.list.length) {
                case(0):
                    break;
                case(1):
                    end = "1 résultat.";
                    break;
                default:
                    end = this.state.list.length+" résultats.";
            }
        }
        switch(this.state.value) {
            case('list'):
                resultView = (
                    <Infinite
                    className="jobTable"
                    useWindowAsScrollContainer={true}
                    elementHeight={132}
                    infiniteLoadBeginEdgeOffset={200}
                    onInfiniteLoad={this._handleInfiniteLoad}
                    loadingSpinnerDelegate={this.state.isInfiniteLoading &&
                        <CircularProgress color={greenA400} className="loadingIndicator"/>
                    }
                    isInfiniteLoading={this.state.isInfiniteLoading}
                    >
                        {this._mapJobs()}
                    </Infinite>
                );
                break;
            case('map'):
                resultView = (
                    <div className="jobMap">
                        <Map
                        key={this.state.refreshMapKey}
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
                {this.state.error !== 0 &&
                    <Snackbar
                        open={true}
                        message={"Une erreur est survenue ("+this.state.error+")"}
                        autoHideDuration={-1}
                        action="Réessayer"
                        onActionTouchTap={()=>{this.setState({error:0})}}
                    />
                }
            </div>
        );
    }
}