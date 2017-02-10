import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {grey600, greenA200} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import Snackbar from 'material-ui/Snackbar';

// helpers
import post from '../helpers/post';

// Screens
import ResultScreen from '../analyse/ResultScreen';

const styles = {
    underline: {
        borderBottom: "2px solid",
        borderColor: "white"
    },
    underlineFocus: {
        borderBottom: "2px solid",
        borderColor: "black"
    },
    underlineDisabled: {
        borderBottom: "0px solid",
    },
    underlineShowResult: {
        borderBottom: "0px solid",
        borderColor: "white"
    },
    floatingLabel: {
        color: "white"
    },
    floatingLabelFocus: {
        color: grey600
    },
    textarea: {
        lineHeight: "40px"
    }
};

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            newValue: "",
            waiting: false,
            showResult: false,
            results: [],
            error: 0,
        };
    }

    _handleFocus = (isFocused) => {
        this.setState({active: isFocused});
    }

    _onTextInput = (event, newValue) => {
        this.setState({value: newValue});
    }

    _onSendClick = () => {
        this.setState({waiting: true});
        post('/api/text-query', {text: this.state.value}).then((response)=>{
            if(response.status == 200) {
                this.setState({waiting: false, showResult:true, results:response.res.results, error: 0});
            } else {
                this.setState({waiting: false, error: response.status});
            }
        }).catch((err)=>{
            console.log(err);
            this.setState({waiting: false, error: err});
        });
    }

    render () {
        return (
            <div>
                <div className={"searchContainer" + ((this.state.active && !this.state.waiting) ? " active" : "") + ((this.state.showResult) ? " showResult" : "")}>
                    <div className="searchFieldContainer" id="searchFieldContainer">
                        {!this.state.showResult &&
                            <span className="badge">Nouveau</span>
                        }
                        <TextField
                            id="search-field"
                            disabled={this.state.waiting}
                            className="textField"
                            floatingLabelText={this.state.showResult ? ' ' : "Tapez votre requête"}
                            multiLine={true}
                            rows={1}
                            fullWidth={true}
                            underlineStyle={this.state.showResult ? styles.underlineShowResult : styles.underline}
                            underlineFocusStyle={styles.underlineFocus}
                            underlineDisabledStyle={styles.underlineDisabled}
                            floatingLabelStyle={styles.floatingLabel}
                            floatingLabelFocusStyle={styles.floatingLabelFocus}
                            textareaStyle={styles.textarea}
                            onFocus={()=>this._handleFocus(true)}
                            onBlur={()=>this._handleFocus(false)}
                            onChange={this._onTextInput}
                        />
                        {this.state.waiting &&
                            <LinearProgress mode="indeterminate" className={"waitingIndicator" + (this.state.showResult ? ' allWidth' : '')} color={greenA200}/>
                        }
                        <div>
                            {this.state.showResult ? (
                                <IconButton tooltip="Rechercher">
                                    <ActionSearch color={'white'} onClick={this._onSendClick}/>
                                </IconButton>
                            ) : (
                                <RaisedButton disabled={this.state.waiting} label="Envoyer" className="accentButton" onClick={this._onSendClick}/>
                            )}
                        </div>
                    </div>
                </div>
                {this.state.showResult &&
                    <ResultScreen results={this.state.results}/>
                }
                {this.state.error !== 0 &&
                    <Snackbar
                        open={true}
                        message={"Une erreur est survenue ("+this.state.error+")"}
                        autoHideDuration={4000}
                    />
                }
            </div>
        );
    }
}