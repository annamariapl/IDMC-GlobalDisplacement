import React from "react";
import ReactDOM from "react-dom";
import { Bar } from "./Bar";
import axios from "axios";
import "./styles.css";
export let hazard_cats_names;

class App extends React.Component {
  state = {
    data: []
  };


  componentDidMount() {
    function uniqueArray(myArray, myFunction) {
      return Array.from(new Set(myArray.map(el => myFunction(el)))).sort((a, b) => a - b);
    }

    function getHazardCategory(value) {
      return value === undefined ? "other" : value;
    }

    axios
      .get("https://api.idmcdb.org/api/disaster_data?ci=IDMCWSHSOLO009")
      .then(({ data }) => {
      //  const years = Array.from(new Set(data.results.map(el => el.year))).sort((a, b) => a - b);
        const years = uniqueArray(data.results, el => el.year);
        const hazard_cats = uniqueArray(data.results, el => el.hazard_category);
        hazard_cats_names = uniqueArray(data.results, el => getHazardCategory(el.hazard_category));

        const graphData = years.map(item => {
          let result = {};
          result["year"] = item;

          for (let [key, value] of Object.entries(hazard_cats)) {
            let hazCatVal = data.results
              .filter(el => el.hazard_category === value)
              .filter(i => i.year === item)
              .reduce((accum, item) => accum + item.new_displacements || 0, 0);
            result[getHazardCategory(value)] = hazCatVal;
          }
          return result;
        });

        console.log("graph data", graphData);


        this.setState({
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
        <Bar data={this.state.data} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
