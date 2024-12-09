import React, { useState, forwardRef } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Grid,
    Typography,
    Card,
    CardMedia,
    CircularProgress,
    IconButton,
    Slide
} from "@mui/material";
import axios from "axios";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import { useNavigate } from "react-router-dom";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const SpeakerAdd = ({ onAdd }) => {
    const [open, setOpen] = useState(false); // Popup chính
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    // Mở/đóng popup chính
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (
            !name ||
            !email ||
            !title ||
            !phone ||
            !address ||
            !description ||
            !image
        ) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("title", title);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("description", description);
        formData.append("imageSpeaker", image);
        formData.append("image", imageName);

        setLoading(true);
        try {
            console.log(formData);
            const response = await axios.post(
                "http://localhost:8080/man/speaker",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log("API Response:", response);

            if (response.data.data === true) {
                alert("Thêm diễn giả thành công!");
                setName("");
                setEmail("");
                setTitle("");
                setPhone("");
                setAddress("");
                setDescription("");
                setImage(null);
                setImagePreview(null);
                if (onAdd) {
                    onAdd();
                }
            }


        } catch (error) {
            console.error("Lỗi khi thêm diễn giả:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div >
            <Button
                variant="text"
                onClick={handleClickOpen}
                sx={{
                    marginTop: 1,
                    color: "#4e9ad3",
                    textDecoration: "underline",
                    justifyContent: "flex-start",
                    margin: 1,
                    width: "min-content",
                    whiteSpace: "nowrap",
                    "&:hover": { backgroundColor: "#ffffff" },
                }}

            >
                Thêm diễn giả
            </Button>
            <Dialog
                open={open} onClose={handleClose}
                TransitionComponent={Transition}
                sx={{
                    "& .MuiDialog-paper": {
                        position: "absolute",
                        top: "50%",
                        right: "0%",
                        transform: "translateY(-50%)",
                        margin: 0,
                    },
                }}
            >
                <DialogTitle sx={{ color: "#4c4c4c", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>Speaker Details</DialogTitle>
                <DialogContent>
                    <Card
                        style={{
                            padding: "30px",
                            borderRadius: "15px",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <form>
                            {imagePreview ? (
                                <div style={{ textAlign: "left", marginBottom: "20px" }}>
                                    <CardMedia
                                        component="img"
                                        image={imagePreview}
                                        alt="Ảnh xem trước diễn giả"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            margin: "0",
                                        }}
                                    />
                                    <label htmlFor="image-upload">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<PersonAddOutlinedIcon />}
                                            style={{
                                                marginTop: "10px",
                                                backgroundColor: "#3f51b5",
                                                color: "#ffffff",
                                            }}
                                        >
                                            Chọn Ảnh
                                        </Button>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                        id="image-upload"
                                    />
                                    <Typography
                                        variant="body2"
                                        align="left"
                                        style={{ marginTop: "10px" }}
                                    >
                                        {imageName}
                                    </Typography>
                                </div>
                            ) : (
                                <div style={{ textAlign: "left", marginBottom: "20px" }}>
                                    <label htmlFor="image-upload">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<PersonAddOutlinedIcon />}
                                            style={{
                                                marginTop: "10px",
                                                backgroundColor: "#3f51b5",
                                                color: "#ffffff",
                                            }}
                                        >
                                            Chọn Ảnh
                                        </Button>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                        id="image-upload"
                                    />
                                </div>
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tên Diễn Giả"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Chức Danh"
                                        variant="outlined"
                                        fullWidth
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Số Điện Thoại"
                                        variant="outlined"
                                        fullWidth
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Địa Chỉ"
                                        variant="outlined"
                                        fullWidth
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Chi tiết"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    style={{ display: "flex", justifyContent: "flex-end" }}
                                >
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{
                        backgroundColor: "#1c7de8",
                        "&:hover": { backgroundColor: "#1565c0" },
                    }}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default SpeakerAdd;
