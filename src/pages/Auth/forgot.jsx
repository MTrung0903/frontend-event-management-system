import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  if (token) {
    // Người dùng đã đăng nhập, chuyển hướng đến dashboard
    return <Navigate to="/" replace />;
  }
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8080/forgot", {
        email,
      });
      console.log("Yêu cầu đặt lại mật khẩu thành công:", response.data);
      setSuccess("Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
    } catch (error) {
      console.error("Yêu cầu đặt lại mật khẩu thất bại:", error);
      setError("Email không tồn tại hoặc xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh" 
      width="100vw" 
      bgcolor="lightgray"
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={3}
        bgcolor="#f9f8ff"
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h4" color="#000000" textAlign="center" mb={3}>
          Quên Mật Khẩu
        </Typography>
        <form onSubmit={handleForgotPassword}>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#171316",
                "& fieldset": {
                  borderColor: "#d5cbff",
                },
                "&:hover fieldset": {
                  borderColor: "#76c7c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#76c7c0",
                },
              },
            }}
          />
          {error && (
            <Typography color="error" mt={1} textAlign="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mt={1} textAlign="center">
              {success}
            </Typography>
          )}
          <Box display="flex" justifyContent="center" mt={3} bgcolor="#3b71cb" color = "#ffffff">
            <Button
              type="submit"
              variant="contained"
              color="#333333"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi Yêu Cầu"}
            </Button>
          </Box>
        </form>
        <Typography color="#333333" textAlign="center" mt={2}>
          <Box display="flex" justifyContent="flex-end">
            <Link to="/login" style={{ color: "#333333", textDecoration: "line" }}>
            Quay lại trang đăng nhập
            </Link>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
