import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Map from './Map';
// import { postFixture } from '../fixtures/index.js';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  } 
  render() {
    // Render default dummy post
    const latitude = 37.783591;
    const longitude = -122.408949;
    return (
      <div className='stretch'>
          <AppBar
            title={<span style={{}}>Breadcrumbs</span>}
            onTitleTouchTap={() => alert('hi')}
            iconElementRight={<FlatButton label="Save" />}
          />
          {/*<h1>test</h1>*/}
          <div className='stretch'>
            <Map
            locations={Array(50).fill(0).map(_ => ({
              lat: latitude + (Math.random() / 20) - 0.03,
              lng: longitude + (Math.random() / 20) - 0.03
            }))}
            currentLocation={{
              longitude,
              latitude,
              locationGiven: true,
              zipcode: ''
            }} />
          </div>
          
      </div>
    );
  }
};

export default HomePage;