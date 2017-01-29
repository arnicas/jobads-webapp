import React from 'react';
import Popover from 'material-ui/Popover/Popover'
import AlertWarning from 'material-ui/svg-icons/alert/warning';

export default class InfoPopover extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Popover {...this.props} className="infoPopover">
                <AlertWarning className="alertWarning"/>
                {this.props.children}
            </Popover>
        );
    }
}