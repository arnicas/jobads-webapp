import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import {greenA400} from 'material-ui/styles/colors';
import DetailPanel from './DetailPanel';
import Snackbar from 'material-ui/Snackbar';

// Helpers
import post from '../../../helpers/post';
import arrayEquals from '../../../helpers/arrayEquals';

// Infinite
import Infinite from 'react-infinite';

export default class MapPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            containerHeight: 300,
            isInfiniteLoading: false,
            elements: [],
            selectedId: -1,
            error: 0,
        }
    }

    componentWillMount () {
        window.addEventListener("resize", this._setContainerHeight, false);
    }

    componentDidMount() {
        this.setState({containerHeight: document.getElementById('mapPanelPaper').offsetHeight});
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._setContainerHeight, false);
    }

    componentWillReceiveProps(nextProps) {
        if (!arrayEquals(this.props.selectedIds,nextProps.selectedIds)) {
            this._handleInfiniteLoad(true, nextProps);
            setTimeout(this._setContainerHeight,500);
        }
    }

    _setContainerHeight = () => {
        this.setState({containerHeight: document.getElementById('mapPanelPaper').offsetHeight});
    }

    _buildElements = (start, end, props) => {
        let ids = [];
        if (start == end) return false;
        for (var i = start; i < end; i++) {
            ids.push(props.selectedIds[i]);
        }
        return {ids};
    }

    _handleInfiniteLoad = (reset = false, nextProps = {}) => {
        let defaultProps = this.props;
        let props = Object.assign({},defaultProps,nextProps);
        if (reset || this.state.elements.length < props.selectedIds.length) {
            this.setState({
                isInfiniteLoading: true,
            });
            let elemLength = reset ? 0 : this.state.elements.length,
                newElementsIds = this._buildElements(elemLength, Math.min(elemLength + 20, props.selectedIds.length), props);
            if (newElementsIds) {
                post('/api/ja/get_basic_info', newElementsIds).then((response)=>{
                    if(response.status == 200) {
                        let rawListItems = response.res.results;
                        let newElements = [];
                        rawListItems.map((listItem)=>{
                            newElements.push(
                                <ListItem
                                key={listItem._id}
                                primaryText={<h3>{listItem.company}</h3>}
                                secondaryText={<h4>{listItem.title_fr}</h4>}
                                onClick={()=>this.setState({selectedId:listItem._id})}
                                />
                            );
                        });
                        this.setState({
                            isInfiniteLoading: false,
                            elements: reset ? newElements : this.state.elements.concat(newElements),
                            error: 0
                        });
                    } else {
                        this.setState({isInfiniteLoading: false, error: response.status});
                    }
                }).catch((err)=>{
                    console.log(err);
                    this.setState({isInfiniteLoading: false, error: err});
                });
            } else {
                this.setState({isInfiniteLoading: false});
            }
        }
    }

    render() {
        return (
            <div className={"mapPanel" + (this.props.selectedIds.length>0 ? " active":" hidden")}>
                <Paper zDepth={2} className={"mapPanelPaper" + (this.state.selectedId!=-1 ? " active":" ")} id="mapPanelPaper">
                    <List className="mapPanelList">
                        <Infinite
                        className="mapPanelInfinite"
                        containerHeight={this.state.containerHeight > 0 ? this.state.containerHeight : 300}
                        elementHeight={76}
                        infiniteLoadBeginEdgeOffset={200}
                        onInfiniteLoad={this._handleInfiniteLoad}
                        loadingSpinnerDelegate={this.state.isInfiniteLoading &&
                            <CircularProgress color={greenA400} className="loadingIndicator"/>
                        }
                        isInfiniteLoading={this.state.isInfiniteLoading}
                        >
                            {this.state.elements}
                        </Infinite>
                    </List>
                    <DetailPanel selectedId={-1} onClick={()=>this.setState({selectedId:-1})}/>
                </Paper>
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