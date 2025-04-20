import Home from "./Home.tsx";
import GamesPage from "./GamesPage.tsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Games/" element={<GamesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
