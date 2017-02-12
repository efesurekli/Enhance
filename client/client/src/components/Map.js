import _ from 'lodash';
import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

const ShowMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={14}
    defaultCenter={{ lat: -37.783591, lng: 122.408949 }}
    center={{
      lat: Number(props.currentLocation.latitude),
      lng: Number(props.currentLocation.longitude)
    }}>
    {props.markers.map((marker, index) => (
      <Marker key={index}
        {...marker}
      />
    ))}
  </GoogleMap>
));

export default class Map extends React.Component {
  handleMapLoad(map) {
    this.mapComponent = map;
  }

  getMarkers() {
    const coordinates = this.props.locations.map((location) => {
      const marker = {
        position: {
          lat: Number(location.lat),
          lng: Number(location.lng)
        },
        defaultAnimation: 2
      };
      return marker;
    });
    return coordinates;
  }

  render() {
    const markers = this.getMarkers();
    return (
      <div style={{ height: '100%' }}>
        <ShowMap
          containerElement={
            <div className="map" style={{ width: '100%', height: '100%' }} />
          }
          mapElement={
            <div style={{ height: '100%' }} />
          }
          onMapLoad={this.handleMapLoad.bind(this)}
          markers={markers}
          currentLocation={this.props.currentLocation}
        />
      </div>
    );
  }
}

const T = React.PropTypes;
Map.propTypes = {
  currentLocation: T.object,
  locations: T.array
};