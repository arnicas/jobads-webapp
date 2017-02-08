import React from 'react';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {greenA400} from 'material-ui/styles/colors';

export default class FilterLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
    }


    render() {
        return (
            <div className="filterMapsLayer" id="filterMapsLayer" style={{width: 2*this.props.radius,height: 2*this.props.radius}}>
                <div>
                    <span>{parseFloat(this.props.radiusKm).toFixed(1)}km</span>
                </div>
                <Popover
                    open={this.props.open}
                    anchorEl={document.getElementById('filterMapsLayer')}
                    anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                    targetOrigin={{horizontal: 'left', vertical: 'center'}}
                    onRequestClose={this.props.restartFilter}
                    className="filterMapsLayerPopover"
                >
                    <div className="modal">
                        <div><span>Valider le filtre ?</span></div>
                        <FlatButton label="Recommencer" onClick={this.props.restartFilter}/>
                        <RaisedButton label="OK" backgroundColor={greenA400} labelColor='white' onClick={this.props.okFilter}/>
                    </div>
                </Popover>
            </div>
        );
    }


}