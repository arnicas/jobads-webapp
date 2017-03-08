import React from 'react';
import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';

export default class DetailPanel extends React.Component {

    render() {
        return(
            <div className="detailPanel">
                <AppBar
                    className="appBar"
                    title="Title"
                    iconElementLeft={<IconButton onClick={this.props.onClick}><NavigationClose /></IconButton>}
                />

            </div>
        );
    }
}