import React from 'react';
import Paper from 'material-ui/Paper';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {grey900, greenA400, greenA100, greenA200} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import DropZone from 'react-dropzone';
import ActionUpload from 'material-ui/svg-icons/action/backup';
import CircularProgress from 'material-ui/CircularProgress';
import ActionDoc from 'material-ui/svg-icons/action/description';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import FlatButton from 'material-ui/FlatButton';

// App
import SkillsList from './SkillsList';

// Helper
import formatOctet from '../../../helpers/formatOctet';
import postSingleFile from '../../../helpers/postSingleFile';

const styles = {
    hint : {
        fontSize: 12,
    },
    underlineFocus : {
        borderColor: greenA400,
    },
    icon : {
        width : 48,
        height : 48,
    },
    activeDropZone : {
        background: greenA100,
        border: "5px dashed "+greenA200,
        margin: -5,
        boxShadow: greenA100+" 0px 1px 6px, "+greenA100+" 0px 1px 4px",
    }
};

export default class SkillsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open : false,
            file : [],
            hasFile: false,
            error: false,
            waiting: false,
            openDeletedPopover : false,
            openDocPopover : false,
            skillsOwned : [{key:"a", label:"testOwn1", origin: "owned"}, {key:"b", label:"testOwn2", origin: "owned"}],
            skillsDismissed: [],
            skillsSuggested: [{key:"e", label:"testSug1", origin: "suggested"}, {key:"f", label:"testSug2", origin: "suggested"}],
            addSkillField : "",
        };
    }


    _handleTouchTapOnDeleteIcon = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openDeletedPopover: true,
            anchorEl: event.currentTarget,
        });
    };
    _handleTouchTapOnDocIcon = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openDocPopover: true,
            anchorEl: event.currentTarget,
        });
    };

    _handleRequestCloseDeletedPopover = () => {
        this.setState({
            openDeletedPopover: false,
        });
    };

    _handleRequestCloseDocPopover = () => {
        this.setState({
            openDocPopover: false,
        });
    };

    _handleRequestSkillsOwnedDelete = (key) => {
        this.skillsOwned = this.state.skillsOwned;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsOwned.map((skill) => skill.key).indexOf(key);
        this.skillsDismissed.push(this.skillsOwned.splice(skillToDelete, 1)[0]);
        this.setState({skillsOwned: this.skillsOwned, skillsDismissed: this.skillsDismissed});
    }

    _handleRequestSkillsDismissedDelete = (key) => {
        this.skillsOwned = this.state.skillsOwned;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsDismissed.map((skill) => skill.key).indexOf(key);
        this.skillsOwned.push(this.skillsDismissed.splice(skillToDelete, 1)[0]);
        this.setState({skillsOwned: this.skillsOwned, skillsDismissed: this.skillsDismissed});
        if (this.skillsDismissed.length == 0) this.setState({openDeletedPopover: false});
    }

    _handleRequestSkillsSuggestedDelete = (key) => {
        this.skillsSuggested = this.state.skillsSuggested;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsSuggested.map((skill) => skill.key).indexOf(key);
        this.skillsDismissed.push(this.skillsSuggested.splice(skillToDelete, 1)[0]);
        this.setState({skillsSuggested: this.skillsSuggested, skillsDismissed: this.skillsDismissed});
    }

    _handleRequestSkillsSuggestedAdd = (key) => {
        this.skillsSuggested = this.state.skillsSuggested;
        this.skillsOwned = this.state.skillsOwned;
        const skillToDelete = this.skillsSuggested.map((skill) => skill.key).indexOf(key);
        this.skillsOwned.push(this.skillsSuggested.splice(skillToDelete, 1)[0]);
        this.setState({skillsSuggested: this.skillsSuggested, skillsOwned: this.skillsOwned});
    }

    _handleAddCustomSkill = () => {
        let skillToAdd = {
            key:this.state.addSkillField.replace(/ /g,''),
            label:this.state.addSkillField,
            origin: "added"
        }
        if (skillToAdd.key.length == 0) {
            this.setState({addSkillField: ""});
            return;
        }
        this.skillsOwned = this.state.skillsOwned;
        this.skillsOwned.push(skillToAdd);
        this.setState({skillsOwned: this.skillsOwned, addSkillField: ""});
    }

    _handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this._handleAddCustomSkill();
                break;
        }
    }

    _handleDrop = (acceptedFiles, rejectedFiles) => {
        console.log('Accepted files: ', acceptedFiles);
        console.log('Rejected files: ', rejectedFiles);
        if (acceptedFiles.length == 1) {
            this.setState({
                file: acceptedFiles,
                hasFile: true,
                error: false,
                waiting: true,
            });
            postSingleFile('/api/cv-upload', acceptedFiles).then((response)=>{
                this.setState({waiting: false});
                console.log(response);
            })
            .catch((err)=>{
                console.log("Erreur :" + err);
            });
        } else if (rejectedFiles.length == 1){
            this.setState({
                file: [],
                hasFile: false,
                error: true,
            });
        } else {
            this.setState({
                file: [],
                hasFile: false,
                error: false,
            });
        }
    }

    _handleOpenDoc = () => {
        this.dropzone.open();
    }

    _handleDeleteAllOwned = () => {
        let originIsNotOwned = (skill) => {return (skill.origin !== "owned");};
        this.setState({skillsSuggested: this.state.skillsSuggested.filter(originIsNotOwned),
            skillsOwned: this.state.skillsOwned.filter(originIsNotOwned),
            skillsDismissed: this.state.skillsDismissed.filter(originIsNotOwned),
            openDocPopover:false});
    }
    
    _handleChange = (event) => {
        this.setState({
            addSkillField: event.target.value,
        });
    };

    _handleNewDoc = () => {
        this._handleDrop([],[]);
        this.setState({openDocPopover:false});
    }




    render () {
        let filename = (this.state.hasFile) ? this.state.file[0].name : "erreur";
        let size = (this.state.hasFile) ? this.state.file[0].size : "erreur";
        return (
            <div className={"skillsPanel"+ (this.props.open ? " open ": " hidden ")+this.props.mode}>
                <DropZone ref={(node) => { this.dropzone = node; }} onDrop={this._handleDrop} multiple={false} accept="application/pdf" activeStyle={styles.activeDropZone} className="dragAndDropArea" maxSize={2000000} disableClick={true}>
                    <Paper zDepth={(this.props.mode == "list") ? 1 : 2} className="skillsPaper">
                        {!this.state.hasFile && !this.state.waiting && !this.state.error &&
                            <div className="uploadContainer" onClick={this._handleOpenDoc}>
                                <ActionUpload style={styles.icon} className="uploadIcon"/>
                                <span>Téléchargez votre CV pour en extraire automatiquement les compétences y figurant</span>
                            </div>
                        }
                        {this.state.hasFile && this.state.waiting &&
                            <div className="uploadContainer">
                                <CircularProgress color="white" size={24} className="uploadIcon"/>
                                <span>Extraction...</span>
                            </div>
                        }
                        {!this.state.hasFile && this.state.error &&
                            <div className="uploadContainer error" onClick={this._handleOpenDoc}>
                                <AlertWarning style={styles.icon} className="uploadIcon"/>
                                <span>Votre CV doit être au format PDF et ne peut dépasser 2Mo.</span>
                            </div>
                        }
                        <div className="skillsPanelBar">
                            <h3>Filtre par compétences</h3>
                            <div>
                                {(this.state.hasFile && !this.state.waiting) &&
                                    <IconButton className="doc" tooltip={"Fichier analysé : " + filename + " (" + formatOctet(size) + ")" } tooltipPosition="bottom-left">
                                        <ActionDoc color={grey900} onTouchTap={this._handleTouchTapOnDocIcon}/>
                                    </IconButton>
                                }
                                { this.state.skillsDismissed.length>0 &&
                                    <Badge
                                    className="skillsBadge"
                                    badgeContent={this.state.skillsDismissed.length}
                                    secondary={true}
                                    badgeStyle={{top: -8, right: -8}}
                                    >
                                        <IconButton>
                                            <DeleteIcon color={grey900} onTouchTap={this._handleTouchTapOnDeleteIcon}/>
                                        </IconButton>
                                    </Badge>
                                }
                            </div>
                        </div>
                        <h4>Compétences privilégiées dans la recherche</h4>
                        <SkillsList skills={this.state.skillsOwned} handleRequestDelete={this._handleRequestSkillsOwnedDelete}/>
                        <TextField
                        hintText="Ajouter une compétence à la recherche"
                        hintStyle={styles.hint}
                        underlineFocusStyle={styles.underlineFocus}
                        onKeyDown={this._handleTextFieldKeyDown}
                        onChange={this._handleChange}
                        value={this.state.addSkillField}
                        />
                        {this.state.addSkillField.length > 0 &&
                            <IconButton onTouchTap={this._handleAddCustomSkill}>
                                <AddIcon color={greenA400}/>
                            </IconButton>
                        }
                        <Popover
                            open={this.state.openDeletedPopover}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'center'}}
                            targetOrigin={{horizontal: 'right', vertical: 'center'}}
                            onRequestClose={this._handleRequestCloseDeletedPopover}
                            animation={PopoverAnimationVertical}
                        >
                            <div className="skillsTrashTitle">Cliquer pour restaurer la compétence</div>
                            <SkillsList skills={this.state.skillsDismissed} handleRequestDelete={this._handleRequestSkillsDismissedDelete} trash/>
                        </Popover>
                        <Popover
                            open={this.state.openDocPopover}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'center'}}
                            targetOrigin={{horizontal: 'right', vertical: 'center'}}
                            onRequestClose={this._handleRequestCloseDocPopover}
                            animation={PopoverAnimationVertical}
                        >
                            <div className="skillsTrashTitle">{"Fichier analysé : " + filename + " (" + formatOctet(size) + ")" }</div>

                            <div><FlatButton label="Extraire des compétences d'un nouveau fichier" onClick={this._handleNewDoc}/></div>
                            <div><FlatButton label="Supprimer toutes les compétences extraites" onClick={this._handleDeleteAllOwned}/></div>
                        </Popover>
                        {this.state.skillsSuggested.length>0 &&
                            <h4>Suggestions de compétences d'après les résultats de recherche</h4>
                        }
                        <SkillsList skills={this.state.skillsSuggested} handleRequestDelete={this._handleRequestSkillsSuggestedDelete} suggestions handleRequestAdd={this._handleRequestSkillsSuggestedAdd}/>
                    </Paper>
                </DropZone>
            </div>
        );
    }
}