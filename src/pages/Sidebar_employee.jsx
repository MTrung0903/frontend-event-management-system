import { useState, useEffect } from "react";

import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

const SidebarEmployee = ({ selectedEvent, setSelectedEvent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation(); // Để theo dõi thay đổi URL
  const handleClickIcon = () => {
    // Chuyển hướng khi nhấp vào icon
    if (location.pathname.includes("event")) {
      navigate("/");
    }
    else {
      navigate(-1);
    }

  };
  // Các menu mặc định
  const defaultMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      title: "Calendar",
      
      submenu: [{ title: "Xem lịch", path: "/calendar/CalendarList" , icon: <CalendarMonthOutlinedIcon />,}],
    },
  ];

  // Các menu khi chọn một sự kiện
  const eventMenuItems = selectedEvent
    ? [
      {
        title: "Events",
        icon: <ArrowBackIcon />,
        path: "/",
        submenu: [
          {
            title: "View Event",
            path: `/events/${selectedEvent.eventId}`,
            icon: <CalendarMonthOutlinedIcon />
          },
          
          {
            title: "Thông tin nhóm",
            path: `/events/${selectedEvent.eventId}/tasks`,
            icon: <AssignmentOutlinedIcon />,
          },
          {
            title: "Team Detail",
            path: `/events/${selectedEvent.eventId}/team-detail`,
            icon: <GroupsOutlinedIcon />,
          },
         
        ],
      },
    ]
    : [];
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  useEffect(() => {
    if (!selectedEvent) {
      const savedEvent = localStorage.getItem("selectedEvent");
      if (savedEvent) {
        setSelectedEvent(JSON.parse(savedEvent));
      }
    }

    if (location.pathname.includes("/events/") && selectedEvent) {
      setMenuItems(eventMenuItems);
    } else {
      setMenuItems(defaultMenuItems);
    }
  }, [location, selectedEvent, setSelectedEvent]);

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
          color: `${colors.activeIcon[100]} !important`,
        },
      },
      overflow: "hidden",
      border: 1,
      borderColor: colors.background[300]
    }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
        <Box sx={{
            marginLeft: 2,
            color: "red",
            maxWidth: 3,
            maxHeight: 40,
            cursor: 'pointer',
            display: (location.pathname !== "/home" && location.pathname !== "/" && location.pathname !== "") ? 'block' : 'none'
          }}>
            <ArrowBackIcon onClick={handleClickIcon} />
          </Box>

          {/* Các menu items */}
          {menuItems.map((item, index) => (
            <div key={index}>
              {!item.submenu ? (
                <Item
                  title={item.title}
                  to={item.path}
                  icon={item.icon}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <Box>
                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {item.title}
                  </Typography>
                  {item.submenu.map((subItem, subIndex) => (
                      <Item
                        key={subIndex}
                        title={subItem.title}
                        to={subItem.path}
                        icon={subItem.icon} // Use submenu icon
                        selected={selected}
                        setSelected={setSelected}
                      />
                    ))}
                </Box>
              )}
            </div>
          ))}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SidebarEmployee;