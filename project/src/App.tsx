import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReadingTips from "./pages/ReadingTips";
import Development from "./pages/Development";
import BookRecommendations from "./pages/BookRecommendations";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/reading-tips"
            element={
              <>
                <Navbar />
                <ReadingTips />
              </>
            }
          />
          <Route
            path="/development"
            element={
              <>
                <Navbar />
                <Development />
              </>
            }
          />
          <Route
            path="/books"
            element={
              <>
                <Navbar />
                <BookRecommendations />
              </>
            }
          />
          <Route
            path="/resources"
            element={
              <>
                <Navbar />
                <Resources />
              </>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<Dashboard />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
