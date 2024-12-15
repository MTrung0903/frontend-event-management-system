import {
  Box, IconButton, useTheme, Menu, MenuItem, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Button, TextField
} from "@mui/material";

import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import axios from "axios";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.userId || null;
  const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Kiểm soát hiển thị dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleChangePassword = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigits = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    if (!hasUpperCase.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái in hoa.";
    }
    if (!hasLowerCase.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái in thường.";
    }
    if (!hasDigits.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ số.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
    }

    return null; // Mật khẩu hợp lệ
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // Kiểm tra mật khẩu mới
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      alert(passwordError); // Hiển thị thông báo lỗi
      return;
    }
    try {
      await axios.post("http://localhost:8080/change-password", {
        newPassword: newPassword,
        accountId: userId
      });
      alert("Đổi thành công");
    } catch (error) {
      alert("Đổi thất bại");
    }
    handleClose();
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login"); // Chuyển hướng nếu không có token
  //   }
  // }, [navigate]); // Đảm bảo rằng navigate được gọi sau khi hook được gọi

  // State to manage the menu open/close

  const fetchNotifications = async () => {
    setIsLoading(true); // Bắt đầu tải
    try {
      const response = await axios.get(`http://localhost:8080/notify/${userId}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }); // Thay URL bằng API của bạn
      setNotifications(response.data.data); // Cập nhật danh sách thông báo
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false); // Kết thúc tải
    }
  };
  const handleNotiClick = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) {
      fetchNotifications(); // Gọi API khi mở dropdown
    }
  }
  // Open menu when icon is clicked
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu when an option is selected
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Profile click
  const handleProfileClick = () => {
    navigate("/profile"); // Chuyển hướng tới trang profile
    handleMenuClose(); // Đóng menu sau khi chọn
  };

  // Handle Logout click
  const handleLogoutClick = () => {
    // Thực hiện logic logout (ví dụ xóa token)
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Chuyển hướng đến trang login sau khi logout
    handleMenuClose(); // Đóng menu sau khi chọn
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={2}
      sx={{
        bgcolor: colors.background[100],
        borderBottom: 1,
        borderColor: colors.background[300],
        margin: 0,
      }}>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotiClick}>
          <NotificationsOutlinedIcon />
          {isDropdownOpen && (
            <Box
            sx={{
              position: "absolute",
              top: "45px",
              right: "15px",
              width: "300px",
              maxHeight: "400px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
              zIndex: 10,
            }}
            >
              {isLoading ? (
                <Box p={2} textAlign="center">
                  Đang tải thông báo...
                </Box>
              ) : notifications.length > 0 ? (
                notifications.map((noti, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: "10px 15px",
                      borderBottom: "1px solid #f0f0f0",
                      "&:hover": {
                        backgroundColor: "#f9f9f9",
                        cursor: "pointer",
                      },
                      textAlign: "left", // Căn lề trái
                    }}
                  >
                    <Box
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                        marginBottom: "5px",
                        textAlign: "left", // Căn lề trái
                      }}
                    >
                      {noti.title}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "14px",
                        color: "#555",
                        lineHeight: "1.5",
                        textAlign: "left", // Căn lề trái
                      }}
                    >
                      {noti.message}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box p={2} textAlign="center">
                  Không có thông báo mới.
                </Box>
              )}
            </Box>
          )}

        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick}>
          <PersonOutlinedIcon />
        </IconButton>

        {/* Menu for Profile and Logout */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Hồ sơ</MenuItem>
          <MenuItem onClick={handleChangePassword}>Đổi mật khẩu</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          maxWidth: "100%",
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontSize: 20 }}>Đổi mật khẩu</DialogTitle>
        <DialogContent>

          <TextField
            margin="dense"
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: currentPassword ? "#0c6ab0" : "red", // Đổi màu viền
                },
              },
              "& .MuiInputLabel-root": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label khi focused
              },
              margin: "25px 12px",
              width: "calc(100% - 24px)"
            }}
          />
          <TextField
            margin="dense"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}

            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: currentPassword ? "#0c6ab0" : "red", // Đổi màu viền
                },
              },
              "& .MuiInputLabel-root": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label khi focused
              },
              margin: "25px 12px",
              width: "calc(100% - 24px)"
            }}
          />
          <TextField
            margin="dense"
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}

            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: currentPassword ? "#0c6ab0" : "red", // Đổi màu viền
                },
              },
              "& .MuiInputLabel-root": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: currentPassword ? "#0c6ab0" : "red", // Đổi màu label khi focused
              },
              margin: "25px 12px 0px 12px",
              width: "calc(100% - 24px)"
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} sx={{ backgroundColor: "#0784d4", color: "white", width: "calc(100% - 50px)", margin: "0 25px" }}>
            Đổi mật khẩu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
