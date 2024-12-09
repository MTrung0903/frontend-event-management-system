import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import axios from "axios";
import { useParams, Link , useLocation, Navigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const tokenLogin = localStorage.getItem("token");

  
  // Lấy token từ URL (nếu API yêu cầu)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  if (tokenLogin) {
    // Người dùng đã đăng nhập, chuyển hướng đến dashboard
    return <Navigate to="/" replace />;
  }
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/reset-password", {
        token, // Token xác thực từ email (nếu có)
        newPassword,
      });
      console.log("Đặt lại mật khẩu thành công:", response.data);
      setSuccess("Mật khẩu của bạn đã được thay đổi thành công.");
    } catch (error) {
      console.error("Đặt lại mật khẩu thất bại:", error);
      setError("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
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
          Đặt Lại Mật Khẩu
        </Typography>
        <form onSubmit={handleResetPassword}>
          {/* Mật khẩu mới */}
          <TextField
            placeholder="Mật khẩu mới"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#d5cbff" }} />
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

          {/* Xác nhận mật khẩu */}
          <TextField
            placeholder="Xác nhận mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#d5cbff" }} />
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

          {/* Hiển thị lỗi */}
          {error && (
            <Typography color="error" mt={1} textAlign="center">
              {error}
            </Typography>
          )}

          {/* Hiển thị thành công */}
          {success && (
            <Typography color="success.main" mt={1} textAlign="center">
              {success}
            </Typography>
          )}

          {/* Nút gửi */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt Lại Mật Khẩu"}
            </Button>
          </Box>
        </form>

        {/* Quay lại trang đăng nhập */}
        <Typography color="#aaaaaa" textAlign="center" mt={2}>
          <Link to="/login" style={{ color: "#76c7c0", textDecoration: "none" }}>
            Quay lại trang đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword;
