import React, { useState } from "react";
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

const AdminUserManagement = () => {
  // State quản lý danh sách user
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Thanh Tùn", email: "admin@gmail.com", role: "Employee" },
    { id: 2, name: "Hồ Minh Trung", email: "manager@gmail.com", role: "Manager" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mở form thêm hoặc chỉnh sửa user
  const handleOpenDialog = (user = null) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  // Đóng form
  const handleCloseDialog = () => {
    setCurrentUser(null);
    setOpenDialog(false);
  };

  // Lưu thông tin user
  const handleSaveUser = () => {
    if (currentUser?.id) {
      // Cập nhật thông tin user
      setUsers((prev) =>
        prev.map((user) => (user.id === currentUser.id ? currentUser : user))
      );
    } else {
      // Thêm user mới
      setUsers((prev) => [
        ...prev,
        { ...currentUser, id: prev.length + 1 },
      ]);
    }
    handleCloseDialog();
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
        <TextField label="Tìm kiếm người dùng" variant="outlined"  sx={{width :"400px"}}/>
        <Button sx = {{backgroundColor:"#1c7ee3"}}variant="contained" onClick={() => handleOpenDialog()}>
          Thêm nhân viên
        </Button>
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
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(user)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentUser?.id ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}
        </DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Tên"
            fullWidth
            sx = {{marginBottom:2}}
            value={currentUser?.name || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
          />
          <TextField
            placeholder="Email"
            fullWidth
            sx = {{marginBottom:2}}
            value={currentUser?.email || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentUser?.role || ""}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, role: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              Chọn vai trò
            </MenuItem >
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </Select>
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
