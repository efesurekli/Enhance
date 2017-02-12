import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import BreadcrumbMap from './BreadcrumbMap';
import axios from 'axios';
// import { postFixture } from '../fixtures/index.js';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      messageInputOpen: false
    }
  } 

  componentWillMount() {
    const latitude = encodeURIComponent(37.783591);
    const longitude = encodeURIComponent(-122.408949);
    axios.get(`/messages/${latitude}/${longitude}`).then(response => {
      const locations = response.data.map(obj => {
        const loc = obj.location.coordinates;
        
        return {
          position: {
            lat: loc[0],
            lng: loc[1]
          },
          defaultAnimation: 2,
          message: obj.text,
          username: obj.username || ''
        }
      });
      
      this.setState({ locations });
    });
  }

  handleMapClick(event) {
    const locations = [
      ...this.state.locations,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(),
      },
    ];

    this.setState({ locations, messageInputOpen: true });
  }

  handleMessageCancel() {
    let locations = this.state.locations.map(x => x);
    locations.pop();
    this.setState({ locations, messageInputOpen: false });
  }

  handleMessageSubmit(message, recipientIDs = []) {
    const userID = 0; // TODO get real user ID
    // TODO axios requests
    const currLoc = this.state.locations[this.state.locations.length - 1].position;
    axios.post('/messages', {
      location: {
        latitude: currLoc.lat,
        longitude: currLoc.lng,
      },
      text: message,
      username: 'Efe'
    }).then(response => console.log(response))
    console.log('Submitting location message: ' + message);
    this.setState({ messageInputOpen: false });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      locations: this.state.locations.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      locations: this.state.locations.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true,
          };
        }
        return marker;
      }),
    });
  }

  render() {
    // Render default dummy post
    const latitude = 37.783591;
    const longitude = -122.408949;
    const dummyLoc = Array(50).fill(0).map(_ => ({
      lat: latitude + (Math.random() / 20) - 0.03,
      lng: longitude + (Math.random() / 20) - 0.03
    }));
    return (
      <div className='stretch'>
          <AppBar
            title={<span style={{}}>Breadcrumbs</span>}
            onTitleTouchTap={() => alert('hi')}
            iconElementRight={<FlatButton label="Save" />}
          />
          {/*<h1>test</h1>*/}
          <div className='stretch'>
            <BreadcrumbMap
            locations={ this.state.locations }
            currentLocation={{
              longitude,
              latitude,
              locationGiven: true,
              zipcode: ''
            }}
            onMapClick={ this.handleMapClick.bind(this) }
            onMessageCancel={ this.handleMessageCancel.bind(this) }
            onMessageSubmit={ this.handleMessageSubmit.bind(this) }
            openDialog={this.state.messageInputOpen}
            onMarkerClick={this.handleMarkerClick.bind(this)}
            onMarkerClose={this.handleMarkerClose.bind(this)} />
          </div>
      </div>
    );
  }
};

export default HomePage;