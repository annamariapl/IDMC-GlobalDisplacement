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
        //  without uniqueArray: const years = Array.from(new Set(data.results.map(el => el.year))).sort((a, b) => a - b);
       // function uniqueArray returns a sorted Array without duplicates. It requires an Array that you want to sort, and the information what you want to map(el)
       const uniqueArray = (myArray, myFunction) => {
        return [...new Set(myArray.map(el => myFunction(el)))].sort(/*(a, b) => a - b*/);
      }

      const getHazardCategory = (value) => {
      // does two things: code flexible for API changes (if there will be new hazard_categories) && prevents "undefinced" hussle
      return value === undefined ? "other" : value;
    }

    axios
    .get("https://api.idmcdb.org/api/disaster_data?ci=IDMCWSHSOLO009")
    .then(({ data }) => {
        // keeping const years just in case, the specifications change to years (probable)
        // const years = uniqueArray(data.results, el => el.year);
        const months = uniqueArray(data.results, el => el.start_date.substring(0,7));
        const hazard_cats = uniqueArray(data.results, el => el.hazard_category);
        hazard_cats_names = uniqueArray(data.results, el => getHazardCategory(el.hazard_category));
        
        const graphData = months.map(item => {
          const result = {};
          result["month"] = item;

          for (const value of Object.values(hazard_cats)) {
            const hazardCategoryValuesSum = data.results
            .filter(e => e.hazard_category === value)
            .filter(e=> e.start_date.substring(0,7) === item)
            .reduce((displacement_accumulator, element) => displacement_accumulator + element.new_displacements || 0, 0);
            result[getHazardCategory(value)] = hazardCategoryValuesSum;
          }
          console.log(result);
          return result;
        });

// final check what goes to the graph
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
      <h3> Global (worldwide) displacements by different causes </h3>
      <Bar data={this.state.data}  />
      </div>
      );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
