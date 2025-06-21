import "./App.scss";
import { ComboBox } from "./combo-box";
import { dropdownData2 } from "./data";
import { useState } from "react";

const App = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  return (
    <div className="center">
      <div className="card">
        <div>{selectedValue}</div> {/* checking the selected value */}
        <ComboBox
          data={dropdownData2}
          label="Fruit:"
          ariaLabel="Select a fruit"
          onSelect={setSelectedValue}
        />
      </div>
    </div>
  );
};

export default App;
