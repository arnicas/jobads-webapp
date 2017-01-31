import React from 'react';
import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionUpload from 'material-ui/svg-icons/action/backup';
import ActionDoc from 'material-ui/svg-icons/action/description';
import DropZone from 'react-dropzone';
import {greenA100} from 'material-ui/styles/colors';
import {onDrop} from './index';
import InfoPopover from '../system/InfoPopover';
import { handleChangeLocation } from '../container/Menu';

// Helper
import formatOctet from '../helpers/formatOctet';

const style = {
    icon : {
        width : "10vw",
        height : "10vw"
    },
    activeDropZone : {
        background: greenA100
    }
}

export default class DropFileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorFile: false,
        }
    }

    _onOpenClick = () => {
        this.dropzone.open();
    }

    _onSendTextClick = () => {
        handleChangeLocation('rechercher');
    }

    _emptyFile = () => {
        onDrop([],[]);
    }

    _handleRequestCloseError = () => {
        this.setState({
            errorFile: false,
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            errorFile: nextProps.error,
        });
    }

    render() {
        let dragAndDrop = null;
        let text = null;
        if (this.props.hasFile) {
            dragAndDrop = (
                <DropZone className="dragAndDropArea active hidden-xs" disableClick={true}>
                    <ActionDoc style={style.icon}/>
                </DropZone>
            );
            text = (
                <div className="analyseTextContainer active">
                    <h2>L'analyse est terminée</h2>
                    <span>{"Fichier analysé : " + this.props.filename + " (" + formatOctet(this.props.size) + ")" }</span>
                    <div>
                        <FlatButton label="Choisir un autre fichier" className="flatButton" onClick={this._emptyFile}/>
                    </div>
                </div>
            );
        } else {
            dragAndDrop = (
                <DropZone ref={(node) => { this.dropzone = node; }} onDrop={onDrop} multiple={false} accept="application/pdf" activeStyle={style.activeDropZone} className="dragAndDropArea hidden-xs" maxSize={2000000}>
                    <ActionUpload style={style.icon}/>
                    <span>Déposez ici votre CV</span>
                </DropZone>
            );
            text = (
                <div className="analyseTextContainer" id="analyseTextContainer">
                    <span className="badge">Nouveau</span>
                    <h2>Quelles sont les offres auxquelles votre CV répond le mieux ?</h2>
                    <span>L'outil scanne votre CV et identifie les mots-clés à grande valeur lors d'une recherche d'emploi.</span>
                    <div>
                        <RaisedButton label="Télécharger mon CV" className="accentButton" onClick={this._onOpenClick}/>
                        <FlatButton label="Envoyer un texte" className="flatButton" onClick={this._onSendTextClick}/>
                    </div>
                </div>
            );
        };


        return(
            <div className={"analyseContainer"+((this.props.hasFile) ? " active" : "")}>
                {text}
                <InfoPopover
                open={this.state.errorFile}
                anchorEl={document.getElementById('analyseTextContainer')}
                onRequestClose={this._handleRequestCloseError}
                >
                    <span>Votre CV doit être au format PDF et ne peut dépasser 2Mo.</span>
                </InfoPopover>
                <div className="analyseDragAndDropContainer">
                    <Paper zDepth={1}>
                        {dragAndDrop}
                    </Paper>
                </div>
            </div>
        );
    }
}