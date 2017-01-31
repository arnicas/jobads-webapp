import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {grey600} from 'material-ui/styles/colors';

// helpers
import post from '../helpers/post';

const styles = {
    underline: {
        borderBottom: "2px solid",
        borderColor: "white"
    },
    underlineFocus: {
        borderBottom: "2px solid",
        borderColor: "black"
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
            newValue: ""
        };
    }

    _handleFocus = (isFocused) => {
        this.setState({active: isFocused});
    }

    _onTextInput = (event, newValue) => {
        this.setState({value: newValue});
    }

    _onSendClick = () => {
        post('/api/text-query', {text: this.state.value}).then((res)=>{
            return
        }).catch((err)=>{
            console.log(err);
        });
    }

    render () {
        return (
            <div className={"searchContainer" + ((this.state.active) ? " active" : "")}>
                <div className="searchFieldContainer" id="searchFieldContainer">
                    <span className="badge">Nouveau</span>
                    <TextField
                        className="textField"
                        floatingLabelText="Tapez votre requête"
                        multiLine={true}
                        rows={2}
                        fullWidth={true}
                        underlineStyle={styles.underline}
                        underlineFocusStyle={styles.underlineFocus}
                        floatingLabelStyle={styles.floatingLabel}
                        floatingLabelFocusStyle={styles.floatingLabelFocus}
                        textareaStyle={styles.textarea}
                        onFocus={()=>this._handleFocus(true)}
                        onBlur={()=>this._handleFocus(false)}
                        onChange={this._onTextInput}
                    />
                    <div>
                        <RaisedButton label="Envoyer" className="accentButton" onClick={this._onSendClick}/>
                    </div>
                </div>
            </div>
        );
    }
}