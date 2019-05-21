import React from "react";
import ReactDOM from "react-dom";
import { Bar } from "./Bar";
import axios from "axios";
import "./styles.css";

class App extends React.Component {
  state = {
    data: [],
    causedByWeather: 0,
    causedByother: 0
  };

  componentDidMount() {
    axios
      .get("https://api.idmcdb.org/api/disaster_data?ci=IDMCWSHSOLO009")
      .then(({ data }) => {
        const years = new Set(data.results.map(el => el.year));

        const weatherRelated = data.results.filter(
          el => el.hazard_category === "Weather related"
        );
        const geophysical = data.results.filter(
          el => el.hazard_category === "Geophysical"
        );
        const otherReason = data.results.filter(
          el =>
            el.hazard_category !== "Geophysical" &&
            el.hazard_category !== "Weather related"
        );

        console.log("otherReason",otherReason)

        const weatherRelatedSum = weatherRelated.reduce(
          (accum, item) => accum + item.new_displacements || 0,
          0
        );

        const otherSum = otherReason.reduce(
          (accum, item) => accum + item.new_displacements || 0,
          0
        );

        const graphData = Array.from(years).sort((a, b) => a - b).map(item => {
          return {
            year: item,
            other: otherReason
              .filter(i => i.year === item)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0),
            "weather related": weatherRelated
              .filter(i => i.year === item)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0),
            geophysical: geophysical
              .filter(i => i.year === item)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0)
          };
        });
        console.log(graphData);


        this.setState({
          causedByWeather: weatherRelatedSum,
          causedByOther: otherSum,
          data: graphData
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
  <h3>Caused by Weahter Global (all years) - {this.state.causedByWeather}
        </h3>
        <h3> Other Causes Global (all years): {this.state.causedByOther}</h3>
        <Bar data={this.state.data} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
