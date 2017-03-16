import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentLocation from 'material-ui/svg-icons/maps/my-location';
import ContentDisableLocation from 'material-ui/svg-icons/device/location-disabled';
import {greenA400, amberA200} from 'material-ui/styles/colors';

const style = {
    ok : {
        position: 'absolute',
        bottom: '33px',
        right: '55px'
    },
    cancel: {
        position: 'absolute',
        bottom: '33px',
        right: '108px'
    },
};

export default class FilterButton extends React.Component {
    render() {
        return (
            <FloatingActionButton mini={true} style={this.props.cancel ? style.cancel : style.ok} onClick={this.props.onClick}
            backgroundColor={this.props.cancel ? amberA200 : greenA400}>
                {this.props.cancel ? (
                    <ContentDisableLocation />
                ):(
                    <ContentLocation />
                )}
            </FloatingActionButton>
        );
    }
}