import React from 'react';
import GoogleMap from 'google-map-react';
import supercluster from 'points-cluster';
import MapsPlaceIcon from '../components/MapsPlaceIcon';
import MapsClusterIcon from '../components/MapsClusterIcon';
import FilterLayer from '../components/filters/FilterLayer';
import InfoMapsBox from '../components/InfoMapsBox';

// API key
import {GoogleMapsAPIkey} from '../../config/keys';

// Helpers
import getDistanceFromLatLonInKm from '../helpers/getDistanceFromLatLonInKm';

const Marker = React.createClass({
    render: () => {
    return <MapsPlaceIcon className="mapMarker"></MapsPlaceIcon>;
  }});

class Cluster extends React.Component {
    render(){
        return <div className="mapCluster"><MapsClusterIcon></MapsClusterIcon><span>{this.props.numPoints}</span></div>;
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
            clusters: [],
            filteringCode: props.mapFiltering ? 0 : -1,
            filterCenter:{lat: 0, lng: 0},
            filterRadius: {px:0, km:0},
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
        return (clusters.map((cluster, index)=>{
            if (cluster.numPoints > 1) {
                return (<Cluster key={index} lat={cluster.wy} lng={cluster.wx} numPoints={cluster.numPoints} />);
            } else {
                return (<Marker key={index} lat={cluster.wy} lng={cluster.wx} />);
            }
        }));
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.mapFiltering) {
            this.setState({filteringCode:0});
        }
    }

    _onMapChange = ( obj ) => {
        this.setState({
            nw: obj.bounds.nw,
            se: obj.bounds.se,
            zoom: obj.zoom
        });
    }

    _onClick = ({x, y, lat, lng, event}) => {
        switch(this.state.filteringCode) {
            case(0):
                this.setState({filteringCode:1, filterCenter:{lat: lat, lng: lng}});
                break;
            case(1):
                this.setState({filteringCode:2});
                break;
            case(2):
                this.setState({filteringCode:0, filterRadius:{px: 0, km:0}});
                break;
        };
    };

    _distanceToMouse = (objectPos,mousePos,objectProps) => {
        if (objectProps.filter && this.state.filteringCode == 1) {
            let radiusPx = Math.sqrt(Math.pow(objectPos.x-mousePos.x,2)+Math.pow(objectPos.y-mousePos.y,2));
            let radiusKm = getDistanceFromLatLonInKm(objectPos.lat,objectPos.lng,mousePos.lat,mousePos.lng);
            this.setState({filterRadius:{px: radiusPx, km:radiusKm}});
        }
    };

    _restartFilter = () => {
        this.setState({filteringCode:0, filterRadius:{px: 0, km:0}});
    }

    _cancelFilter = () => {
        this.setState({filteringCode:-1, filterRadius:{px: 0, km:0}});
        this.props.handleFilteringResult();
    }

    _okFilter = () => {
        this.props.handleFilteringResult(this.state.filterCenter, this.state.filterRadius.km);
        this.setState({filteringCode:-1, filterRadius:{px: 0, km:0}});
    }

    render() {
        return (
            <div>
                <GoogleMap
                    bootstrapURLKeys={{key: GoogleMapsAPIkey, libraries: 'visualization',language: 'fr'}}
                    yesIWantToUseGoogleMapApiInternals
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    onGoogleApiLoaded={({map, maps}) => {
                        const styleMap = [
                            {
                                featureType: "all",
                                stylers: [
                                { saturation: -80 }
                                ]
                            },{
                                featureType: "road.arterial",
                                elementType: "geometry",
                                stylers: [
                                { hue: "#00ffee" },
                                { saturation: 50 }
                                ]
                            }
                        ];
                        const heatmap = new maps.visualization.HeatmapLayer({
                            data: this.props.markers.map(point => (
                            {location: new maps.LatLng(point.lat, point.lng),
                            weight: point.weight}))
                        });
                        heatmap.setMap(map);
                        map.setOptions({styles: styleMap});
                    }}
                    onChange={this._onMapChange}
                    distanceToMouse={this._distanceToMouse}
                    onClick={this._onClick}
                    >
                    {this._createMarkers()}
                    {this.state.filteringCode > 0 &&
                        <FilterLayer
                            lat={this.state.filterCenter.lat}
                            lng={this.state.filterCenter.lng}
                            filter={true}
                            radius={this.state.filterRadius.px}
                            radiusKm={this.state.filterRadius.km}
                            open={this.state.filteringCode == 2}
                            restartFilter={this._restartFilter}
                            okFilter={this._okFilter}
                        />
                    }
                </GoogleMap>
                {this.state.filteringCode == 0 && 
                    <InfoMapsBox label="Cliquez pour définir le centre du filtre" onClick={this._cancelFilter}/>
                }
                {this.state.filteringCode == 1 && 
                    <InfoMapsBox label="Cliquez pour définir le rayon de recherche" onClick={this._cancelFilter}/>
                }
            </div>
        );
    }
}