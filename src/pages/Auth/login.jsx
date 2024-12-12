import React, { useState , useEffect} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import bgImage from './bg.jpeg';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []); // Chỉ chạy khi component được render lần đầu

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const token = response.data.data;
      localStorage.setItem("token", "Bearer " + token);
      setIsAuthenticated(true);
      window.location.href = "/";
    } catch (error) {
      setError("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      
    >
      {/* Khung đăng nhập */}
      <Box
        width="400px"
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          marginLeft: "235px", // Khoảng cách với phần bên phải
          marginRight: "190px"
        }}
      >
        <Typography variant="h4" color="#000000" textAlign="center" mb={3}>
          Đăng Nhập
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Email */}
          <TextField
            placeholder="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: "#d5cbff" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Mật khẩu */}
          <TextField
            placeholder="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#d5cbff" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <Typography color="error" mt={1} textAlign="center">
              {error}
            </Typography>
          )}

          {/* Nút đăng nhập */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng Nhập"}
          </Button>
        </form>

        {/* Quên mật khẩu */}
        <Typography textAlign="center" mt={2}>
          <Link to="/forgot" style={{ color: "#333333", textDecoration: "none" }}>
            Quên mật khẩu
          </Link>
        </Typography>
      </Box>

      {/* Ảnh nền bên phải */}
      <Box
        flex={1}
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}

export default Login;