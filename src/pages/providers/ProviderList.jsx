import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ProviderAddForm from "./ProviderAdd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/provider",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get();
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleProviderAdded = () => {
    fetchProviders();
    setIsDialogOpen(false);
  };

  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setSelectedProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProvider(null);
  };

  const handleViewDetail = () => {
    navigate(`/providers/${selectedProvider.id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/providers/${selectedProvider.id}/edit`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/${selectedProvider.id}`);
      setProviders((prev) =>
        prev.filter((prov) => prov.id !== selectedProvider.id)
      );
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
    handleMenuClose();
  };

  const columns = [
    { field: "name", headerName: "Tên nhà cung cấp dịch vụ", width: 250 },
    { field: "contact", headerName: "Người liên hệ", width: 230 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "SĐT", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%", marginLeft: "10px" }}>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "left",
          marginBottom: "20px",
          fontSize: "32px",
          marginRight: "auto",
        }}
      >
        Danh nhà cung cấp dịch vụ
      </Typography>
      <Box
        display="flex"
        justifyContent="end"
        mt="20px"
        marginBottom="20px"
        marginRight="10px"
      >
        <Button
          onClick={handleDialogOpen}
          color="secondary"
          variant="contained"
          sx={{minHeight : 45, backgroundColor: "#1c7de8", color:"#ffffff",  "&:hover": { backgroundColor: "#1565c0" }, marginRight: 2}}
        >
          Thêm nhà cung cấp dịch vụ
        </Button>
      </Box>
      <DataGrid
        rows={providers}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetail}>Chi tiết</MenuItem>
        <MenuItem onClick={handleEdit}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose} 
        sx={{
          "& .MuiDialog-paper": {
            width: "900px", 
            maxWidth: "none", 
          },
        }}
        fullWidth
      >
        <DialogTitle>Thêm nhà cung cấp dịch vụ</DialogTitle>
        <DialogContent>
        <ProviderAddForm onClose={handleDialogClose} onProviderAdded={handleProviderAdded} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProviderList;
