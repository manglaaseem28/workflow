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

const SignUpPage = () => {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("Acme Corp");
  const [name, setName] = useState("Aseem");
  const [email, setEmail] = useState("aseem@example.com");
  const [password, setPassword] = useState("secret123");
  const [passwordConfirmation, setPasswordConfirmation] = useState("secret123");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signUp(companyName, name, email, password, passwordConfirmation);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Could not create account. Check your details and try again.");
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
          width: 420,
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
                Create your workspace ✨
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up as an admin and we’ll create a company workspace for
                you.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Company name"
                  size="small"
                  fullWidth
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <TextField
                  label="Your name"
                  size="small"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Work email"
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
                  autoComplete="new-password"
                  required
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  size="small"
                  fullWidth
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
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
                      <CircularProgress size={18} sx={{ mr: 1 }} /> Creating
                      workspace…
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Stack>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Already have an account?{" "}
              <Link
                to="/sign-in"
                style={{ color: "#7C3AED", textDecoration: "none" }}
              >
                Sign in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUpPage;
