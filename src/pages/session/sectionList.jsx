import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, CircularProgress, TextField, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import AddSectionForm from "./AddSectionForm";
import { useParams } from "react-router-dom";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
const SectionList = () => {
    const { eventId } = useParams();
    const [sections, setSection] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSections, setFilteredSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(5);  // state for page size
    const [confirmOpen, setConfirmOpen] = useState(false);

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const amPm = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;
        return `${String(adjustedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${amPm}`;
    };
    const [openEdit, setOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const fetchSections = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/man/event/${eventId}/section`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const processedData = response.data.data.map((section) => ({
                ...section,
                time: `${convertTo12HourFormat(section.startTime)} - ${convertTo12HourFormat(section.endTime)}`,
            }));

            setSection(processedData || []);
            setFilteredSections(processedData || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSections();
    }, [eventId]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = sections.filter((section) =>
            section.sectionTitle.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSections(filtered);
    };

    const handleMenuOpen = (event, section) => {
        setAnchorEl(event.currentTarget);
        setSelectedSection(section);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSection(null);
    };
    const handleEdit = () => {
        setOpen(true);
        setSelectedSectionId(selectedSection.sectionId)
        handleMenuClose();
    }
    const handleDelete = async () => {
        setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/man/section/${selectedSection.sectionId}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            alert("Section deleted successfully");
            setSection((prev) => prev.filter((s) => s.sectionId !== selectedSection.sectionId));
            setFilteredSections((prev) => prev.filter((s) => s.sectionId !== selectedSection.sectionId));
        } catch (error) {
            console.error("Error deleting section:", error);
        }
        setConfirmOpen(false); // Đóng hộp thoại sau khi xử lý
        handleMenuClose();
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false); // Đóng hộp thoại khi người dùng chọn "No"
    };


    const columns = [
        { field: "time", headerName: "Thời gian", width: 180 },
        { field: "speakerId", headerName: "SpeakerId", width: 200, hide: true },
        { field: "speakerName", headerName: "Diễn giả", width: 200 },
        { field: "sectionTitle", headerName: "Tiêu đề", width: 250 },
        { field: "sectionDescription", headerName: "Mô tả", width: 200 },
        {
            field: "handOut",
            headerName: "Tài liệu",
            width: 200,
            renderCell: (params) => {
                const handleDownload = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8080/file/${params.row.handOut}`, {
                            responseType: "blob", 
                            headers: { Authorization: localStorage.getItem("token") },
                        });
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", params.row.handOut); // Tên file khi tải về
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } catch (error) {
                        console.error("Lỗi khi tải file:", error);
                    }
                };

                return (
                    params.row.handOut && (
                        <Button
                            onClick={handleDownload}
                            variant="contained"
                            endIcon={<FileDownloadOutlinedIcon />}
                            sx={{
                                display: "inline-flex",
                                backgroundColor: "#e53935",
                                color: "white",
                                "&:hover": { backgroundColor: "#d32f2f" },
                            }}
                        >
                            {params.row.handOut}
                        </Button>
                    )
                    
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: "100%", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
            <Typography
                variant="h4"
                style={{
                    fontWeight: "bold",
                    color: "#1e88e5",
                    marginBottom: "20px",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                Sắp xếp phần thuyết trình
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <TextField
                    label="Search Section"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: "300px" }}
                />
                <AddSectionForm
                    id={selectedSectionId}
                    openEdit={openEdit}
                    onAdd={(newSection) => {
                        const processedNewSection = {
                            ...newSection,
                            time: `${newSection.startTime} - ${newSection.endTime}`
                        };
                        setSection((prev) => [...prev, processedNewSection]);
                        setFilteredSections((prev) => [...prev, processedNewSection]);
                    }}
                    onClose={() => { setOpen(false); handleMenuClose(); fetchSections(); }}


                />
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <Box style={{ height: "400px" }}>
                    <DataGrid
                        rows={filteredSections}
                        columns={columns}
                        getRowId={(row) => row.sectionId}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                        }}
                        getRowClassName={(params) => {
                            const isEven = params.indexRelativeToCurrentPage % 2 === 0;
                            return `data-grid-row-${isEven ? "even" : "odd"}`;
                        }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2,
                            boxShadow: 1,
                            '& .MuiDataGrid-row': {
                                fontSize: 14,
                                fontFamily: "Roboto, sans-serif",
                                '&:nth-of-type(even)': {
                                    backgroundColor: "#d0d0d0",
                                },
                                '&:hover': {
                                    backgroundColor: "#e3f2fd",
                                },
                            },
                        }}
                    />
                </Box>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Cập nhật</MenuItem>
                <MenuItem onClick={handleDelete}>Xóa</MenuItem>
            </Menu>
            <Dialog
                open={confirmOpen}
                onClose={handleCancelDelete}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2,
                        width: "500px",
                        bgcolor: "#f9f9f9",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <DialogTitle
                    id="confirm-dialog-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        fontWeight: "bold",
                        color: "#333",
                        fontSize: "20px",
                        marginBottom: 1,
                    }}
                >
                    <WarningAmberIcon sx={{ color: "#f57c00", fontSize: 28 }} />
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent

                >
                    <DialogContentText
                        id="confirm-dialog-description"
                        sx={{
                            textAlign: "center",
                            color: "#555",
                            fontSize: "16px",
                            marginBottom: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}
                    >
                        Bạn có chắc chắn muốn xóa phần thuyết trình này? <br />
                        <strong>Hành động này không thể hoàn tác.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: "center",
                        gap: 2,
                        paddingBottom: 2,
                    }}
                >
                    <Button
                        onClick={handleCancelDelete}
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        sx={{
                            color: "#333",
                            borderColor: "#bbb",
                            "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "#f2f2f2",
                            },
                        }}
                    >
                        Không
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        startIcon={<WarningAmberIcon />}
                        sx={{
                            backgroundColor: "#e53935",
                            color: "white",
                            "&:hover": { backgroundColor: "#d32f2f" },
                        }}
                    >
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default SectionList;
