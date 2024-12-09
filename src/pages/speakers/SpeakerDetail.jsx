import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
    CardMedia
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Tạo instance Axios với token
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/man/speaker/",
    headers: {
        Authorization: localStorage.getItem("token"),
    },
});

const SpeakerDetail = () => {
    const { speakerId } = useParams();
    const [speaker, setSpeaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    // Trạng thái cho popup edit
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchSpeakerDetail = async () => {
            try {
                const response = await axiosInstance.get(`/${speakerId}`);
                const speakerData = response.data.data;

                setSpeaker(speakerData);
                setFormData(speakerData);

                // Tải hình ảnh nếu có
                if (speakerData.image) {
                    const imageResponse = await axios.get(`http://localhost:8080/file/${speakerData.image}`, {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                        responseType: 'blob',
                    });
                    setImageUrl(URL.createObjectURL(imageResponse.data));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching speaker details:", err);
                setError("Unable to fetch speaker details. Please try again later.");
                setLoading(false);
            }
        };

        if (speakerId) fetchSpeakerDetail();
    }, [speakerId]);

    // Xử lý khi nhấn nút "Edit Speaker"
    const handleEditClick = () => setIsEditOpen(true);

    // Đóng popup
    const handleEditClose = () => setIsEditOpen(false);

    // Xử lý thay đổi form
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Gửi dữ liệu cập nhật qua API
    const handleFormSubmit = async () => {
        const formDataToSubmit = new FormData();
        // Thêm hình ảnh nếu có thay đổi
        if (imageUrl) {
            formDataToSubmit.append("image", imageUrl);
        }

        // Thêm các dữ liệu khác từ form
        formDataToSubmit.append("id", speakerId); // Đảm bảo truyền đúng id
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("title", formData.title);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("phone", formData.phone);
        formDataToSubmit.append("address", formData.address);
        formDataToSubmit.append("description", formData.description);
        formDataToSubmit.append("imageSpeaker", formData.imageUrl);
        try {
            await axios.put("http://localhost:8080/man/speaker", formDataToSubmit, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("token"),
                },
            });

            setSpeaker(formData);
            setIsEditOpen(false);
            alert("Speaker updated successfully!");
        } catch (err) {
            console.error("Error updating speaker:", err);
            alert("Failed to update speaker. Please try again.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <div style={{ maxWidth: "96%", marginLeft: "15px", padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${speaker.name} image`}
                        style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                    />
                ) : (
                    <Typography>Ảnh không khả dụng</Typography>
                )}
            </div>

            {/* Tiêu đề chính */}
            <Typography
                variant="h4"
                style={{
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "left",
                    marginBottom: "20px",
                    fontSize: "32px",
                }}
            >
                {speaker.name}
            </Typography>

            {/* Thông tin diễn giả */}
            <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Chức danh
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={speaker.title}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Email
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={speaker.email}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        SĐT
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={speaker.phone}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Địa chỉ
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={speaker.address}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Chi tiết
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={speaker.description}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>
            </div>

            {/* Danh sách sự kiện diễn giả tham gia */}
           

           

            {/* Nút Edit */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleEditClick}
                style={{ marginTop: "20px" }}
            >
                Cập nhật diễn giả
            </Button>

            {/* Popup Edit */}
            <Dialog open={isEditOpen} onClose={handleEditClose}>
                <DialogTitle>Cập nhật diễn giả</DialogTitle>
                <DialogContent>
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt="Diễn Giả Image Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      margin: "0",
                    }}
                    />
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        variant="outlined"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        variant="outlined"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "10px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleFormSubmit}
                        color="primary"
                        variant="contained"
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SpeakerDetail;
