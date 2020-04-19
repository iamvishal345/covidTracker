import React from 'react';


function InfoWindow(props) {
  return (
    <div style={{fontWeight:"bold"}}>
      City : {props.city} <br></br>
      Cases : {props.cases}
    </div>
  );
}


export default InfoWindow;