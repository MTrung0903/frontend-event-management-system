import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Switch,
    Grid,
} from "@mui/material";

import './event.css'
import axios from "axios";
import { format } from 'date-fns';
const CreateEventForm = ({ onClose, eventId, event, eventImage, handleFetch }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        eventHost: "",
        eventStatus: "",
        eventDescription: "",
        image: "",
        eventLocation: "",
        eventStart: "",
        eventEnd: "",
        eventStatus: "",
        manId: "",
    });
    const token = localStorage.getItem("token");
    useEffect(() => {
        // Lấy ngày giờ hiện tại và chuyển thành định dạng 'yyyy-MM-ddThh:mm'
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 16); // Lấy đến phần ngày và giờ
        const formattedDateTime = format(new Date(formattedDate), "yyyy-MM-dd HH:mm:ss");
        setFormData({
            ...formData,
            eventStart: formattedDateTime,
        });
    }, []);
    useEffect(() => {
        //setSelectedImage(eventImage);
        if (event != null) {
            console.log(event);
            setFormData({
                eventName: event.eventName,
                eventType: event.eventType,
                eventHost: event.eventHost,
                eventStatus: event.eventStatus,
                eventDescription: event.eventDescription,
                image: eventImage,
                eventLocation: event.eventLocation,
                eventStart: event.eventStart,
                eventEnd: event.eventEnd,
                eventStatus: event.eventStatus,
                manId: event.manId,
            });
        }
        
    }, [event]);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0]; // Lấy file từ input
            setSelectedImage(URL.createObjectURL(file)); // Hiển thị ảnh preview
            setFormData((prev) => ({
                ...prev,
                image: file, // Gán file vào formData
            }));
        }
    };

    const handleChangeTime = (event) => {
        const { name, value } = event.target;
        const formattedDateTime = format(new Date(value), "yyyy-MM-dd HH:mm:ss");
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: formattedDateTime,
        }));

    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

    };
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // Lưu thông báo
    const [showDialog, setShowDialog] = useState(false); // Hiển thị dialog


    const handleSubmit = async (check) => {

        setMessage(""); // Reset thông báo
        const requiredFields = [
            "eventName", "eventType", "eventStart", "eventEnd", "eventLocation", "eventHost", "eventDescription"
        ];

        // Kiểm tra xem có trường nào chưa được điền
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            // Hiển thị thông báo lỗi cho các trường thiếu
            alert(`Vui lòng điền đầy đủ các trường: ${missingFields.join(", ")}`);
            return; // Dừng lại nếu có trường thiếu
        }

        // Kiểm tra thời gian bắt đầu và thời gian kết thúc
        const startTime = new Date(formData.eventStart);
        const endTime = new Date(formData.eventEnd);

        if (startTime >= endTime) {
            // Thời gian kết thúc phải sau thời gian bắt đầu
            alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
            return;
        }
        if (check) {
            formData.eventStatus = "Public";
        }
        else {
            formData.eventStatus = "Draft";
        }
        console.log(formData);
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // Lấy thông tin roles từ payload
            const userId = payload.userId || null;
            console.log(userId);
            formData.manId = userId;
            const data = new FormData();
            
            data.append("eventName", formData.eventName);
            data.append("eventType", formData.eventType);
            data.append("eventHost", formData.eventHost);
            data.append("eventStatus", formData.eventStatus);
            data.append("eventDescription", formData.eventDescription);
            data.append("image", formData.image); // `image` phải là một đối tượng File
            data.append("eventLocation", formData.eventLocation);
            data.append("eventStart", formData.eventStart);
            data.append("eventEnd", formData.eventEnd);
            data.append("manId", formData.manId);
            setLoading(true);
            try {
               
                if (event == null) {
                    const response = await axios.post(
                        "http://localhost:8080/man/event",
                        data,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: token,
                            },
                        }
                    );
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                }
                else {
                    data.append("eventId", eventId);
                    const response = await axios.put(
                        "http://localhost:8080/man/event",
                        data,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: token,
                            },
                        }
                    );
                    onClose();
                    handleFetch();
                }
            }
            catch (error) {
                setMessage("Tạo sự kiện thất bại");
                console.error("Lỗi khi thêm event:", error);
                setShowDialog(true); // Hiển thị dialog lỗi
            } finally {
                setLoading(false); // Tắt loading
            }
        }
    }



    return (

        <Box
            sx={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                {event == null ? "Tạo sự kiện" : "Cập nhật sự kiện"}
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Tiêu đề sự kiện và mô tả
            </Typography>

            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Tên sự kiện
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                placeholder="Tiêu đề sự kiện (ví dụ: Hội nghị công nghệ 2024)"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Loại sự kiện
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                <Select
                    name="eventType"  // Đảm bảo rằng tên của Select là `eventType` để phù hợp với formData
                    value={formData.eventType}
                    onChange={handleChange}
                >
                    <MenuItem value="default">Select</MenuItem>
                    <MenuItem value="conference">Hội nghị</MenuItem>
                    <MenuItem value="exhibition">Triển lãm</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="concert">Buổi buổi diễn</MenuItem>
                    <MenuItem value="liveMusic">Buổi hòa nhạc</MenuItem>
                    <MenuItem value="presentation">Giới thiệu sản phẩm</MenuItem>
                    <MenuItem value="tradeshow">Trình diễn</MenuItem>
                    <MenuItem value="seminar">Hội thảo</MenuItem>
                    <MenuItem value="ceremony">Lễ kỉ niểm</MenuItem>
                </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
                <Grid item xs={3}>
                    <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                        Bắt đầu
                        <span style={{ color: "red", marginLeft: 1 }}>*</span>
                    </Typography>
                    <TextField
                        type="datetime-local"
                        name="eventStart"
                        value={formData.eventStart}
                        onChange={handleChangeTime}
                        fullWidth
                        margin="normal"
                        sx={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                        Kết thúc
                        <span style={{ color: "red", marginLeft: 1 }}>*</span>
                    </Typography>
                    <TextField
                        type="datetime-local"
                        name="eventEnd"
                        value={formData.eventEnd}
                        onChange={handleChangeTime}
                        fullWidth
                        margin="normal"
                        sx={{ shrink: true }}
                    />

                </Grid>
            </Grid>
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Thêm ảnh sự kiện
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <Box
                sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    padding: 2,
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer",
                    marginTop: 2,

                }}
                onClick={() => document.getElementById("upload-image").click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    id="upload-image"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-image" variant="contained" color="primary" component="span">

                    Upload ảnh

                </label>
                {selectedImage && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            Xem trước:
                        </Typography>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                        />
                    </Box>
                )}
            </Box>
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Địa điểm
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                placeholder="Nhập địa điểm"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Chủ sự kiện
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>

            <TextField
                fullWidth
                placeholder="Nhập chủ sự kiện"
                name="eventHost"
                value={formData.eventHost}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Mô tả sự kiện
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Nhập thông tin chi tiết về sự kiện - chương trình nghị sự, diễn giả, thông tin nhà tài trợ, v.v."
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <Button variant="outlined" onClick={() => handleSubmit(false)}>Lưu bản nháp</Button>
                </div>
                <div>
                    <Button variant="contained" onClick={() => handleSubmit(true)} color="primary" sx={{
                        backgroundColor: "#1c7de8",
                        color: "white",
                        "&:hover": { backgroundColor: "#1565c0" },
                    }}>
                        Lưu
                    </Button>
                </div>
                {loading && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                        }}
                    >
                        <div
                            style={{
                                border: "4px solid #f3f3f3",
                                borderRadius: "50%",
                                borderTop: "4px solid #3498db",
                                width: "50px",
                                height: "50px",
                                animation: "spin 1s linear infinite",
                            }}
                        ></div>
                    </div>
                )}
                {showDialog && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 10000,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                textAlign: "center",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p>{message}</p>
                            <button
                                onClick={() => setShowDialog(false)} // Đóng dialog
                                style={{
                                    marginTop: "10px",
                                    padding: "10px 20px",
                                    backgroundColor: "#3498db",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </Box>

        </Box>
    );
};

export default CreateEventForm;
