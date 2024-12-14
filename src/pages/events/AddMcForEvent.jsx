import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Grid, Card, Box, CardContent, Typography } from "@mui/material";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import axios from "axios";
import Swal from "sweetalert2";

const AddMcForEvent = () => {
    const { eventId } = useParams();
    const [mcList, setMcList] = useState([]);
    const [selectedMC, setSelectedMC] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [event, setEvent] = useState(null);
    const [disable, setDisable] = useState(false);
    const defaultImage = "path/to/default/image.jpg";
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
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/man/event/${eventId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setEvent(response.data.data);
            } catch (error) {
                console.error("Error fetching event details", error);
            }
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        const fetchMCList = async () => {
            try {
                const response = await axios.get("http://localhost:8080/man/mc", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setMcList(response.data.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách MC:", error);
                Swal.fire("Error", "Không thể tải danh sách MC", "error");
            }
        };
        fetchMCList();
    }, []);

    useEffect(() => {
        if (event?.mcId) {
            setSelectedMC(event.mcId);
            setDisable(true);
        }
    }, [event]);

    const handleSelectMC = (mcId) => {
        setSelectedMC(mcId);
    };

    const handleSubmit = () => {
        axios
            .put(`http://localhost:8080/man/event/${eventId}/mc/${selectedMC}`, {}, {
                headers: { Authorization: localStorage.getItem("token") },
            })
            .then(() => {
                Swal.fire("Success", "MC đã được thêm vào sự kiện!", "success");
            })
            .catch((error) => {
                console.error("Lỗi khi thêm MC:", error);
                Swal.fire("Error", "Không thể thêm MC vào sự kiện", "error");
            });
        setDisable(true);
    };

    const handleResetSelection = () => {
        setDisable(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Chọn MC cho Sự Kiện
            </Typography>

            <Grid container spacing={3}>
                {mcList.map((mc) => (
                    <Grid item xs={12} sm={6} md={4} key={mc.mcID}>
                        <Card
                            sx={{
                                minHeight: "300px",
                                maxHeight: "500px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                overflow: "hidden",
                                opacity: (disable && selectedMC !== mc.mcID) ? 0.6 : 1,
                                pointerEvents: (disable && selectedMC !== mc.mcID) ? "none" : "auto",
                            }}
                        >
                            <Box sx={{ position: "relative" }}>
                                <Checkbox
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        cursor: "pointer",
                                    }}
                                    checked={selectedMC === mc.mcID || (event && event.mcId === mc.mcID && selectedMC === null)}
                                    onClick={() => handleSelectMC(mc.mcID)}
                                />
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
                                <CardContent sx={{ paddingTop: 8 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: "bold", marginLeft: "96px" }}
                                    >
                                        {mc.mcName}
                                    </Typography>
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
                                        <DescriptionOutlined sx={{ fontSize: 20, marginRight: 1 }} />
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

            <Box sx={{ marginTop: 3, display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={selectedMC === null || disable && event?.mcId !== null}
                >
                    Thêm MC
                </Button>
                {disable && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetSelection}
                    >
                        Chọn MC khác
                    </Button>
                )}
            </Box>
        </div>
    );
};

export default AddMcForEvent;
