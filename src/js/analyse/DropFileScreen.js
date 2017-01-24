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
    }

    _onOpenClick = () => {
        this.dropzone.open();
    }

    render() {
        let dragAndDrop = null;
        let text = null;
        if (this.props.hasFile) {
            dragAndDrop = (
                <DropZone className="dragAndDropArea active" disableClick={true}>
                    <ActionDoc style={style.icon}/>
                </DropZone>
            );
            text = (
                <div className="analyseTextContainer active">
                    <h2>L'analyse est terminée</h2>
                    <span>{"Fichier analysé : " + this.props.filename + " (" + formatOctet(this.props.size) + ")" }</span>
                    <div>
                        <FlatButton label="Choisir un autre fichier" className="flatButton" onClick={()=>{alert("Fonction indisponible")}}/>
                    </div>
                </div>
            );
        } else {
            dragAndDrop = (
                <DropZone ref={(node) => { this.dropzone = node; }} onDrop={onDrop} multiple={false} accept="image/*" activeStyle={style.activeDropZone} className="dragAndDropArea">
                    <ActionUpload style={style.icon}/>
                    <span>Déposez ici votre CV</span>
                </DropZone>
            );
            text = (
                <div className="analyseTextContainer">
                    <span className="badge">Nouveau</span>
                    <h2>Quelles sont les offres auxquelles votre CV répond le mieux ?</h2>
                    <span>L'outil scanne votre CV et identifie les mots-clés à grande valeur lors d'une recherche d'emploi.</span>
                    <div>
                        <RaisedButton label="Télécharger mon CV" className="accentButton" onClick={this._onOpenClick}/>
                        <FlatButton label="Envoyer un texte" className="flatButton" onClick={()=>{alert("Fonction indisponible")}}/>
                    </div>
                </div>
            );
        };


        return(
            <div className={"analyseContainer"+((this.props.hasFile) ? " active" : "")}>
                {text}
                <div className="analyseDragAndDropContainer">
                    <Paper zDepth={1}>
                        {dragAndDrop}
                    </Paper>
                </div>
            </div>
        );
    }
}