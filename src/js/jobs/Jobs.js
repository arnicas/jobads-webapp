import React from 'react';
import Layout from '../container/Layout';
import Snackbar from 'material-ui/Snackbar';

// helpers
import post from '../helpers/post';

// Screens
import SearchScreen from './screens/SearchScreen';
import ResultScreen from './screens/ResultScreen';


export default class Jobs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            filter: {},
            skills: {},
            results: {},
            waiting: false,
            showResult: false,
            needRefresh: false,
            error: 0,
            geoFiltering: false,
            mode: "list"
        };
    }

    _setSkills = (skills) => {this.setState(skills);}
    _handleError = (error) => {this.setState(error);}
    _handleQueryChange = (query) => {this.setState({query, needRefresh:{value:true, reason:"Requête modifiée"}});}
    _handleFilterChange = (newFilters) => {this.setState({filter:newFilters, needRefresh:{value:true, reason:"Filtres modifiés"}});}

    _sendQuery = () => {
        this.setState({waiting: true});
        post('/api/ja/search/', {text: this.state.query}).then((response)=>{
            if(response.status == 200) {
                this.setState({waiting: false, showResult:true, needRefresh:{value:false}, results:response.res.results, error: 0});
            } else {
                this.setState({waiting: false, error: response.status});
            }
        }).catch((err)=>{
            console.log(err);
            this.setState({waiting: false, error: err});
        });
    }
    

    render() {
        return(
            <Layout location={this.props.location.pathname}>
                <SearchScreen
                    handleFilterChange={this._handleFilterChange}
                    onSkillsProcessed={this._setSkills}
                    onError={this._handleError}
                    onQueryChange={this._handleQueryChange}
                    onSendClick={this._sendQuery}
                    showResult={this.state.showResult}
                    waiting={this.state.waiting}
                    filter={this.state.filter}
                    needRefresh={this.state.needRefresh.value}
                />
                
                {this.state.showResult &&
                    <ResultScreen
                        results={this.state.results}
                        triggerRefresh={this.state.waiting}
                        handleFilterChange={this._handleFilterChange}
                        query={this.state.query}
                        filter={this.state.filter}
                        mode={this.state.mode}
                        geoFiltering={this.state.geoFiltering}
                        handleFilteringResult={this._handleFilteringResult}
                        needRefresh={this.state.needRefresh.value}
                    />
                }
                {this.state.error !== 0 &&
                    <Snackbar
                        open={true}
                        message={"Une erreur est survenue ("+this.state.error+")"}
                        autoHideDuration={4000}
                    />
                }
                {(this.state.showResult && this.state.needRefresh.value) &&
                    <Snackbar
                        className="refreshMessage"
                        open={this.state.needRefresh.value}
                        message={this.state.needRefresh.reason}
                        action="Rafraîchir les résultats"
                        onActionTouchTap={this._sendQuery}
                        autoHideDuration={-1}
                        onRequestClose={(event)=>{}}
                    />
                }
            </Layout>
        );
    }
}