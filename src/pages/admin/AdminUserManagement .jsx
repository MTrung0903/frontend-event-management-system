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
const AdminUserManagement = () => {
  // State quản lý danh sách user

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [role, setRole]  = useState("");
  const [data, setData] = useState(null);
  const [manager, setManager] = useState(null);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setData(response.data.data);
      //console.log(response.data.data)

      //console.log("Data for dropdown:", sponsorshipLevels);
    } catch (error) {
      console.error("Error fetching sponsorship levels:", error);
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  // Mở form thêm hoặc chỉnh sửa user
  const handleOpenDialog1 = async (user = null) => {
    setCurrentUser(user);
    try {
      const response = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setData(response.data.data);
      //console.log(response.data.data)

      //console.log("Data for dropdown:", sponsorshipLevels);
    } catch (error) {
      console.error("Error fetching sponsorship levels:", error);
    }
    setOpenDialog1(true);
  };
  const handleOpenDialog2 = (user = null) => {
    setCurrentUser(user);
    setOpenDialog2(true);
  };

  // Đóng form
  const handleCloseDialog = () => {
    setCurrentUser(null);
    setOpenDialog1(false);
    setOpenDialog2(false);
  };

  // Lưu thông tin user
  const handleSaveUser = async () => {
    try {
      if (currentUser?.id) {
        await axios.put(
          "http://localhost:8080/admin/account/",
          {
            accountID: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,

          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8080/admin/account",
          {
            name: currentUser.name,
            email: currentUser.email,
            
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      }
  
      await fetchAPI(); // Gọi lại API để lấy danh sách mới
      handleCloseDialog(); // Đóng form sau khi lưu
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  

  // Xóa user
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý nhân sự
      </Typography>

      {/* Tìm kiếm */}
      <Box display="flex" gap={2} mb={2} justifyContent={"space-between"}>
        <TextField label="Tìm kiếm người dùng" variant="outlined" sx={{ width: "400px" }} />
        <Box display="flex" gap={2} mb={2} justifyContent={"space-between"}>
        <Button sx={{ backgroundColor: "#1c7ee3" }} variant="contained" onClick={() => handleOpenDialog1()}>
          Thêm nhân viên
        </Button >
        <Button sx={{ backgroundColor: "#1c7ee3" }} variant="contained" onClick={() => handleOpenDialog2()}>
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
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.filter((user) => !user.roles.includes("ADMIN")).map((user, index) => (
              <TableRow key={user.accountID}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles.includes("MANAGER") ? "MANAGER" : "EMPLOYEE"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog1(user)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ ml: 1 }}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Form thêm/sửa người dùng */}
      <Dialog open={openDialog1} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentUser?.id ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}
        </DialogTitle>
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
            value={currentUser?.manId || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, manId: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              Nhân viên thuộc quản lý
            </MenuItem >
            {managers.map((man) => (
              <MenuItem value={man.manId}>`${man.fullName}`</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveUser}>Lưu</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog2} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentUser?.id ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}
        </DialogTitle>
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
          <Button onClick={handleSaveUser}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement;
