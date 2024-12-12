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
  InputLabel,
} from "@mui/material";

const AdminDeviceManagement = () => {
  // State quản lý thiết bị
  const [devices, setDevices] = useState([
    { id: 1, name: "Loa", type: "Âm thanh", status: "Sẵn sàng", provider: "Công ty A" },
    { id: 2, name: "Đèn sân khấu", type: "Ánh sáng", status: "Đang sử dụng", provider: "Công ty B" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  // Mở form thêm hoặc chỉnh sửa thiết bị
  const handleOpenDialog = (device = null) => {
    setCurrentDevice(device);
    setOpenDialog(true);
  };

  // Đóng form
  const handleCloseDialog = () => {
    setCurrentDevice(null);
    setOpenDialog(false);
  };

  // Lưu thiết bị
  const handleSaveDevice = () => {
    if (currentDevice?.id) {
      // Cập nhật thiết bị
      setDevices((prev) =>
        prev.map((device) =>
          device.id === currentDevice.id ? currentDevice : device
        )
      );
    } else {
      // Thêm thiết bị mới
      setDevices((prev) => [
        ...prev,
        { ...currentDevice, id: prev.length + 1 },
      ]);
    }
    handleCloseDialog();
  };

  // Xóa thiết bị
  const handleDeleteDevice = (id) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý thiết bị
      </Typography>

      {/* Tìm kiếm */}
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Tìm kiếm thiết bị" variant="outlined" fullWidth />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm thiết bị
        </Button>
      </Box>

      {/* Danh sách thiết bị */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device, index) => (
              <TableRow key={device.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{device.provider}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(device)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteDevice(device.id)}
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

      {/* Form thêm/sửa thiết bị */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentDevice?.id ? "Chỉnh sửa thiết bị" : "Thêm thiết bị"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên thiết bị"
            fullWidth
            margin="normal"
            value={currentDevice?.name || ""}
            onChange={(e) =>
              setCurrentDevice({ ...currentDevice, name: e.target.value })
            }
          />
          <TextField
            label="Loại thiết bị"
            fullWidth
            margin="normal"
            value={currentDevice?.type || ""}
            onChange={(e) =>
              setCurrentDevice({ ...currentDevice, type: e.target.value })
            }
          />
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            fullWidth
            value={currentDevice?.status || ""}
            onChange={(e) =>
              setCurrentDevice({ ...currentDevice, status: e.target.value })
            }
          >
            <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
            <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
            <MenuItem value="Bảo trì">Bảo trì</MenuItem>
          </Select>
          <TextField
            label="Nhà cung cấp"
            fullWidth
            margin="normal"
            value={currentDevice?.provider || ""}
            onChange={(e) =>
              setCurrentDevice({ ...currentDevice, provider: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveDevice}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDeviceManagement;
