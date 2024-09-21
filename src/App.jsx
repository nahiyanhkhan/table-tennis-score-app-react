import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TableTennisScoreCalculator from "./score";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TableTennisScoreCalculator></TableTennisScoreCalculator>
    </>
  );
}

export default App;
