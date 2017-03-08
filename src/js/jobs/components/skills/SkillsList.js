import React from 'react';
import Chip from 'material-ui/Chip';
import RestoreIcon from 'material-ui/svg-icons/action/cached';
import AddIcon from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';

export default class SkillsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _renderChip(data) {
        let className = "skillChip";
        switch(data.origin) {
            case "owned":
                className += " owned";
                break;
            case "suggested":
                className += " suggested";
                break;
            case "added":
                className += " added";
                break;
        }
        if (this.props.trash) {
            return (
                <Chip
                    key={data.key}
                    onTouchTap={() => this.props.handleRequestDelete(data.key)}
                    className={className}
                >
                    <Avatar icon={<RestoreIcon />} />
                    {data.label}
                </Chip>
            );
        } else if (this.props.suggestions) {
            return (
                <Chip
                    key={data.key}
                    onTouchTap={() => this.props.handleRequestAdd(data.key)}
                    onRequestDelete={() => this.props.handleRequestDelete(data.key)}
                    className={className}
                >
                    <Avatar icon={<AddIcon />} />
                    {data.label}
                </Chip>
            );
        } else {
            return (
                <Chip
                    key={data.key}
                    onRequestDelete={() => this.props.handleRequestDelete(data.key)}
                    className={className}
                >
                    {data.label}
                </Chip>
            );
        }
    }

    render () {
        return (
            <div className="skillsList">
                {this.props.skills.map(this._renderChip, this)}
            </div>
        )
    }
}