import React from "react";
import "./App.css";
import states from "./data/states.json";
import InfoWindow from "./InfoWindow";
import Map from "./map";
import { render } from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      casesByState: {},
      dataLoaded: false,
      summary: {},
    };
  }
  componentDidMount() {
    fetch("https://api.rootnet.in/covid19-in/stats/latest")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch((err) => {
        console.error("Error Occurred while fetching data", err);
      })
      .then((res) => {
        if (res) this.formatData(res);
      });
  }

  formatData = (rawData) => {
    let summary = rawData.data.summary;
    let regionalData = rawData.data.regional;
    let location = {};
    regionalData = regionalData.map((regData) => {
      location = states.find((state) => state.loc === regData.loc);
      if (location) {
        regData = { ...regData, ...location };
      } else {
        console.log(regData);
      }
      return regData;
    });
    this.setState({
      dataLoaded: true,
      casesByState: regionalData,
      summary: summary,
    });
  };

  createInfoWindow(e, map, region, i) {
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div id="infoWindow${i}" />`,
      position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
    infoWindow.addListener("domready", (e) => {
      render(
        <InfoWindow region={region} />,
        document.getElementById(`infoWindow${i}`)
      );
    });
    infoWindow.open(map);
  }

  createMarkers = (map) => {
    if (this.state.casesByState) {
      this.state.casesByState.map((obj, i) => {
        if (obj.lon && obj.lat) {
          let marker = new window.google.maps.Marker({
            position: { lat: parseFloat(obj.lat), lng: parseFloat(obj.lon) },
            map: map,
            title: obj.loc,
          });
          marker.addListener("click", (e) => {
            this.createInfoWindow(e, map, obj, i);
          });
          return marker;
        }
        return undefined;
      });
    }
  };

  render() {
    return (
      <div>
        <h1>COVID Tracker</h1>
        {this.state.dataLoaded ? (
          <Map
            id="myMap"
            options={{
              center: { lat: 22.1059988, lng: 438.00390625 },
              zoom: 5,
            }}
            onMapLoad={(map) => {
              this.createMarkers(map);
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
