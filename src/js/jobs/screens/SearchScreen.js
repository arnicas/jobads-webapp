import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {grey600, greenA200} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionRefresh from 'material-ui/svg-icons/action/youtube-searched-for';
import Snackbar from 'material-ui/Snackbar';

// App
import FilterBar from '../components/filters/FilterBar';

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
    },
    hint: {
        fontSize: 26,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        maxHeight: 34,
        paddingBottom: 8,
        overflow: "hidden",
        maxWidth: "100%",
    }
};

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            openFilter: (window.innerWidth >= 768),
        };
    }

    _handleFocus = (isFocused) => {
        this.setState({active: isFocused});
    }

    _onTextInput = (event, newValue) => {
        this.props.onQueryChange(newValue);
    }

    _handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this.props.onSendClick();
                break;
        }
    }

    _toggleFilterBar = () => {
        this.setState({openFilter: !this.state.openFilter});
    }

    render () {
        return (
            <div className="searchScreen">
                <div className={"searchContainer" + ((this.state.active && !this.props.waiting) ? " active" : "") + ((this.props.showResult) ? " showResult" : "")}>
                    <div className="searchFieldContainer" id="searchFieldContainer">
                        {!this.props.showResult &&
                            <span className="badge">Nouveau</span>
                        }
                        <TextField
                            id="search-field"
                            disabled={this.props.waiting}
                            className="textField"
                            floatingLabelText={this.props.showResult ? ' ' : "Recherchez un emploi ou un stage"}
                            multiLine={true}
                            rows={1}
                            hintText="Business Developper, Ingénieur Matériaux, Marketing..."
                            hintStyle={styles.hint}
                            fullWidth={true}
                            underlineStyle={this.props.showResult ? styles.underlineShowResult : styles.underline}
                            underlineFocusStyle={styles.underlineFocus}
                            underlineDisabledStyle={styles.underlineDisabled}
                            floatingLabelStyle={styles.floatingLabel}
                            floatingLabelFocusStyle={styles.floatingLabelFocus}
                            textareaStyle={styles.textarea}
                            onFocus={()=>this._handleFocus(true)}
                            onBlur={()=>this._handleFocus(false)}
                            onChange={this._onTextInput}
                            onKeyDown={this._handleTextFieldKeyDown}
                        />
                        {this.props.waiting &&
                            <LinearProgress mode="indeterminate" className={"waitingIndicator" + (this.props.showResult ? ' allWidth' : '')} color={greenA200}/>
                        }
                        <div>
                            {this.props.showResult ? (
                                <IconButton tooltip="Rechercher">
                                    {this.props.needRefresh ? (
                                        <ActionRefresh color={'white'} onClick={this.props.onSendClick}/>
                                    ) : (
                                        <ActionSearch color={'white'} onClick={this.props.onSendClick}/>
                                    )}
                                </IconButton>
                            ) : (
                                <div>
                                    <FilterBar open={this.state.openFilter && !this.props.waiting} handleClose={this._toggleFilterBar} mode="searchScreen" light={!this.state.active} handleChange={this.props.handleFilterChange}/>
                                    <RaisedButton disabled={this.props.waiting} label="Filtres..." className={"visible-xs-inline-block accentButton" + ((!this.state.openFilter) ? " visible":"")} onClick={this._toggleFilterBar}/>
                                    <RaisedButton disabled={this.props.waiting} label="Envoyer" className="accentButton" onClick={this.props.onSendClick}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}