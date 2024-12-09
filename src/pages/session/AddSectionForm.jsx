import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    Grid,
    Typography,
    FormGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    Input,
    IconButton,
} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from "axios";
import SpeakerAdd from './AddSpeakerForm';
import { useParams } from "react-router-dom";
const AddSectionForm = ({ id, onAdd, openEdit, onClose }) => {
    const { eventId } = useParams();
    const [open, setOpen] = useState(false);
    const [speakers, setSpeakers] = useState([]);
    const [formData, setFormData] = useState({
        startTime: "09:00",
        startPeriod: "AM",
        endTime: "10:00",
        endPeriod: "AM",
        sectionTitle: "",
        sectionDescription: "",
        eventId: eventId,
        speakerId: null,
    });
    // Mở/đóng popup chính
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setFormData({
            startTime: "09:00",
            startPeriod: "AM",
            endTime: "10:00",
            endPeriod: "AM",
            sectionTitle: "",
            sectionDescription: "",
            eventId,
            speakerId: null,
        });
        setOpen(false);
        onClose();
    }

    // Cập nhật giá trị form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    // Gửi form lên server
    const handleSubmit = async () => {
        if (!formData.sectionTitle || !formData.speakerId) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (!file){
            alert("Chưa có file tàil iệu.");
        }
        const convertTo24HourFormat = (time, period) => {
            let [hour, minute] = time.split(":").map(Number);
            if (period === "PM" && hour !== 12) hour += 12;
            if (period === "AM" && hour === 12) hour = 0;
            return hour * 60 + minute;
        };

        const startTimeInMinutes = convertTo24HourFormat(formData.startTime, formData.startPeriod);
        const endTimeInMinutes = convertTo24HourFormat(formData.endTime, formData.endPeriod);

        if (endTimeInMinutes <= startTimeInMinutes) {
            alert("Thời gian kết thúc phải muộn hơn thời gian bắt đầu.");
            return;
        }

        const formattedStartTime = `${formData.startTime} ${formData.startPeriod}`;
        const formattedEndTime = `${formData.endTime} ${formData.endPeriod}`;
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("startTime", formattedStartTime);
        formDataToSend.append("endTime", formattedEndTime);
        formDataToSend.append("sectionTitle", formData.sectionTitle);
        formDataToSend.append("sectionDescription", formData.sectionDescription);
        formDataToSend.append("eventId", formData.eventId);
        formDataToSend.append("speakerId", formData.speakerId);
        try {
            let response;
            if (id != null) {
                formDataToSend.append("sectionId", id);
                response = await axios.put("http://localhost:8080/man/section", formDataToSend, {
                    headers: { Authorization: localStorage.getItem("token") },
                    "Content-Type": "multipart/form-data" // Đảm bảo header đúng cho gửi file
                });
            } else {
                response = await axios.post("http://localhost:8080/man/section", formDataToSend, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "multipart/form-data" // Đảm bảo header đúng cho gửi file
                    },
                });
                onAdd(response.data.data)
            }
            alert("Section saved successfully!");
            handleClose();
        } catch (error) {
            console.error("Error saving section:", error);
            alert("Failed to save section. Please try again later.");
        }
    };

    const fetchSpeakers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/man/speaker", {
                headers: {
                    Authorization: localStorage.getItem("token")
                },
            });
            const speakersData = Array.isArray(response.data.data) ? response.data.data : [];
            setSpeakers(speakersData); // Gán đúng mảng speakers
        } catch (error) {
            console.error("Lỗi khi tải danh sách speakers:", error);
        }
    };
    const fetchSection = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/man/section/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const sectionData = response.data.data;

            if (sectionData) {
                // Chuyển đổi thời gian từ "HH:mm:ss" thành "HH:mm"
                const formatTime = (time) => {
                    const [hours, minutes] = time.split(':');
                    return `${hours}:${minutes}`;
                };

                // Chuyển đổi thời gian thành AM/PM
                const formatPeriod = (time) => {
                    const [hours] = time.split(':');
                    return parseInt(hours) >= 12 ? 'PM' : 'AM';
                };

                // Cập nhật formData với dữ liệu từ API
                setFormData((prevState) => ({
                    ...prevState,
                    startTime: formatTime(sectionData.startTime) || "09:00",
                    startPeriod: formatPeriod(sectionData.startTime) || "AM",
                    endTime: formatTime(sectionData.endTime) || "10:00",
                    endPeriod: formatPeriod(sectionData.endTime) || "AM",
                    sectionTitle: sectionData.sectionTitle || "",
                    sectionDescription: sectionData.sectionDescription || "",
                    eventId: sectionData.eventId || eventId,
                    speakerId: String(sectionData.speakerId) || null,
                }));

                console.log(formData);
            } else {
                console.error("Không có dữ liệu section.");
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin section:", error);
        }
    };
    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 0; hour <= 12; hour++) {
            for (let minute = 0; minute < 60; minute += 5) {
                const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                times.push(time);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();
    useEffect(() => {
        if (openEdit) {
            fetchSection();
            setOpen(true);
        }
        fetchSpeakers();
    }, [openEdit]);

    const [file, setFile] = useState(null);

    // Xử lý khi người dùng chọn file
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    
    const handleRemoveFile = () => {
        setFile(null);  // Xóa file
    };
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {/* Nút mở popup chính */}
            <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{
                    backgroundColor: "#1c7de8",
                    color: "white",
                    "&:hover": { backgroundColor: "#1565c0" },
                }}
            >
                Tạo lịch
            </Button>

            {/* Popup chính */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ color: "#4c4c4c", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>Section Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Start Time */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                    Thời gian bắt đầu
                                    <span style={{ color: "red", marginLeft: 1 }}>*</span>
                                </Typography>
                                <Select name="startTime" value={formData.startTime} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    {timeSlots.map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", visibility: "hidden" }}>Start period</Typography>
                                <Select name="startPeriod" value={formData.startPeriod} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    <MenuItem value="AM">AM</MenuItem>
                                    <MenuItem value="PM">PM</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* End Time */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                Thời gian kết thúc
                                    <span style={{ color: "red", marginLeft: 1 }}>*</span>
                                </Typography>
                                <Select name="endTime" value={formData.endTime} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    {timeSlots.map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", visibility: "hidden" }}>End period</Typography>
                                <Select name="endPeriod" value={formData.startPeriod} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    <MenuItem value="AM">AM</MenuItem>
                                    <MenuItem value="PM">PM</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Section Title */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                Tiêu đề
                                <span style={{ color: "red", marginLeft: 1 }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="sectionTitle"
                                value={formData.sectionTitle}
                                onChange={handleChange}
                                sx={{ marginTop: 1 }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: "#9b9b9b" }}>Description</Typography>
                            <TextField
                                fullWidth
                                name="sectionDescription"
                                value={formData.sectionDescription}
                                multiline
                                onChange={handleChange}
                                sx={{ marginTop: 1 }}
                            />
                        </Grid>

                        {/* Speaker Section */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset" sx={{ marginTop: 2, border: 1, borderColor: "#d1d1d1", borderRadius: 2, minHeight: 100, minWidth: 535 }}>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", margin: 2 }}>Speaker/Presenter(s)</Typography>
                                <FormGroup
                                    sx={{
                                        border: 1,
                                        borderColor: "#d1d1d1",
                                        marginTop: 0,
                                        marginLeft: 2,
                                        marginBottom: 0,
                                        marginRight: 2,
                                        bgcolor: "#f9f9f9",
                                        minHeight: 140,
                                        maxHeight: 140,
                                        minWidth: 500,
                                        overflow: "auto",
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    {speakers.map((speaker) => (
                                        <FormControlLabel
                                            sx={{
                                                marginTop: 1,
                                                marginLeft: 1,
                                                maxHeight: 25
                                            }}
                                            key={speaker.id}
                                            control={
                                                <Radio
                                                    checked={formData.speakerId === String(speaker.id)}
                                                    onChange={handleChange}
                                                    value={speaker.id.toString()}
                                                    name="speakerId"
                                                    sx={{
                                                        "&.Mui-checked": {
                                                            color: "#0093dd",
                                                        },
                                                    }}
                                                />
                                            }
                                            label={speaker.name}

                                        />
                                    ))}
                                </FormGroup>
                                <SpeakerAdd onAdd={fetchSpeakers} />
                            </FormControl>
                        </Grid>
                        <Grid container spacing={3} sx={{ margin: 1 }}>
                            {/* Các trường khác trong form */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", marginBottom: 1 }}>
                                    Upload file 
                                </Typography>

                                {/* Hiển thị nút "Choose File" khi chưa chọn file */}
                                {!file && (
                                    <label htmlFor="file-upload">
                                        <Input
                                            type="file"                                            
                                            id="file-upload"
                                            inputProps={{ accept: ".pdf, .docx, .pptx, .ppt, .doc" }}
                                            onChange={handleFileChange}
                                            sx={{ display: "none",  }}  // Ẩn Input, chỉ hiển thị dưới dạng button
                                        />
                                        <Button variant="contained" component="span" sx={{ backgroundColor: "#109c7b" }}>
                                            Chọn file
                                        </Button>
                                    </label>
                                )}

                                {/* Hiển thị tên file và icon "X" khi đã chọn file */}
                                {file && (
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Typography variant="body1" sx={{ marginRight: 2 }}>
                                            File đã chọn: {file.name}
                                        </Typography>
                                        <IconButton onClick={handleRemoveFile} color="error">
                                            <CloseOutlinedIcon />
                                        </IconButton>
                                    </div>
                                )}


                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#1c7de8",
                            "&:hover": { backgroundColor: "#1565c0" },
                        }}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddSectionForm;
