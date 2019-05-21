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
        const weatherRelated = data.results.filter(
          el => el.hazard_category === "Weather related"
        );
        const geophysical = data.results.filter(
          el => el.hazard_category === "Geophysical"
        );
        const otherReason = data.results.filter(
          el =>
            el.hazard_category !== "Geophysical" &&
            el.hazard_category !== "Weather related" &&
            el.hazard_category
        );

        const weatherRelatedSum = weatherRelated.reduce(
          (accum, item) => accum + item.new_displacements || 0,
          0
        );

        const otherSum = otherReason.reduce(
          (accum, item) => accum + item.new_displacements || 0,
          0
        );

        // my code
        const proccessed = data.results.map(item => {
          return {
            year: item.year,
            other: otherReason
              .filter(i => i.year === item.year)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0),
            "weather related": weatherRelated
              .filter(i => i.year === item.year)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0),
            geophysical: geophysical
              .filter(i => i.year === item.year)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0)
          };
        });

        // CONSOLE.LOG LOOP
        // check stuff without login whole API (super slow on codesandbox)
        let loops = 0;
        let checkingLoop = function() {
          while (loops < 10) {
            console.log("proccessed[results]", proccessed[loops]);
            loops++;
          }
        };
        checkingLoop();

        const graphData = [];
        proccessed.map(item => {
          // push the first item of processed to graphData Array
          if (graphData.length === 0) {
            graphData.push(item);
            return false;
          }
          let exists = false;
          for (let i = 0; i < graphData.length; i++) {
            if (graphData[i].year === item.year) {
              exists = true;
              graphData[i]["weather related"] =
                graphData[i]["weather related"] + item["weather related"];
              graphData[i].other = graphData[i].other + item.other;
              graphData[i].geophysical =
                graphData[i].geophysical + item.geophysical;
              break;
            }
          }
          if (!exists) {
            graphData.push(item);
          }
          return false;
        });

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
        <h3>
          Caused by Weahter Global (all years) - {this.state.causedByWeather}
        </h3>
        <h3> Other Causes Global (all years): {this.state.causedByOther}</h3>
        <Bar data={this.state.data} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
