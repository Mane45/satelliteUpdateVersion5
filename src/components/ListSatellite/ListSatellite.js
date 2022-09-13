import "./ListSatellite.css";
// import { SatelliteData } from "../../configs/config";
import { twoline2satrec } from "satellite.js";
import { getSatelliteLocation } from "../../helpers/satelliteCoords";
import { overlap } from "../../helpers/overlap&estimate";
import { loadModules } from "esri-loader";
import React, { useState } from "react";

let satelliteData = require("../../configs/config.json");

function ListSatellite(props) {
  function dropDownSatellite() {
    document.querySelector(".list").classList.toggle("showList");
    document.querySelector(".down-arrow").classList.toggle("rotate180");
  }

  const handleItemClick = (e) => {
    let layer = props.map.layers.items[0]
    props.setSelectedSatellite((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked
    }));
    if (!e.target.checked) {
      //e.target.parentElement.children[2].children[1].checked = e.target.checked;
      document.getElementById("text").style.display = "none";
      e.target.parentElement.children[3].children[1].checked = e.target.checked;
      e.target.parentElement.children[4].children[1].checked = e.target.checked;
      // document.getElementById("text").style.display = "none";
      // console.log(document.getElementById("text"))
      props.view.goTo({
        zoom: 1
      },);
      // console.log(props.view.graphics)
      // handleTrack(e)
    }
    overlap("overlap", layer)
  };
  const handelItemChange = (e) => {
    //console.log(e.target.parentElement.parentElement.children[0].checked);
    if (e.target.parentElement.parentElement.children[0].checked) {
      props.setSelectedSatellite1((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked
      }));
    } else {
      alert("Please choose te satelliet");
      e.target.checked = !e.target.checked;
    }
    if (!e.target.checked) {
      document.getElementById("text").style.display = "none";

    }

  }
  const handleItemClickAll = (e) => {
    //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkboxes = document.getElementsByClassName('checkbox');
    //console.log(checkboxes);
    function checkedAll() {
      //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      //let checkboxes = document.getElementsByClassName('checkbox');
      //for (let checkbox of checkboxes) {
      //for (let i = 0; i < checkboxes.length; i++) {
      //checkbox.checked = "true";
      let layer = props.map.layers.items[0]
      // overlap("terra, aqua", layer)
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          checkboxes[i].checked = !!checkboxes[i].checked
          //props.map.removeAll()
        } else checkboxes[i].checked = !checkboxes[i].checked
      }
      //}
    }
    function removeCheckedAll() {
      //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      //let checkboxes = document.getElementsByClassName('checkbox');
      console.log(props.view)
      //console.log(props.view.graphics.items = [])
      //props.view.graphics.removeAll()
      //props.map.graphics.remove(props.view.graphics.items)
      //props.view.graphics.items = []
      // props.map.layers.removeAll()
      // console.log(props.map)
      //props.maps
      props.view.goTo({
        zoom: 1
      },);
      document.getElementById("text").style.display = "none";
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          checkboxes[i].checked = !checkboxes[i].checked
          //props.map.removeAll()
        } else checkboxes[i].checked = !!checkboxes[i].checked
      }
    }
    if (e.target.checked) {
      checkedAll()
    } else removeCheckedAll()

    for (let i = 0; i < checkboxes.length; i++) {
      //console.log(checkboxes[i]);
      props.setSelectedSatellite((prevState) => ({
        ...prevState,
        [checkboxes[i].name]: e.target.checked,
      }));
    }
  };
  const handleZoom = (e) => {
    //console.log(e.target.parentElement.children[0].checked)
    //if (e.target.parentElement.parentElement.children[0].checked) {
    let name = e.target.parentElement.children[1].textContent;
    if (e.target.parentElement.children[0].checked) {
      //if (e.target.checked) {
      //console.log(e.target.checked);
      satelliteData.forEach((item) => {
        if (item.lines.name === name) {
          let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
          let loc = getSatelliteLocation(satrec, new Date());
          props.view.goTo({
            position: {
              x: loc.x,
              y: loc.y,
              z: loc.z * 2
            }
          })
        }

      });
      // } else {
      //   props.view.goTo({
      //     zoom: 1
      //   },
      //     // {speedFactor: 0.1, easing: "out-guit"}
      //   );
      // }

    } else {
      alert("Please choose te satelliet");
      //e.target.checked = !e.target.checked;
    }
  };
  const [trackingIds, setTrackingIds] = useState({});
  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
    arr.splice(objWithIdIndex, 1);

    return arr;
  }
  const handleTrack = (e) => {
    let btnID = e.target.name + "";
    let name = e.target.parentElement.parentElement.children[1].textContent;
    //console.log(name)
    if (e.target.parentElement.parentElement.children[0].checked) {
      let trackFeatures = [];
      loadModules([
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
      ])
        .then(([Graphic, GraphicsLayer,]) => {
          const graphicLayer = new GraphicsLayer();
          let color;
          satelliteData.forEach((item) => {

            if (item.lines.name === name) {
              color = item.color;
              let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
              for (let i = 0; i < 60 * 24; i++) {
                let loc = null;
                try {
                  loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
                } catch (error) { }
                if (loc != null) {
                  trackFeatures.push([loc.x, loc.y, loc.z])
                }
              }
            }
          })
          // const lineSymbol = {
          //   type: "simple-line", 
          //   style: "long-dash",
          //   color: color,
          //   width: 2
          // };
          const track = new Graphic({
            geometry: {
              type: "polyline",
              paths: [trackFeatures]
            },
            symbol: {
              type: "simple-line", 
              style: "dot",
              color: color,
              width: 1
            }
          });
          console.log(track)
          if (e.target.checked) {
            graphicLayer.graphics.add(track);
            props.map.add(graphicLayer);
            //console.log(graphicLayer)
            let uid = props.map.layers.items[props.map.layers.items.length - 1]["uid"];
            //console.log(uid)
            setTrackingIds((prevState) => ({
              ...prevState,
              [btnID]: uid,
            }));
            //console.log(props.map.layers.items)
          } else {
            /*working vat code */
            // removeObjectWithId(props.map.layers.items, trackingIds?.btnID);
            // setTrackingIds((prevState) => ({
            //   ...prevState,
            //   btnID: "",
            // }));
            // graphicLayer.graphics.add(new Graphic());
            // props.map.add(graphicLayer);
            let removebleLayer = props.map.layers.items.filter((item) => item.uid === trackingIds[btnID]);
            props.map.layers.remove(removebleLayer[0]);
            setTrackingIds((prevState) => ({
              ...prevState,
              [btnID]: null,
            }));
          }

        })
    } else {
      alert("Please choose te satelliet");
      e.target.checked = !e.target.checked;
    }


  }
  let renderedOutput = satelliteData.map((item) => (
    <div className="select-item" key={item.id}>
      <input type="checkbox" className="checkbox" name={item.id} onClick={(e) => handleItemClick(e)} />
      <label>
        <p className="satName">{item.lines.name}</p>
      </label>
      <button className="zoom" onClick={(e) => handleZoom(e)}>
        Zoom
      </button>
      {/* <div className="toggle-button-wraper" onChange={(e) => handleZoom(e)}>
        <p className="btnName">Zoom</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div> */}
      {/* <button className="track" onClick={(e) => handleTrack(e)}>
        Track
      </button> */}
      <div className="toggle-button-wraper" onChange={(e) => handleTrack(e)}>
        <p className="btnName">Track</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div>
      {/* <button className="polygon" >
        Extent view
      </button> */}
      <div className="toggle-button-wraper" onChange={(e) => handelItemChange(e)}>
        <p className="btnName">Area</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div>
    </div>
  ));
  return (
    <div className="multi-selector">
      <div className="select-field" onClick={dropDownSatellite}>
        <input
          type="text"
          placeholder="Select Satellite"
          className="input-selector"
        />
        <span className="down-arrow">&#9660;</span>
      </div>
      <div className="list">
        <div className="select-item">
          <input type="checkbox" name="" onChange={handleItemClickAll}></input>
          <label>
            <p className="satName">Select All</p>
          </label>
        </div>
        {renderedOutput}
        {/* <RenderedOutput /> */}
      </div>
    </div>
  );
}
export default ListSatellite;
