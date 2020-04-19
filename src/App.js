import React from 'react';
import './App.css';
import cities from './data/full_data-1.json'
import InfoWindow from './InfoWindow'
import Map from './map'
import { render } from 'react-dom';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      casesByCity: {},
      dataLoaded: false,
    }
  }
  componentDidMount() {
    fetch("https://api.covid19india.org/raw_data.json").then(res => {
      if (res.ok) {
        return res.json()
      }
    }).catch(err => {
      console.error("Error Occurred while fetching data", err)
    }).then(res => {
      // console.log(res)
      this.formatData(res["raw_data"])
    })
  }

  formatData = (rawData) => {
    let casesByCity = {};
    //let casesByState = {};
    let formattedData = {};

    rawData.forEach(data => {
      if (data.detectedcity !== "") {
        if (!casesByCity[data.detectedcity]) casesByCity[data.detectedcity] = {}
        casesByCity[data.detectedcity].cases = casesByCity[data.detectedcity].cases ? casesByCity[data.detectedcity].cases + 1 : 1;
        if (!casesByCity[data.detectedcity].lat || !casesByCity[data.detectedcity].lon) {
          cities.forEach(city => {
            if (city.name === data.detectedcity) {
              casesByCity[data.detectedcity].lat = city.lat;
              casesByCity[data.detectedcity].lon = city.lon;
            }
          })
        }
        // } else if (data.detecteddistrict !== "") {
        //   casesByCity[data.detecteddistrict] = casesByCity[data.detecteddistrict] ? casesByCity[data.detecteddistrict] + 1 : 1;
        // } else if (data.detectedstate !== "") {
        //   casesByCity[data.detectedstate] = casesByCity[data.detectedstate] ? casesByCity[data.detectedstate] + 1 : 1;
        // } else {
        //console.log(data)
      }
    });



    // console.log(casesByCity)
    this.setState({ casesByCity: casesByCity,dataLoaded:true })
  }

  createInfoWindow(e, map, city, cases) {
    const infoWindow = new window.google.maps.InfoWindow({
        content: '<div id="infoWindow" />',
        position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    })
    infoWindow.addListener('domready', e => {
      render(<InfoWindow city={city} cases={cases} />, document.getElementById('infoWindow'))
    })
    infoWindow.open(map)
  }

  createMarkers =  (map) => {
  if (this.state.casesByCity) {
    let markers = Object.keys(this.state.casesByCity).map((key, i) => {
        if (this.state.casesByCity[key].lon && this.state.casesByCity[key].lat) {
          console.log(this.state.casesByCity[key])
          let marker = new window.google.maps.Marker({
            position: { lat: parseFloat(this.state.casesByCity[key].lat), lng: parseFloat(this.state.casesByCity[key].lon) },
            map: map,
            title: key
          });
          marker.addListener('click', e => {
            this.createInfoWindow(e, map,key,this.state.casesByCity[key].cases )
          })
          return marker
        }
      })
    console.log(markers)
  }
    

  }

  render() {
    
    return (
      <div>
        <h1>COVID Tracker</h1>
        {this.state.dataLoaded?<Map
        id="myMap"
        options={{
          center: { lat: 22.1059988, lng: 438.00390625 },
          zoom: 5
        }}
        onMapLoad={map => {
          this.createMarkers(map)
        }}/>:''}
      </div>
    );
  }
}

export default App;
