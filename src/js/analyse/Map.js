import React from 'react';
import GoogleMap from 'google-map-react';
import supercluster from 'points-cluster';
import Paper from 'material-ui/Paper';
import MapsPlace from 'material-ui/svg-icons/maps/place';

// API key
import {GoogleMapsAPIkey} from '../../config/keys';

const Marker = React.createClass({
    render: () => {
    return <MapsPlace className="mapMarker"></MapsPlace>;
  }});

class Cluster extends React.Component {
    render(){
        return <Paper zDepth={1} className="mapCluster"><span>{this.props.numPoints}</span></Paper>;
    }
}

export default class Map extends React.Component {

    static defaultProps = {
        center: {lat: 46.5749581, lng: 2.6030455},
        zoom: 5
    };

    constructor(props){
        super(props);
        this.state = {
            heatMapMode: true,
            supercluster: undefined,
            nw: {lat: 0, lng: 0},
            se: {lat: 0, lng: 0},
            zoom: 5,
            clusters: []
        }
    }
    
    componentWillMount() {
        const cl = supercluster(this.props.markers);
        this.setState({
            supercluster: cl
        });
    }

    _createMarkers = () => {
        const clusters = this.state.supercluster({ bounds: { nw: this.state.nw, se: this.state.se}, zoom: this.state.zoom });
        console.log(clusters);
        return (clusters.map((cluster, index)=>{
            if (cluster.numPoints > 1) {
                return (<Cluster key={index} lat={cluster.wy} lng={cluster.wx} numPoints={cluster.numPoints} />);
            } else {
                return (<Marker key={index} lat={cluster.wy} lng={cluster.wx} />);
            }
        }));
    }


    componentWillReceiveProps(nextProps) {

    }

    _onMapChange = ( obj ) => {
        this.setState({
            nw: obj.bounds.nw,
            se: obj.bounds.se,
            zoom: obj.zoom
        });
    }

    render() {
        return (
            <GoogleMap
                bootstrapURLKeys={{key: GoogleMapsAPIkey, libraries: 'visualization',language: 'fr'}}
                yesIWantToUseGoogleMapApiInternals
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                onGoogleApiLoaded={({map, maps}) => {
                    const heatmap = new maps.visualization.HeatmapLayer({
                        data: this.props.markers.map(point => (
                        {location: new maps.LatLng(point.lat, point.lng),
                        weight: point.weight}))
                    });
                    heatmap.setMap(map);
                }}
                onChange={this._onMapChange}
                >
                {this._createMarkers()}
            </GoogleMap>
        );
    }
}