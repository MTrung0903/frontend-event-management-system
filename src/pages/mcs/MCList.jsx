import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import axios from "axios";

import EmailOutlined from "@mui/icons-material/EmailOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import McAdd from "./MCAdd"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"; 
export const deleteMc= async (mcId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/man/mc/${mcId}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      return response.data;
    } catch (error) {
      console.error("Error delete provider:", error);
      throw error;
    }
  };
const McList = () => {
    const [mcList, setMcList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState({}); 
    const defaultImage = "path/to/default/image.jpg"; 
    const [openDialog, setOpenDialog] = useState(false);
  
    const fetchMcList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/man/mc", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        setMcList(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách MC:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMcList();
    }, []);
  
    useEffect(() => {
      const fetchImages = async () => {
        const urls = {};
        for (const mc of mcList) {
          if (mc.image) {
            try {
              const response = await axios.get(
                `http://localhost:8080/file/${mc.image}`,
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                  responseType: "blob",
                }
              );
              urls[mc.mcID] = URL.createObjectURL(response.data);
            } catch {
              urls[mc.mcID] = defaultImage;
            }
          } else {
            urls[mc.mcID] = defaultImage;
          }
        }
        setImageUrls(urls);
      };
  
      if (mcList.length > 0) fetchImages();
    }, [mcList]);
  
    const handleDialogOpen = () => {
      setOpenDialog(true);
    };
  
    const handleDialogClose = () => {
      setOpenDialog(false);
    };
    const handleDeleteMc = async (mcId) => {
        try {
          console.log(`Attempting to delete MC with ID: ${mcId}`); // Debug log
          await deleteMc(mcId);
          console.log(`Successfully deleted MC with ID: ${mcId}`); // Debug log
          setMcList((prevList) => prevList.filter(mc => mc.mcID !== mcId)); // Cập nhật lại danh sách
        } catch (error) {
          console.error("Error deleting MC:", error);
        }
      };
  return (
    <div style={{ padding: "20px" }}>
      <Box
        display="flex"
        justifyContent="end"
        mt="20px"
        marginBottom="20px"
        marginRight="10px"
      >
        <Button onClick={handleDialogOpen} type="submit" color="secondary" variant="contained" sx={{minHeight : 45, minWidth:30, backgroundColor: "#1c7de8", color:"#ffffff",  "&:hover": { backgroundColor: "#1565c0" },}}>
          Thêm MC
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {mcList.map((mc) => (
            <Grid item xs={12} sm={6} md={4} key={mc.mcID}>
              <Card>
                <Box sx={{ position: "relative" }}>
                     {/* Delete icon */}
                  <DeleteOutlined
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      cursor: "pointer",
                    
                    }}
                    onClick={() => handleDeleteMc(mc.mcID)} 
                  />
                  {/* Avatar tròn */}
                  <Box
                    component="img"
                    src={imageUrls[mc.mcID] || defaultImage}
                    alt={`${mc.mcName}'s avatar`}
                    sx={{
                      height: 80,
                      width: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 16,
                      left: 16,
                      border: "2px solid white",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  {/* Nội dung card */}
                  <CardContent sx={{ paddingTop: 8 }}>
                    {/* Tên MC */}
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", marginLeft: "96px" }}
                    >
                      {mc.mcName}
                    </Typography>

                    {/* Các tiêu đề với Icon */}
                    <Box display="flex" alignItems="center" marginTop={2}>
                      <EmailOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Email: {mc.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" marginTop={1}>
                      <BadgeOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Chức danh: {mc.title || "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" marginTop={1}>
                      <PhoneOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        SĐT: {mc.phone || "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" marginTop={1}>
                      <HomeOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Địa chỉ: {mc.address || "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" marginTop={1}>
                      <DescriptionOutlined
                        sx={{ fontSize: 20, marginRight: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Chi tiết: {mc.description || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
       {/* Dialog for adding MC */}
       <Dialog open={openDialog} onClose={handleDialogClose} sx={{ "& .MuiDialog-paper": { width: "800px", maxWidth: "none" } }} fullWidth>
        <DialogTitle>Thêm MC</DialogTitle>
        <DialogContent>
          <McAdd closeDialog={handleDialogClose} fetchMcList={fetchMcList} /> {/* Pass fetchMcList to McAdd */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default McList;
