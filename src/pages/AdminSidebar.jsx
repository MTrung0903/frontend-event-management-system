import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import { Margin } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const AdminSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Sử dụng useLocation để theo dõi đường dẫn hiện tại
  const location = useLocation();

  const defaultMenuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      title: "Thiết bị và dịch vụ",
      path: "/admin/service",
      icon: <ConstructionOutlinedIcon />
    },
    {
      title: "Tài khoản",
      path: "/admin/user",
      icon: <ManageAccountsOutlinedIcon />
    },
  ];

  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  // Cập nhật selected khi location thay đổi
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setSelected(currentItem.title);
    }
  }, [location, menuItems]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        "& .pro-sidebar-inner": {
          background: `${colors.background[100]} !important`,
          height: "100%",
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
        "& .pro-inner-item:hover": { backgroundColor: `${colors.hover[100]} !important`, color: `${colors.active[100]} !important` },
        "& .pro-menu-item.active": {
          color: `${colors.active[100]} !important`,
          backgroundColor: `${colors.hover[100]} !important`,
          "& .pro-icon": {
            color: `${colors.activeIcon[100]} !important`, // Đổi màu icon
          },
        },
        overflow: "hidden",
        border: 1,
        borderColor: colors.background[300]
      }}
    >
      <ProSidebar collapsed={isCollapsed} >
        <Menu iconShape="square">
          <Box sx={{ marginTop: "57px" }}> {/* Thêm marginTop để hạ thấp */}
            {menuItems.map((item, index) => (
              <div key={index}>
                <Box sx={{ mt: "10px" }}>
                  <Item
                    key={index}
                    title={item.title}
                    to={item.path}
                    icon={item.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </Box>
              </div>
            ))}
          </Box>
        </Menu>
      </ProSidebar >
    </Box >
  );
};
export default AdminSidebar;
