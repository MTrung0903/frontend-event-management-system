import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const AdminUserManagement = () => {
  const [openDialogEmployee, setOpenDialogEmployee] = useState(false);
  const [openDialogManager, setOpenDialogManager] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/managers", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setManagers(response.data.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
    fetchManagers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenDialogEmployee = (user = null) => {
    setCurrentUser(user);
    setOpenDialogEmployee(true);
  };

  const handleOpenDialogManager = (user = null) => {
    setCurrentUser(user);
    setOpenDialogManager(true);
  };

  const handleCloseDialog = () => {
    setCurrentUser(null);
    setOpenDialogEmployee(false);
    setOpenDialogManager(false);
  };

  const handleSaveEmployee = async () => {
    if (!currentUser?.name || !currentUser?.email || !currentUser?.phone || !currentUser?.manID) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng điền đầy đủ các trường.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(currentUser.email)) {
      Swal.fire({
        title: "Thông báo",
        text: "Email không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
  
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(currentUser.phone)) {
      Swal.fire({
        title: "Thông báo",
        text: "Số điện thoại không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/admin/account",
        {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          manID: currentUser.manID,
          roles: ["EMPLOYEE"],
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      handleCloseDialog();
      Swal.fire({
        title: "Thông báo",
        text: "Thêm thành công",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      await fetchAPI();

    } catch (error) {
      //handleCloseDialog();
      Swal.fire({
        title: "Thông báo",
        text: "Email đã tồn tại",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
    }
  };

  const handleSaveManager = async () => {
    if (!currentUser?.name || !currentUser?.email || !currentUser?.phone || !currentUser?.manID) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng điền đầy đủ các trường.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(currentUser.email)) {
      Swal.fire({
        title: "Thông báo",
        text: "Email không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
  
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(currentUser.phone)) {
      Swal.fire({
        title: "Thông báo",
        text: "Số điện thoại không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/admin/account",
        {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          roles: ["MANAGER", "EMPLOYEE"],
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      handleCloseDialog();
      Swal.fire({
        title: "Thông báo",
        text: "Thêm thành công",
        icon: "success",
        confirmButtonText: "OK",
        
      });
      await fetchAPI();

    } catch (error) {
      //handleCloseDialog();
      Swal.fire({
        title: "Thông báo",
        text: "Email đã tồn tại",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-popup-inline',  // Tên class tùy chỉnh
        },
        didOpen: () => {
          // Áp dụng trực tiếp CSS qua script khi Swal mở
          const swalPopup = document.querySelector('.swal-popup-inline');
          swalPopup.style.zIndex = 9999;
          swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
        }
      });
    }
  };

  const handleBlock = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/admin/account/${id}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      await fetchAPI();
    } catch (error) {
      console.error("Error blocking account:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý nhân sự
      </Typography>

      {/* Tìm kiếm */}
      <Box display="flex" gap={2} mb={2} justifyContent={"space-between"}>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          sx={{ width: "400px" }}
          value={searchQuery}
          onChange={handleSearch}
        />
        <Box display="flex" gap={2}>
          <Button
            sx={{ backgroundColor: "#1c7ee3" }}
            variant="contained"
            onClick={() => handleOpenDialogEmployee()}
          >
            Thêm nhân viên
          </Button>
          <Button
            sx={{ backgroundColor: "#1c7ee3" }}
            variant="contained"
            onClick={() => handleOpenDialogManager()}
          >
            Thêm quản lý
          </Button>
        </Box>
      </Box>

      {/* Danh sách người dùng */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.filter((user) =>
                !user.roles.includes("ADMIN") &&
                (user.name.toLowerCase().includes(searchQuery) ||
                  user.email.toLowerCase().includes(searchQuery) ||
                  user.phone.toLowerCase().includes(searchQuery))
              )
              .map((user, index) => (
                <TableRow key={user.accountID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.roles.includes("MANAGER") ? "MANAGER" : "EMPLOYEE"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleBlock(user.accountID)}
                      sx={{ ml: 1 }}
                    >
                      {user.isActive ? "Khóa tài khoản" : "Mở tài khoản"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form thêm/sửa người dùng */}
      <Dialog open={openDialogEmployee} onClose={handleCloseDialog} sx={{ zIndex: 999 }}>
        <DialogTitle>{currentUser?.manID ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Tên"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.name || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
          />
          <TextField
            placeholder="Email"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.email || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />
          <TextField
            placeholder="Phone"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.phone || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, phone: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentUser?.manID || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, manID: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              Nhân viên thuộc quản lý
            </MenuItem>
            {managers &&
              managers.map((man) => (
                <MenuItem value={man.manID} key={man.manID}>
                  {man.name}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveEmployee}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Form thêm quản lý */}
      <Dialog open={openDialogManager} onClose={handleCloseDialog} sx={{ zIndex: 999 }}>
        <DialogTitle>Thêm quản lý</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Tên"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.name || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
          />
          <TextField
            placeholder="Email"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.email || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />
          <TextField
            placeholder="Phone"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={currentUser?.phone || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, phone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveManager}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement;
