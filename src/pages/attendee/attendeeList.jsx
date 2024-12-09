import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, TextField, CircularProgress } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

const axiosInstance = axios.create({
    baseURL: `http://localhost:8080/man/invite`, 
    headers: {
        Authorization: localStorage.getItem("token"),
    },
});

const AttendeeList = () => {
    const { eventId } = useParams(); // Lấy eventId từ URL
    const [attendees, setAttendees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredAttendees, setFilteredAttendees] = useState([]);
    const [pageSize, setPageSize] = useState(5);  // state for page size
    const [columns, setColumns] = useState([]);  // state for columns
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const normalizedSearchTerm = value.toLowerCase().trim();
        const filtered = attendees.filter((attendee) => {
            return (
                (attendee["Họ tên"]?.toLowerCase() || "").includes(normalizedSearchTerm) ||
                (attendee["Email"]?.toLowerCase() || "").includes(normalizedSearchTerm)
            );
        });
        
        setFilteredAttendees(filtered);
    };

    const ExcelToJson = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet); // Chuyển đổi sheet thành JSON
            setAttendees(data);
            setFilteredAttendees(data);

            const keys = data.length ? Object.keys(data[0]) : [];
            const dynamicColumns = keys.map((key) => ({
                field: key,
                headerName: key,
                width: 180,
            }));
            setColumns(dynamicColumns);
        };
        reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; // Lấy file từ input
        if (file) {
            ExcelToJson(file);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("eventId", eventId);
            await axios.put(`http://localhost:8080/man/event/${eventId}/attendee`, formData, {
                headers: { Authorization: localStorage.getItem("token") },
                "Content-Type": "multipart/form-data" 
            });
        }
    };
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event attendees
                const response = await axiosInstance.get(`http://localhost:8080/man/event/${eventId}/attendee`,{
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    }
                });
                const attendee = response.data.data;

                // Fetch file (Excel)
                const fileResponse = await axios.get(`http://localhost:8080/file/${attendee}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    responseType: "blob", // Lấy dữ liệu ảnh dưới dạng blob
                });

                // Chuyển blob thành file JSON
                const file = new Blob([fileResponse.data], { type: 'xlsx' });
                ExcelToJson(file);
            } catch (error) {
                console.error("Error fetching attendees or file:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    

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
                Danh sách người tham dự
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <TextField
                    placeholder='Search by name or email'
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: "300px" }}
                />
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    style={{ marginLeft: "20px" , backgroundColor:"#1e7ce8"}}
                >
                    Upload Excel
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={handleFileUpload}
                    />
                </Button>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <Box style={{ height: "400px" }}>
                    <DataGrid
                        rows={filteredAttendees.map((row, index) => ({ ...row, id: index }))}  // Thêm id từ index
                        columns={columns}
                        getRowId={(row) => row.id}  // Lấy id từ mỗi row
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
        </div>
    );
};

export default AttendeeList;
