import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login"); // Chuyển hướng nếu không có token
  //   }
  // }, [navigate]); // Đảm bảo rằng navigate được gọi sau khi hook được gọi

  // State to manage the menu open/close
  const [anchorEl, setAnchorEl] = useState(null);

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
    sx = {{
      bgcolor: colors.background[100],
      borderBottom: 1,
      borderColor: colors.background[300],
      margin:0,
    }}>
     
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
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
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
