import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const { user, token } = useAuth();
  const isAuthed = !!token && !!user;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fdfaff 0%, #f7ecff 50%, #e3f2ff 100%)",
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            isAuthed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route
          path="/sign-in"
          element={
            isAuthed ? <Navigate to="/dashboard" replace /> : <SignInPage />
          }
        />
        <Route
          path="/sign-up"
          element={
            isAuthed ? <Navigate to="/dashboard" replace /> : <SignUpPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthed ? <DashboardPage /> : <Navigate to="/sign-in" replace />
          }
        />
      </Routes>
    </Box>
  );
};

export default App;
