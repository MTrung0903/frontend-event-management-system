import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/mc/",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

const McDetail = () => {
  const { mcId } = useParams();
  const [mc, setMc] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });


  const fetchMcDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${mcId}`);
      const mcData = response.data.data;

      setMc(mcData);
      setFormData(mcData);

      if (mcData.image) {
        const imageResponse = await axios.get(
          `http://localhost:8080/file/${mcData.image}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            responseType: "blob",
          }
        );
        setImageUrl(URL.createObjectURL(imageResponse.data));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mc details:", err);
      setError("Không thể tải thông tin diễn giả. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mcId) fetchMcDetail();
  }, [mcId]);

  const handleEditClick = () => {
    setImagePreview(imageUrl); 
    setSelectedFile(null); 
    setIsEditOpen(true); 
  };
  
  const handleEditClose = () => setIsEditOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setNotification({
          open: true,
          message: "Vui lòng chọn một tệp hình ảnh!",
          severity: "error",
        });
        return;
      }
      setSelectedFile(file); // Lưu file vào state
      setImagePreview(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
    }
  };


  
  const handleFormSubmit = async () => {
      const formDataToSubmit = new FormData();
  
      console.log("=== Debugging Form Submission ===");
  
      // Check if selectedFile exists
      if (selectedFile) {
        formDataToSubmit.append("imageMc", selectedFile);
      } else {
        try {
          // Fetch hình ảnh từ API nếu selectedFile không tồn tại
          const imageResponse = await axios.get(`http://localhost:8080/file/${mc.image}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            responseType: "blob",
          });
  
          const imageBlob = new Blob([imageResponse.data], { type: imageResponse.data.type });
          const imageUrl = URL.createObjectURL(imageBlob);
          formDataToSubmit.append("imageMc", imageUrl); // Append imageUrl cho updateNoImage
        } catch (err) {
          console.error("Error fetching image:", err);
        }
      }
  
      // Append other form data
      formDataToSubmit.append("mcID", mcId || "");
      formDataToSubmit.append("mcName", formData.mcName || "");
      formDataToSubmit.append("title", formData.title || "");
      formDataToSubmit.append("email", formData.email || "");
      formDataToSubmit.append("phone", formData.phone || "");
      formDataToSubmit.append("address", formData.address || "");
      formDataToSubmit.append("description", formData.description || "");
  
      // Log formDataToSubmit content
      console.log("=== FormDataToSubmit Content ===");
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      try {
        console.log("=== Sending Request ===");
        const response = selectedFile
          ? await axios.put("http://localhost:8080/man/mc", formDataToSubmit, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: localStorage.getItem("token"),
              },
            })
          : await axios.put("http://localhost:8080/man/mc/updateNoImage", formDataToSubmit, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: localStorage.getItem("token"),
              },
            });
  
        console.log("Response:", response.data);
  
        setMc(formData); // Cập nhật dữ liệu hiển thị
        setIsEditOpen(false); // Đóng form
  
        Swal.fire({
          title: "Thành công",
          text: "Cập nhật diễn giả thành công!",
          icon: "success",
          confirmButtonText: "OK",
        });
        await fetchMcDetail()
      } catch (err) {
        console.error("Error updating mc:", err);
  
        Swal.fire({
          title: "Thất bại",
          text: "Cập nhật diễn giả thất bại. Vui lòng thử lại!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
  };
  
  

  const closeNotification = () => setNotification({ ...notification, open: false });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: "96%", margin: "20px auto", padding: "20px" }}>
              <IconButton sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon fontSize="large" sx={{ color: "#42D2EC" }} />
      </IconButton>
      <Card sx={{ display: "flex", alignItems: "flex-start", padding: "20px", boxShadow: 3, borderRadius: "10px" }}>
        <CardMedia
          component="img"
          image={imageUrl || "https://via.placeholder.com/150"}
          alt={`${mc.mcName} image`}
          sx={{ width: "150px", height: "150px", borderRadius: "8px", objectFit: "cover", marginRight: "20px" }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
            {mc.mcName}
          </Typography>
          <Typography variant="body1"><strong>Chức danh:</strong> {mc.title}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {mc.email}</Typography>
          <Typography variant="body1"><strong>SĐT:</strong> {mc.phone}</Typography>
          <Typography variant="body1"><strong>Địa chỉ:</strong> {mc.address}</Typography>
          <Typography variant="body1"><strong>Chi tiết:</strong> {mc.description}</Typography>
          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick} sx={{ marginTop: "20px" }}>
            Cập nhật MC
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Cập nhật MC</DialogTitle>
        <DialogContent>
          {[
            { label: "Tên", name: "mcName", value: formData.mcName || "" },
            { label: "Chức danh", name: "title", value: formData.title || "" },
            { label: "Email", name: "email", value: formData.email || "" },
            { label: "Số điện thoại", name: "phone", value: formData.phone || "" },
            { label: "Địa chỉ", name: "address", value: formData.address || "" },
            { label: "Chi tiết", name: "description", value: formData.description || "" },
          ].map((field, index) => (
            <TextField
              key={index}
              fullWidth
              label={field.label}
              variant="outlined"
              name={field.name}
              value={field.value}
              onChange={handleFormChange}
              sx={{ marginBottom: "15px" }}
            />
          ))}

          {imagePreview ? (
            <img src={imagePreview} alt="Preview" style={{ width: "150px", borderRadius: "8px", marginBottom: "15px" }} />
          ) : (
            <Typography>Chưa chọn hình ảnh</Typography>
          )}

          <Button variant="outlined" component="label" sx={{ marginBottom: "15px" }}>
            Chọn hình ảnh
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary" variant="outlined">Hủy</Button>
          <Button onClick={handleFormSubmit} color="primary" variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={closeNotification}>
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default McDetail;
