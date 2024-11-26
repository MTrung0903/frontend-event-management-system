import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, CircularProgress, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// URL mặc định nếu không có ảnh
const defaultImage = 'path/to/default/image.jpg'; // Thay bằng đường dẫn ảnh mặc định
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/man/sponsor', // Base URL của Spring Boot (đổi thành sponsor)
  headers: {
    Authorization: 'Bearer YOUR_TOKEN'
  },
});

const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State tìm kiếm
  const [filteredSponsors, setFilteredSponsors] = useState([]); // Danh sách đã lọc
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data sponsors từ API
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/man/sponsor', {
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw'
          },
        });
        setSponsors(response.data.data || []);
        setFilteredSponsors(response.data.data || []); // Lưu dữ liệu đã tải vào danh sách lọc
      } catch (error) {
        console.error('Lỗi khi tải danh sách Sponsor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Hàm lọc danh sách nhà tài trợ dựa trên từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = sponsors.filter((sponsor) =>
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
            const response = await axios.get(`http://localhost:8080/file/${sponsor.sponsorLogo}`, {
              headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw'
              },
              responseType: 'blob',
            });
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

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/sponsors/${selectedSponsor.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/${selectedSponsor.id}`);
      alert("Sponsor deleted successfully");
      setSponsors((prev) => prev.filter((sp) => sp.id !== selectedSponsor.id));
    } catch (error) {
      console.error("Error deleting sponsor:", error);
    }
    handleMenuClose();
  };

  const columns = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 100,
      renderCell: (params) => (
        <img
          src={imageUrls[params.row.id] || defaultImage}
          alt={`${params.row.name}'s logo`}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ),
    },
    { field: 'name', headerName: 'Sponsor Name', width: 200 },
    { field: 'contact', headerName: 'Contact Person', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    }
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: '#333', textAlign: 'left', marginBottom: '20px' }}>
        LIST SPONSORS
      </Typography>

      {/* Thêm ô tìm kiếm */}


      <Box display="flex" justifyContent="space-between" mt="20px" marginBottom="20px" marginRight="10px">
        <TextField label="Search Sponsor" variant="outlined" value={searchTerm} onChange={handleSearchChange}
          sx={{
            marginBottom: '10px',
            width: '300px',
            '& .MuiInputBase-root': {
              height: '50px',
            },
            '& .MuiInputLabel-root': {
              top: '50%',
              transform: 'translateY(-50%)',
              left: '10px',
              transition: 'all 0.2s ease-out',
            },
            '& .MuiInputLabel-shrink': {
              top: '-17px',
              transform: 'translateY(0)',
            },
          }}
        />

        <Link to="/sponsors/SponsorAdd" style={{ textDecoration: 'none' }}>
          <Button type="submit" color="secondary" variant="contained">
            Add Sponsor
          </Button>
        </Link>
      </Box>


      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <DataGrid
            rows={filteredSponsors}
            columns={columns}
            getRowId={(row) => row.id}
            pagination 
            pageSize={5} 
            rowsPerPageOptions={[5, 10, 20]}
          />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleViewDetail}>View Detail</MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

export default SponsorList;
