import React from 'react';
import Paper from 'material-ui/Paper';
import SkillsList from './SkillsList';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {grey900, greenA400} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';

const styles = {
    hint : {
        fontSize: 12,
    },
    underlineFocus : {
        borderColor: greenA400,
    }
};

export default class SkillsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open : false,
            openDeletedPopover : false,
            skillsOwned : [{key:"a", label:"testOwn1", origin: "owned"}, {key:"b", label:"testOwn2", origin: "owned"}],
            skillsDismissed: [{key:"c", label:"testDis1", origin: "owned"}, {key:"d", label:"testDis2", origin: "added"}],
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

    _handleRequestCloseDeletedPopover = () => {
        this.setState({
            openDeletedPopover: false,
        });
    };

    __handleRequestSkillsOwnedDelete = (key) => {
        this.skillsOwned = this.state.skillsOwned;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsOwned.map((skill) => skill.key).indexOf(key);
        this.skillsDismissed.push(this.skillsOwned.splice(skillToDelete, 1)[0]);
        this.setState({skillsOwned: this.skillsOwned, skillsDismissed: this.skillsDismissed});
    }

    __handleRequestSkillsDismissedDelete = (key) => {
        this.skillsOwned = this.state.skillsOwned;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsDismissed.map((skill) => skill.key).indexOf(key);
        this.skillsOwned.push(this.skillsDismissed.splice(skillToDelete, 1)[0]);
        this.setState({skillsOwned: this.skillsOwned, skillsDismissed: this.skillsDismissed});
        if (this.skillsDismissed.length == 0) this.setState({openDeletedPopover: false});
    }

    __handleRequestSkillsSuggestedDelete = (key) => {
        this.skillsSuggested = this.state.skillsSuggested;
        this.skillsDismissed = this.state.skillsDismissed;
        const skillToDelete = this.skillsSuggested.map((skill) => skill.key).indexOf(key);
        this.skillsDismissed.push(this.skillsSuggested.splice(skillToDelete, 1)[0]);
        this.setState({skillsSuggested: this.skillsSuggested, skillsDismissed: this.skillsDismissed});
    }

    __handleRequestSkillsSuggestedAdd = (key) => {
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
    
    handleChange = (event) => {
        this.setState({
            addSkillField: event.target.value,
        });
    };

    render () {
        return (
            <div className={"skillsPanel"+ (this.props.open ? " open ": " hidden ")+this.props.mode}>
                <Paper zDepth={(this.props.mode == "list") ? 1 : 2} className="skillsPaper">
                    <div className="skillsPanelBar">
                        <h3>Filtre par compétences</h3>
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
                    <h4>Compétences privilégiées dans la recherche</h4>
                    <SkillsList skills={this.state.skillsOwned} handleRequestDelete={this.__handleRequestSkillsOwnedDelete}/>
                     
                    <TextField
                    hintText="Ajouter une compétence à la recherche"
                    hintStyle={styles.hint}
                    underlineFocusStyle={styles.underlineFocus}
                    onKeyDown={this._handleTextFieldKeyDown}
                    onChange={this.handleChange}
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
                        <SkillsList skills={this.state.skillsDismissed} handleRequestDelete={this.__handleRequestSkillsDismissedDelete} trash/>
                    </Popover>
                    {this.state.skillsSuggested.length>0 &&
                        <h4>Suggestions de compétences d'après les résultats de recherche</h4>
                    }
                    <SkillsList skills={this.state.skillsSuggested} handleRequestDelete={this.__handleRequestSkillsSuggestedDelete} suggestions handleRequestAdd={this.__handleRequestSkillsSuggestedAdd}/>
                    
                </Paper>
            </div>
        );
    }
}