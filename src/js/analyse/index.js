import React from 'react';
import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ActionUpload from 'material-ui/svg-icons/action/backup';
import DropZone from 'react-dropzone';
import {greenA100} from 'material-ui/styles/colors';

const style = {
    button : {
        marginTop: 20,
        color: '#FFFFFF',
        border: '1px solid white'
    },
    icon : {
        width : "10vw",
        height : "10vw"
    },
    activeDropZone : {
        background: greenA100
    }
}

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file : []
        };
    }

    _onDrop = (acceptedFiles, rejectedFiles) => {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      this.setState({
        file: acceptedFiles
      });
    }

    _onOpenClick = () => {
        this.dropzone.open();
    }

    render() {
        return(
            <div className="analyseContainer">
                <div className="analyseTextContainer">
                    <span className="badge">Nouveau</span>
                    <h2>Quelles sont les offres auxquelles votre CV répond le mieux ?</h2>
                    <span>L'outil scanne votre CV et identifie les mots-clés à grande valeur lors d'une recherche d'emploi.</span>
                    <FlatButton label="Télécharger mon CV" style={style.button} onClick={this._onOpenClick}/>
                </div>
                <div className="analyseDragAndDropContainer">
                    <Paper className="test" zDepth={1}>
                        <DropZone ref={(node) => { this.dropzone = node; }} onDrop={this._onDrop} multiple={false} accept="image/*" activeStyle={style.activeDropZone} className="dragAndDropArea">
                            <ActionUpload style={style.icon}/>
                            <span>Déposez ici votre CV</span>
                        </DropZone>
                    </Paper>
                </div>
            </div>
        );
    }

}