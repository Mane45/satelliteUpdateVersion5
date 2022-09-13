// import {propagate, gstime, eciToGeodetic, radiansToDegrees } from 'satellite.js';
import { getSatelliteLocation } from "../helpers/satelliteCoords";
import { twoline2satrec } from "satellite.js";
//import Graphic from "esri/Graphic";
import Graphic from "@arcgis/core/Graphic";
import { intersects } from "@arcgis/core/geometry/geometryEngine"
let satelliteData = require("../configs/config.json")
//let layer = props.map.layers.items[0];



function overlap(text, layer) {
    //document.getElementById("text").style.display = "block";
    let isIntersecting;
    let isIntersectingEstimate;
    setInterval(() => {
        let names = [], namesEstimate = [];
        function namesArr(name) {
            names.push(name);
        }
        function namesEstimateArr(name) {
            namesEstimate.push(name);
        }
        layer.queryFeatures().then(result => {
            let geometry0 = result.features[0].geometry;
            satelliteData.forEach(item => {
                //console.log(geometry0);
                let loc = getSatelliteLocation(twoline2satrec(item.lines.line1, item.lines.line2), new Date());
                let locEstimate = getSatelliteLocation(twoline2satrec(item.lines.line1, item.lines.line2), new Date(Date.now() + 600000));
                //console.log(loc);
                let x1, x2, y1, y2;
                let xEstimate1, xEstimate2, yEstimate1, yEstimate2;
                if (loc.x < 0) {
                    x1 = loc.x + +item.area.width;
                    x2 = loc.x - +item.area.width;
                } else {
                    x1 = loc.x - +item.area.width;
                    x2 = loc.x + +item.area.width;
                }
                if (loc.y < 0) {
                    y1 = loc.y - +item.area.height;
                    y2 = loc.y + +item.area.height;
                } else {
                    y1 = loc.y + +item.area.height;
                    y2 = loc.y - +item.area.height;
                }
                if (locEstimate.x < 0) {
                    xEstimate1 = locEstimate.x + +item.area.width;
                    xEstimate2 = locEstimate.x - +item.area.width;
                } else {
                    xEstimate1 = locEstimate.x - +item.area.width;
                    xEstimate2 = locEstimate.x + +item.area.width;
                }
                if (locEstimate.y < 0) {
                    yEstimate1 = locEstimate.y - +item.area.height;
                    yEstimate2 = locEstimate.y + +item.area.height;
                } else {
                    yEstimate1 = locEstimate.y + +item.area.height;
                    yEstimate2 = locEstimate.y - +item.area.height;
                }
                let polygon = new Graphic({
                    geometry: {
                        type: "polygon",
                        rings: [
                            [x1, y2],
                            [x1, y1],
                            [x2, y1],
                            [x2, y2]
                        ]
                    },
                    symbol: {
                        type: "simple-fill",
                        color: [227, 139, 79, 0],
                        outline: {
                            //color: props.graphicProperties.color,
                            color: [176, 252, 56],
                            //color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7],
                            width: 2
                        }
                    }
                });
                let polygonEstimate = new Graphic({
                    geometry: {
                        type: "polygon",
                        rings: [
                            [xEstimate1, yEstimate2],
                            [xEstimate1, yEstimate1],
                            [xEstimate2, yEstimate1],
                            [xEstimate2, yEstimate2]
                        ]
                    },
                    symbol: {
                        type: "simple-fill",
                        color: [227, 139, 79, 0],
                        outline: {
                            //color: props.graphicProperties.color,
                            color: [176, 252, 56],
                            //color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7],
                            width: 2
                        }
                    }
                });
                let geometry1 = polygon.geometry;
                let geometryEstimate = polygonEstimate.geometry;
                isIntersecting = intersects(geometry0, geometry1);
                isIntersecting ? namesArr(item.lines.name) : document.getElementById("text").style.display = "none"
                isIntersectingEstimate = intersects(geometry0, geometryEstimate);
                isIntersectingEstimate ? namesEstimateArr(item.lines.name) : document.getElementById("text").style.display = "none";
            });
            //console.log(names)
            if(names.length != 0) {
                document.getElementById("text").style.display = "block";
                document.getElementById("putText1").style.display = "block";
                document.getElementById("putText1").innerHTML = `${names.toString().replace(/,/g, ", ")} satellites are overlapping you boundary`;
                
            }
            if(namesEstimate.length != 0){
                document.getElementById("text").style.display = "block";
                document.getElementById("putText").style.display = "block";
                document.getElementById("putText").innerHTML = `${names.toString().replace(/,/g, ", ")} satellites will overlapping you boundary from 10 minutes`;
            }
        
        })

    }, 500)

}

export { overlap }