import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import {greenA400} from 'material-ui/styles/colors';
import DetailPanel from './DetailPanel';

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
        this._handleInfiniteLoad(true);
        setTimeout(this._setContainerHeight,300);
    }

    _setContainerHeight = () => {
        this.setState({containerHeight: document.getElementById('mapPanelPaper').offsetHeight});
    }

    _buildElements = (start, end) => {
        let elements = [];
        for (var i = start; i < end; i++) {
            let id = this.props.selectedIds[i];
            elements.push(
                <ListItem
                key={id}
                primaryText={<h3>Company</h3>}
                secondaryText={<h4>{"Job Title " +id}</h4>}
                onClick={()=>this.setState({selectedId:id})}
                />
            );
        }
        return elements;
    }

    _handleInfiniteLoad = (reset = false) => {
        if (reset || this.state.elements.length < this.props.selectedIds.length) {
            this.setState({
                isInfiniteLoading: true,
            });
            setTimeout(() => {
                let elemLength = reset ? 0 : this.state.elements.length,
                    newElements = this._buildElements(elemLength, Math.min(elemLength + 20, this.props.selectedIds.length));
                console.log(elemLength, Math.min(elemLength + 20, this.props.selectedIds.length));
                this.setState({
                    isInfiniteLoading: false,
                    elements: reset ? newElements : this.state.elements.concat(newElements)
                });
            }, 2000);
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
            </div>
        );
    }
}