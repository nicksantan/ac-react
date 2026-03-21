import Home from "./Home.tsx";
import GamesPage from "./GamesPage.tsx";
import GameDetailPage from "./GameDetailPage.tsx";
import AboutPage from "./AboutPage.tsx";
import GetInvolvedPage from "./GetInvolvedPage.tsx";
import AdminLogin from "./components/AdminLogin.tsx";
import AdminLogPage from "./AdminLogPage.tsx";
import AdminGamesPage from "./AdminGamesPage.tsx";
import AdminIndicator from "./components/AdminIndicator.tsx";
import TimelinePage from "./timeline/TimelinePage.jsx";
import Layout from "./Layout.tsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ContentProvider } from "./contexts/ContentContext.tsx";

// Get base URL from Vite config (will be '/ac/' in production, '/' in development)
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router basename={basename}>
          <Routes>
            <Route path="/timeline" element={<TimelinePage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<AboutPage />} />
              <Route path="/Involved" element={<GetInvolvedPage />} />
              <Route path="/Games" element={<GamesPage />} />
              <Route path="/games/:slug" element={<GameDetailPage />} />
              <Route path="/installations/:slug" element={<GameDetailPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin-log" element={<AdminLogPage />} />
              <Route path="/admin-games" element={<AdminGamesPage />} />
            </Route>
          </Routes>
          <AdminIndicator />
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
