import { FormEvent, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignInPage = () => {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("aseem@example.com");
  const [password, setPassword] = useState("secret123");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #fdfaff 0%, #f7ecff 50%, #e3f2ff 100%)",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: 380,
          borderRadius: 4,
          border: "1px solid rgba(200,200,230,0.6)",
          boxShadow: "0 16px 40px rgba(140,140,180,0.25)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Welcome back 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your workflow board.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  size="small"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={18} sx={{ mr: 1 }} /> Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Stack>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              New here?{" "}
              <Link
                to="/sign-up"
                style={{ color: "#7C3AED", textDecoration: "none" }}
              >
                Create an account
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignInPage;
