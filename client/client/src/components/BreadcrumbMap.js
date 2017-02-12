import _ from 'lodash';
import React from 'react';
import { GoogleMap, Marker, withGoogleMap, InfoWindow } from 'react-google-maps';
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