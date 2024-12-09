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
    MenuItem
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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


    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchSponsorDetail = async () => {
            try {
                const response = await axiosInstance.get(`/${sponsorId}`);
                const sponsorData = response.data.data;

                setSponsor(sponsorData);
                setFormData(sponsorData);

                // Tải logo
                if (sponsorData.sponsorLogo) {
                    const logoResponse = await axios.get(`http://localhost:8080/file/${sponsorData.sponsorLogo}`, {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                        responseType: 'blob',
                    });
                    setLogoUrl(URL.createObjectURL(logoResponse.data));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching sponsor details:", err);
                setError("Unable to fetch sponsor details. Please try again later.");
                setLoading(false);
            }
        };

        if (sponsorId) fetchSponsorDetail();
    }, [sponsorId]);
    const [sponsorshipLevels, setSponsorshipLevels] = useState([]);

    // Fetch sponsorship levels from API
    useEffect(() => {
        const fetchSponsorshipLevels = async () => {
            try {
                const response = await axios.get("http://localhost:8080/man/sponsorship", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                });
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
        // Thêm logo nếu có thay đổi
        if (logoUrl) {
            formDataToSubmit.append("logo", logoUrl);
        }

        // Thêm các dữ liệu khác từ form
        formDataToSubmit.append("id", sponsorId); // Đảm bảo truyền đúng id
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("contact", formData.contact);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("phone", formData.phone);
        formDataToSubmit.append("website", formData.website);
        formDataToSubmit.append("address", formData.address);
        formDataToSubmit.append("sponsorshipId", formData.sponsorshipId);
        formDataToSubmit.append("sponsorshipLevel", formData.sponsorshipLevel);
        try {
            await axios.put("http://localhost:8080/man/sponsor", formDataToSubmit, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("token"),

                },
            });

            setSponsor(formData);
            setIsEditOpen(false);
            alert("Sponsor updated successfully!");
        } catch (err) {
            console.error("Error updating sponsor:", err);
            alert("Failed to update sponsor. Please try again.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <div style={{ maxWidth: "96%", marginLeft: "15px", padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>

                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={`${sponsor.name} logo`}
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
                {sponsor.name}
            </Typography>

            {/* Thông tin nhà tài trợ */}
            <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Liên hệ
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={sponsor.contact}
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
                        value={sponsor.email}
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
                        value={sponsor.phone}
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
                        value={sponsor.address}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Website
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={sponsor.website}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Mức độ tài trợ
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={sponsor.sponsorshipLevel}
                        InputProps={{ style: { fontSize: "15px" } }}
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
            <CardActions>
                <Link to={`/sponsor/${sponsor.id}/event`} style={{ textDecoration: "none" }}>
                    <Button
                        size="large"
                        color="primary"
                        variant="contained"
                        style={{ fontWeight: "bold" }}
                    >
                        Tạo sự kiện mới
                    </Button>
                </Link>
            </CardActions>

            {/* Kiểm tra và hiển thị danh sách sự kiện */}
            {(sponsor.listSponsorEvents && sponsor.listSponsorEvents.length > 0) ? (
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
                                        style={{ fontWeight: "600", marginBottom: "15px", fontSize: "1.25rem" }}
                                    >
                                        {event.eventName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Link to={`/sponsor/event/${event.id}`} style={{ textDecoration: "none" }}>
                                        <Button
                                            size="large"
                                            color="primary"
                                            variant="contained"
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Tìm hiểu thêm
                                        </Button>
                                    </Link>
                                </CardActions>
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
            <Dialog open={isEditOpen} onClose={handleEditClose}>
                <DialogTitle>Cập nhật nhà tài nhợ</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />
                    <TextField
                        label="Contact"
                        name="contact"
                        fullWidth
                        value={formData.contact || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        fullWidth
                        value={formData.phone || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        fullWidth
                        value={formData.address || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />
                    <TextField
                        label="Website"
                        name="website"
                        fullWidth
                        value={formData.website || ""}
                        onChange={handleFormChange}
                        style={{ marginBottom: "15px" }}
                    />


                    {/* Dropdown cho Sponsorship Level */}

                    <div style={{ marginBottom: "15px" }}>
                        <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                            Mức độ tài trợ
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            variant="outlined"
                            name="sponsorshipLevel"
                            value={formData.sponsorshipLevel || ""} // Dữ liệu trong form
                            onChange={(e) => {
                                const selectedLevel = sponsorshipLevels.find(level => level.level === e.target.value);
                                setFormData({
                                    ...formData,
                                    sponsorshipLevel: e.target.value, // Cập nhật tên cấp độ
                                    sponsorshipId: selectedLevel ? selectedLevel.sponsorShipID : "" // Cập nhật ID tương ứng với cấp độ
                                });
                            }}
                            InputProps={{ style: { fontSize: "15px" } }}
                        >
                            {sponsorshipLevels.map((level) => (
                                <MenuItem key={level.sponsorShipID} value={level.level}>
                                    {level.level}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <Typography style={{ marginBottom: "10px" }}>Cập nhật logo</Typography>
                    <div style={{ marginBottom: "20px" }}>
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={`${formData.name} logo`}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                        ) : (
                            <Typography>Logo không khả dụng</Typography>
                        )}
                    </div>
                    <input
                        type="file"
                        onChange={(e) => setLogoUrl(e.target.files[0])} // Cập nhật logo file
                        style={{ marginBottom: "15px" }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleFormSubmit} color="primary" variant="contained">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default SponsorDetail;
