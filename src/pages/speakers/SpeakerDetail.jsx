import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/speaker/",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

const SpeakerDetail = () => {
  const { speakerId } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const fetchSpeakerDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${speakerId}`);
      const speakerData = response.data.data;

      setSpeaker(speakerData);
      setFormData(speakerData);

      if (speakerData.image) {
        const imageResponse = await axios.get(
          `http://localhost:8080/file/${speakerData.image}`,
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
      console.error("Error fetching speaker details:", err);
      setError("Không thể tải thông tin diễn giả. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (speakerId) fetchSpeakerDetail();
  }, [speakerId]);

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
      setSelectedFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleFormSubmit = async () => {
    const formDataToSubmit = new FormData();

    if (selectedFile) {
      formDataToSubmit.append("imageSpeaker", selectedFile);
    } else {
      try {
        const imageResponse = await axios.get(`http://localhost:8080/file/${speaker.image}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          responseType: "blob",
        });

        const imageBlob = new Blob([imageResponse.data], { type: imageResponse.data.type });
        const imageUrl = URL.createObjectURL(imageBlob);
        formDataToSubmit.append("imageSpeaker", imageUrl);
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    }

    formDataToSubmit.append("id", speakerId || "");
    formDataToSubmit.append("name", formData.name || "");
    formDataToSubmit.append("title", formData.title || "");
    formDataToSubmit.append("email", formData.email || "");
    formDataToSubmit.append("phone", formData.phone || "");
    formDataToSubmit.append("address", formData.address || "");
    formDataToSubmit.append("description", formData.description || "");

    try {
      const response = selectedFile
        ? await axios.put("http://localhost:8080/man/speaker", formDataToSubmit, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          })
        : await axios.put("http://localhost:8080/man/speaker/updateNoImage", formDataToSubmit, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          });

      setSpeaker(formData); 
      setIsEditOpen(false); 

      Swal.fire({
        title: "Thành công",
        text: "Cập nhật diễn giả thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      await fetchSpeakerDetail()
    } catch (err) {
      console.error("Error updating speaker:", err);

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
          alt={`${speaker.name} image`}
          sx={{ width: "150px", height: "150px", borderRadius: "8px", objectFit: "cover", marginRight: "20px" }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
            {speaker.name}
          </Typography>
          <Typography variant="body1"><strong>Chức danh:</strong> {speaker.title}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {speaker.email}</Typography>
          <Typography variant="body1"><strong>SĐT:</strong> {speaker.phone}</Typography>
          <Typography variant="body1"><strong>Địa chỉ:</strong> {speaker.address}</Typography>
          <Typography variant="body1"><strong>Chi tiết:</strong> {speaker.description}</Typography>
          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick} sx={{ marginTop: "20px" }}>
            Cập nhật diễn giả 
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Cập nhật diễn giả</DialogTitle>
        <DialogContent>
          {[
            { label: "Tên", name: "name", value: formData.name || "" },
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

export default SpeakerDetail;
