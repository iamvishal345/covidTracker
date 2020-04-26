import React from 'react';


function InfoWindow(props) {
  return (
    <div style={{fontWeight:"bold",fontSize:"1rem"}}>
      Location : {props.region.loc} <br></br>
      Total Confirmed Cases : {props.region.totalConfirmed}<br></br>
      Discharged : {props.region.discharged}<br></br>
      Deaths : {props.region.deaths}
    </div>
  );
}


export default InfoWindow;