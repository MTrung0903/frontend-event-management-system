import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  TextField,
  Box,
  Button,
  Typography,
} from "@mui/material";
import {  Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SponsorAdd from "./SponsorAdd";


const defaultImage = "path/to/default/image.jpg"; 
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/sponsor", 
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});
export const deleteSponsor = async (sponsorId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/sponsor/${sponsorId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete provider:", error);
    throw error;
  }
};
const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredSponsors, setFilteredSponsors] = useState([]); 
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  
  const fetchSponsors = async () => {
    try {
      const response = await axiosInstance.get();
      setSponsors(response.data.data || []);
      setFilteredSponsors(response.data.data || []); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách Sponsor:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    

    fetchSponsors();
  }, []);

  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = sponsors.filter(
      (sponsor) =>
        sponsor.name.toLowerCase().includes(value.toLowerCase()) ||
        sponsor.contact.toLowerCase().includes(value.toLowerCase()) ||
        sponsor.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSponsors(filtered);
  };

  // Fetch ảnh của nhà tài trợ
  useEffect(() => {
    const fetchImages = async () => {
      const urls = {};
      for (const sponsor of sponsors) {
        if (sponsor.sponsorLogo) {
          try {
            const response = await axios.get(
              `http://localhost:8080/file/${sponsor.sponsorLogo}`,
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
                responseType: "blob",
              }
            );
            urls[sponsor.id] = URL.createObjectURL(response.data);
          } catch {
            urls[sponsor.id] = defaultImage;
          }
        } else {
          urls[sponsor.id] = defaultImage;
        }
      }
      setImageUrls(urls);
    };

    if (sponsors.length > 0) fetchImages();
  }, [sponsors]);

  const handleMenuOpen = (event, sponsor) => {
    setAnchorEl(event.currentTarget);
    setSelectedSponsor(sponsor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSponsor(null);
  };

  const handleViewDetail = () => {
    handleMenuClose();
    navigate(`/sponsors/${selectedSponsor.id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/${selectedSponsor.id}`);
      alert("Sponsor deleted successfully");

      // Fetch lại danh sách sponsors sau khi xóa thành công
      setLoading(true); // Hiển thị loading trong khi đợi dữ liệu mới
      const response = await axiosInstance.get();
      setSponsors(response.data.data || []);
      setFilteredSponsors(response.data.data || []);
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      alert("Failed to delete sponsor. Please try again later.");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
    handleMenuClose(); // Đóng menu khi hoàn thành thao tác
  };

  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      renderCell: (params) => (
        <img
          src={imageUrls[params.row.id] || defaultImage}
          alt={`${params.row.name}'s logo`}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "name", headerName: "Sponsor Name", width: 200 },
    { field: "contact", headerName: "Contact Person", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Typography variant="h4" style={{ fontWeight: "bold", color: "#3f51b5", textAlign: "left", marginBottom: "20px" }}>
        Danh sách nhà tài trợ
      </Typography>
      <Box display="flex" justifyContent="space-between" mb="20px">
        <TextField
          label="Search Sponsor"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            marginBottom: "10px",
            width: "300px",
            "& .MuiInputBase-root": {
              height: "50px",
            },
            "& .MuiInputLabel-root": {
              top: "50%",
              transform: "translateY(-50%)",
              left: "10px",
              transition: "all 0.2s ease-out",
            },
            "& .MuiInputLabel-shrink": {
              top: "-17px",
              transform: "translateY(0)",
            },
          }}
        />
         <Button onClick={handleDialogOpen}type="submit"
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#1c7de8",
              color: "#ffffff",
              fontWeight: "bold",
              maxHeight: 45,
              "&:hover": { backgroundColor: "#1565c0" },
            }}>
          Thêm nhà tài trợ
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ height: 390, width: '100%' }}>
            <DataGrid
              rows={filteredSponsors}
              columns={columns}
              getRowId={(row) => row.id}
              pagination
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </div>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleViewDetail}>Xem chi tiết</MenuItem>
            <MenuItem onClick={handleDelete}>Xóa</MenuItem>
          </Menu>
        </>
      )}
      {/* Dialog for adding Sponsor */}
      <Dialog open={openDialog} onClose={handleDialogClose} sx={{ "& .MuiDialog-paper": { width: "800px", maxWidth: "none" } }} fullWidth>
        <DialogTitle>Thêm nhà tài trợ</DialogTitle>
        <DialogContent>
          <SponsorAdd closeDialog={handleDialogClose}  fetchSponsors ={fetchSponsors}/> {/* Pass fetchMcList to McAdd */}
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

export default SponsorList;
