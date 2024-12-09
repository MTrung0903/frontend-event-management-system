import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
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

  const location = useLocation(); // Để theo dõi thay đổi URL

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
        submenu: [
          {
            title: "View Event",
            path: `/events/1`,
            icon: <CalendarMonthOutlinedIcon />
          },
          {
            title: "Session Event",
            path: `/events/${selectedEvent.eventId}/sessionList`,
            icon: <PendingActionsOutlinedIcon />
          },
          {
            title: "Invite attendee",
            path: `/events/${selectedEvent.eventId}/participants`,
            icon: <ContactMailIcon />
          },
        ],
      },
      {
        title: "Sponsor",
        
        submenu: [
          {
            title: "Add sponsor",
            path: `/events/${selectedEvent.eventId}/sponsors`,
            icon: <CurrencyExchangeIcon />,
          },
        ],
      },
      {
        title: "Provider",
        
        submenu: [
          {
            title: "Add Provider",
            path: `/events/${selectedEvent.eventId}/providers`,
            icon: <AddBusinessOutlinedIcon />,
          },
        ],
      },
      {
        title: "Task",
       
        submenu: [
          { title: "Kanban", path: `/events/${selectedEvent.eventId}/tasks`,  icon: <AssignmentOutlinedIcon />, },
          
        ],
      },
      {
        title: "SubTask",
        
        submenu: [
          {
            title: "Add SubTask",
            path: `/events/${selectedEvent.eventId}/subtask`,
            icon: <AddTaskOutlinedIcon />,
          },
        ],
      },
      {
        title: "Team",
        
        submenu: [
          {
            title: "Team Detail",
            path: `/events/${selectedEvent.eventId}/team-detail`,
            icon: <GroupsOutlinedIcon />,
          },
          {
            title: "Add Team",
            path: `/events/${selectedEvent.eventId}/teams`,
            icon: <GroupAddOutlinedIcon />,
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
        display: "flex", /* Đảm bảo toàn bộ ứng dụng sử dụng flexbox */
        height: "100vh", /* Đảm bảo chiều cao bằng chiều cao của cửa sổ trình duyệt */
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: "100%", /* Đảm bảo chiều cao sidebar phủ đầy */
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <Link to={`/dashboard`} style={{ textDecoration: "none" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="15px"
            >
              <Typography variant="h3" color={colors.grey[100]}>
                EVENT
              </Typography>
            </Box>
          </Link>

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