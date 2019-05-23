import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import PropTypes from "prop-types";
import {hazard_cats_names} from "./index.js";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const Bar = props => (
  
  <div style={{ height: "500px", width: "500px" }}>
  <ResponsiveBar
  data={props.data}
  keys={hazard_cats_names}
  indexBy="year"
  margin={{
    top: 50,
    right: 130,
    bottom: 50,
    left: 60
  }}
  padding={0.3}
  colors={{
    scheme: "nivo"
  }}
  defs={[
    {
      id: "dots",
      type: "patternDots",
      background: "inherit",
      color: "#38bcb2",
      size: 4,
      padding: 1,
      stagger: true
    },
    {
      id: "lines",
      type: "patternLines",
      background: "inherit",
      color: "#eed312",
      rotation: -45,
      lineWidth: 6,
      spacing: 10
    }
    ]}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]]
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "year",
      legendPosition: "middle",
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "displacements",
      legendPosition: "middle",
      legendOffset: -40
    }}
    labelSkipWidth={0}
    labelSkipHeight={0}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]]
    }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1
          }
        }
        ]
      }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      />
      </div>
      );

// Bar expects following format to work
Bar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      // year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      Geophysical: PropTypes.number.isRequired,
      "Weather related": PropTypes.number.isRequired,
    })
    ).isRequired
};
