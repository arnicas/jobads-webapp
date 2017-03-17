import React from 'react';
import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import LocationIcon from 'material-ui/svg-icons/maps/place';
import CalendarIcon from 'material-ui/svg-icons/action/today';

// Helpers
import formatDate from '../../../helpers/formatDate';

// Helpers
import get from '../../../helpers/get';

export default class DetailPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            waiting: true,
            error: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectedId !== -1) {

        this.setState({waiting: true});
            get('/api/ja/get/'+nextProps.selectedId).then((response)=>{
                if(response.status == 200) {
                    this.setState({waiting: false, info:response.res.results[0], error: 0});
                } else {
                    this.setState({waiting: false, error: response.status});
                }
            }).catch((err)=>{
                console.log(err);
                this.setState({waiting: false, error: err});
            });
        }
    }

    render() {
        return(
            <div className="detailPanel">
                <AppBar
                    className="appBar"
                    title={
                        <div>
                            <h3>{this.state.waiting ? "Chargement..." : this.state.info.company}</h3>
                            <h4 style={{fontSize: 14, lineHeight: '16px', height: 16, margin:' 4px 0px 0px', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{!this.state.waiting && this.state.info.title_fr}</h4>
                        </div>
                    }
                    iconElementLeft={<IconButton onClick={this.props.onClick}><NavigationClose /></IconButton>}
                />
                {!this.state.waiting &&
                    <div style={{overflowY: "auto", flex: "1 1 0%"}}>
                        <div className="info_">
                            <LocationIcon/>
                            <span>{this.state.info.location}</span>
                            <CalendarIcon/>
                            <span>{"Publié le "+formatDate(this.state.info.date)}</span>
                        </div>
                        <p>{this.state.info.description_fr}</p>
                    </div>
                }

                {this.state.waiting &&
                    <LinearProgress mode="indeterminate"/>
                }
                {this.state.error !== 0 &&
                    <Snackbar
                        open={true}
                        message={"Une erreur est survenue ("+this.state.error+")"}
                        autoHideDuration={4000}
                    />
                }
            </div>
        );
    }
}