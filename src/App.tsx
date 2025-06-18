import "./App.scss";
import { ComboBox } from "./combo-box";
import { dropdownData2 } from "./data";

const App = () => {
  return (
    <div className="center">
      <div className="card">
        <ComboBox data={dropdownData2} />
      </div>
    </div>
  );
};

export default App;
