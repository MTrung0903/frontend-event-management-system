import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";

// Tạo instance Axios với token
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/sponsor/",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

const SponsorDetail = () => {
  const { sponsorId } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Trạng thái cho popup edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null); // Preview new logo
  const [logoFile, setLogoFile] = useState(null); // New logo file

  const [logoUrl, setLogoUrl] = useState(null);
  const fetchSponsorDetail = async () => {
    try {
      const response = await axiosInstance.get(`/${sponsorId}`);
      const sponsorData = response.data.data;

      setSponsor(sponsorData);
      setFormData(sponsorData);

      // Tải logo
      if (sponsorData.sponsorLogo) {
        const logoResponse = await axios.get(
          `http://localhost:8080/file/${sponsorData.sponsorLogo}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            responseType: "blob",
          }
        );
        setLogoUrl(URL.createObjectURL(logoResponse.data));
        
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sponsor details:", err);
      setError("Unable to fetch sponsor details. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {


    if (sponsorId) fetchSponsorDetail();
  }, [sponsorId]);
  const [sponsorshipLevels, setSponsorshipLevels] = useState([]);

  // Fetch sponsorship levels from API
  useEffect(() => {
    const fetchSponsorshipLevels = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/man/sponsorship",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        //console.log(response.data.data)
        setSponsorshipLevels(response.data.data);
        //console.log("Data for dropdown:", sponsorshipLevels);
      } catch (error) {
        console.error("Error fetching sponsorship levels:", error);
      }
    };
    fetchSponsorshipLevels();
  }, []);

  // Xử lý khi nhấn nút "Edit Sponsor"
  const handleEditClick = () => setIsEditOpen(true);

  // Đóng popup
  const handleEditClose = () => {
    setIsEditOpen(false);
    setLogoPreview(null); // Reset logo preview
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý logo upload và preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file)); // Set preview URL
  };

  // Gửi dữ liệu cập nhật qua API
  const handleFormSubmit = async () => {
    const formDataToSubmit = new FormData();

    if (logoFile) {
      formDataToSubmit.append("logo", logoFile); // Append new logo
    } else {
      try {
      
        console.log(sponsor.sponsorLogo)
        const logoResponse =  await axios.get(`http://localhost:8080/file/${sponsor.sponsorLogo}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          responseType: "blob",
        });
        console.log(logoResponse.data)
        const imageBlob = new Blob([logoResponse.data], { type: logoResponse.data.type });
        const imageUrl = URL.createObjectURL(imageBlob);
        formDataToSubmit.append("logo", imageUrl);
        console.log(formDataToSubmit.get("logo"))
        console.log(imageUrl)
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    }

    formDataToSubmit.append("id", sponsorId); 
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("contact", formData.contact);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("website", formData.website);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("sponsorshipId", formData.sponsorshipId);
    formDataToSubmit.append("sponsorshipLevel", formData.sponsorshipLevel);

    try {
      console.log("=== Sending Request ===");
      const response = logoFile
        ? await axios.put("http://localhost:8080/man/sponsor", formDataToSubmit, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          })
        : await axios.put("http://localhost:8080/man/sponsor/updateNoLogo", formDataToSubmit, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          });

      console.log("Response:", response.data);
  

      setSponsor(formData);
      if (sponsorId) fetchSponsorDetail();
      setIsEditOpen(false);
      Swal.fire({
        title: "Update",
        text: "Cập nhật nhà tài trợ thành công",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error updating sponsor:", err);
      Swal.fire({
        title: "Update",
        text: "Cập nhật thất bại",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ maxWidth: "96%", marginLeft: "15px", padding: "20px" }}>
      {/* Logo nhà tài trợ */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${sponsor.name} logo`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #ddd",
            }}
          />
        ) : (
          <Typography style={{ fontStyle: "italic", color: "#777" }}>
            Ảnh không khả dụng
          </Typography>
        )}
      </div>

      {/* Tiêu đề chính */}
      <Typography
        variant="h4"
        style={{
          fontWeight: "700",
          color: "#212529",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {sponsor.name}
      </Typography>

      {/* Container thông tin nhà tài trợ */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            Liên hệ
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.contact}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            Email
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.email}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            SĐT
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.phone}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            Địa chỉ
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.address}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            Website
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.website}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>

        <div style={{ flex: "1 1 calc(50% - 20px)" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: "5px", fontSize: "16px" }}
          >
            Mức độ tài trợ
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={sponsor.sponsorshipLevel}
            InputProps={{
              style: { fontSize: "14px", background: "#fff" },
            }}
          />
        </div>
      </div>

      {/* Danh sách sự kiện tài trợ */}
      <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "10px",
          fontSize: "24px",
        }}
      >
        Danh sách sự kiện tài trợ
      </Typography>

      {/* Kiểm tra và hiển thị danh sách sự kiện */}
      {sponsor.listSponsorEvents && sponsor.listSponsorEvents.length > 0 ? (
        <Grid container spacing={3}>
          {sponsor.listSponsorEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <CardContent>
                  {/* Tên sự kiện */}
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: "600",
                      marginBottom: "15px",
                      fontSize: "1.25rem",
                    }}
                  >
                    {event.eventName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Không có sự kiện nào</Typography>
      )}
      {/* Nút chỉnh sửa */}
      <Button
        variant="contained"
        color="primary"
        style={{
          backgroundColor: "#0180CC",
          color: "#fff",
          fontSize: "15px",
          padding: "10px 15px",
          display: "block",
          margin: "40px 0 0 auto",
        }}
        onClick={handleEditClick} // Mở popup chỉnh sửa
      >
        Cập nhật
      </Button>

      {/* Dialog Form chỉnh sửa */}

      <Dialog
        open={isEditOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Chỉnh sửa thông tin nhà tài trợ
          <IconButton
            onClick={handleEditClose}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên nhà tài trợ"
            name="name"
            variant="outlined"
            value={formData.name || ""}
            onChange={handleFormChange}
            margin="dense"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Liên hệ"
            name="contact"
            variant="outlined"
            value={formData.contact || ""}
            onChange={handleFormChange}
            margin="dense"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={formData.email || ""}
            onChange={handleFormChange}
            margin="dense"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            variant="outlined"
            value={formData.phone || ""}
            onChange={handleFormChange}
            margin="dense"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            variant="outlined"
            value={formData.address || ""}
            onChange={handleFormChange}
            margin="dense"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            select
            label="Cấp độ tài trợ"
            name="sponsorshipLevel"
            variant="outlined"
            value={formData.sponsorshipLevel || ""}
            onChange={handleFormChange}
            margin="dense"
          >
            {sponsorshipLevels.map((level) => (
              <MenuItem key={level.sponsorShipID} value={level.level}>
                {level.level}
              </MenuItem>
            ))}
          </TextField>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleLogoChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              style={{ marginTop: "15px" }}
            >
              Tải lên logo mới
            </Button>
          </label>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SponsorDetail;
