import _ from 'lodash';
import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import AddLocationDialog from './AddLocationDialog';

const ShowMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={17}
    defaultCenter={{ lat: -37.783591, lng: 122.408949 }}
    center={{
      lat: Number(props.currentLocation.latitude),
      lng: Number(props.currentLocation.longitude)
    }}
    onClick={props.onMapClick}>
    {props.markers.map((marker, index) => (
      <Marker key={index}
        {...marker}
      />
    ))}
  </GoogleMap>
));

export default class BreadcrumbMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: this.initMarkers(),
      messageInputOpen: false
    }
  }

  handleMapLoad(map) {
    this.mapComponent = map;
  }

  initMarkers() {
    const markers = this.props.locations.map((location) => {
      const marker = {
        position: {
          lat: Number(location.lat),
          lng: Number(location.lng)
        },
        defaultAnimation: 2
      };
      return marker;
    });
    return markers;
  }

  handleMapClick(event) {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];

    this.setState({ markers: nextMarkers, messageInputOpen: true });

    if (nextMarkers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMessageCancel() {
    let markers = this.state.markers.map(x => x);
    markers.pop();
    this.setState({ messageInputOpen: false, markers });
  }

  handleMessageSubmit(message, recipientIDs = []) {
    const userID = 0; // TODO get real user ID
    // TODO axios requests
    console.log('Submitting location message: ' + message);
    this.setState({ messageInputOpen: false });
  }

  render() {
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
          onMapClick={this.handleMapClick.bind(this)}
          markers={this.state.markers}
          currentLocation={this.props.currentLocation}
        />
        <AddLocationDialog
          open={this.state.messageInputOpen}
          onClose={this.handleMessageCancel.bind(this)}
          onSubmit={this.handleMessageSubmit.bind(this)} />
      </div>
    );
  }
}

const T = React.PropTypes;
Map.propTypes = {
  currentLocation: T.object,
  locations: T.array
};