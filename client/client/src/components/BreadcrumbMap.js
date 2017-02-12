import _ from 'lodash';
import React from 'react';
import { GoogleMap, Marker, withGoogleMap, InfoWindow } from 'react-google-maps';
import AddLocationDialog from './AddLocationDialog';
import canUseDOM from "can-use-dom";
import raf from "raf";

const geolocation = (
  canUseDOM && navigator.geolocation ?
  navigator.geolocation : 
  ({
    getCurrentPosition(success, failure) {
      failure(`Your browser doesn't support geolocation.`);
    },
  })
);

const ShowMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={17}
    defaultCenter={{ lat: -37.783591, lng: 122.408949 }}
    center={props.center}
    onClick={props.onMapClick}>
    {props.markers.map((marker, index) => (
      <Marker key={index}
        onClick={() => props.onMarkerClick(marker)}
        {...marker}>
        {marker.showInfo && 
          (<InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>
              <h5>{marker.username+':'}</h5>
              <p>{marker.message}</p>
            </div>
          </InfoWindow>)}
      </Marker>
    ))}
  </GoogleMap>
));

export default class BreadcrumbMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: null,
      content: null,
      radius: 6000,
    };
  }

  isUnmounted = false;

  componentDidMount() {
    const tick = () => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({ radius: Math.max(this.state.radius - 20, 0) });

      if (this.state.radius > 200) {
        raf(tick);
      }
    };
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: `Location found using HTML5.`,
      });

      raf(tick);
    }, (reason) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: 60,
          lng: 105,
        },
        content: `Error: The Geolocation service failed (${reason}).`,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleMapLoad(map) {
    this.mapComponent = map;
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
          center={this.state.center}
          onMapLoad={this.handleMapLoad.bind(this)}
          onMapClick={ this.props.onMapClick }
          markers={ this.props.locations }
          currentLocation={ this.props.currentLocation }
          onMarkerClose={ this.props.onMarkerClose }
          onMarkerClick={ this.props.onMarkerClick }
        />
        <AddLocationDialog
          open={ this.props.openDialog }
          onClose={ this.props.onMessageCancel }
          onSubmit={ this.props.onMessageSubmit } />
      </div>
    );
  }
}

const T = React.PropTypes;
Map.propTypes = {
  currentLocation: T.object,
  locations: T.array
};