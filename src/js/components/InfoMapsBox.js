import React from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

export default class InfoMapsBox extends React.Component {
    render() {
        return (
            <Paper className="info" zDepth={1}>
                <div>
                    <span>{this.props.label}</span>
                </div>
                <FlatButton label="Annuler" onClick={this.props.onClick} />
            </Paper>
        );
    }
}