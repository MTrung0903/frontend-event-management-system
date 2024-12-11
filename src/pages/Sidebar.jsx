import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import EventIcon from '@mui/icons-material/Event';

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


const Sidebar = ({ selectedEvent, setSelectedEvent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const location = useLocation(); // Để theo dõi thay đổi URL
  const navigate = useNavigate();
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
      title: "Events",
      submenu: [{ title: "Sự kiện", path: "/event/eventList", icon: <EventIcon />, }],
    },
    {
      title: "Calendar",

      submenu: [{ title: "Xem lịch", path: "/calendar/CalendarList", icon: <CalendarMonthOutlinedIcon />, }],
    },
    {
      title: "Sponsors",

      submenu: [{ title: "Nhà tài trợ", path: "/sponsors", icon: <BusinessOutlinedIcon />, }],
    },
    {
      title: "Sponsorships",

      submenu: [{ title: "Mức độ nhà tài trợ", path: "/sponsorships/", icon: <HandshakeOutlinedIcon />, }],
    },
    {
      title: "Providers",

      submenu: [
        { title: "Nhà cung cấp", path: "/providers", icon: <StorefrontOutlinedIcon />, },
      ],
    },
    {
      title: "Speakers",

      submenu: [{ title: "Diễn giả", path: "/speakers", icon: <RecordVoiceOverOutlinedIcon />, }],
    },
    {
      title: "MCs",

      submenu: [{ title: "MC", path: "/mcs", icon: <CampaignOutlinedIcon />, }],
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
            title: "Session Event",
            path: `/events/${selectedEvent.eventId}/sessionList`,
            icon: <PendingActionsOutlinedIcon />
          },
          {
            title: "Mc",
            path: `/events/${selectedEvent.eventId}/mc`,
            icon: <CampaignOutlinedIcon />
          },
          {
            title: "Attendees",
            path: `/events/${selectedEvent.eventId}/participants`,
            icon: <ContactMailIcon />
          },
          {
            title: "Add sponsor",
            path: `/events/${selectedEvent.eventId}/sponsors`,
            icon: <CurrencyExchangeIcon />,
          },
          {
            title: "Add Provider",
            path: `/events/${selectedEvent.eventId}/providers`,
            icon: <AddBusinessOutlinedIcon />,
          },
          {
            title: "Kanban",
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
            color: `${colors.activeIcon[100]} !important`, // Đổi màu icon
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
              {item.submenu &&
                <Box>
                  <Typography
                    variant="h6"
                    color={colors.background[200]}
                    fontSize={12}
                    sx={{ m: "15px 0 20px 20px" }}
                  >
                    {item.title}
                  </Typography>
                  {
                    item.submenu.map((subItem, subIndex) => (
                      <Box sx={{ mt: "10px" }}>
                        <Item
                          key={subIndex}
                          title={subItem.title}
                          to={subItem.path}
                          icon={subItem.icon}
                          selected={selected}
                          setSelected={setSelected}
                        />
                      </Box>
                    ))
                  }
                </Box>
              }
            </div>
          ))}
        </Menu>
      </ProSidebar >
    </Box >
  );
};

export default Sidebar;