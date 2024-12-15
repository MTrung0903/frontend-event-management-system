import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { User, Mail, MapPin, Phone, Edit } from 'lucide-react';
import axios from "axios";
import Swal from "sweetalert2";
const Profile = () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.userId || null;
    const roles = payload.roles || [];
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false); // Trạng thái mở/đóng dialog
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [initialData, setInitialData] = useState({ phone: "", address: "" }); // Lưu giá trị ban đầu
    const fetch = async () => {
        try {
            let response;
            if (roles.length === 2) {
                response = await axios.get(`http://localhost:8080/man/profile/${userId}`, {
                    headers: {
                        Authorization: token,
                    },
                });
            } else {
                response = await axios.get(`http://localhost:8080/emp/profile/${userId}`, {
                    headers: {
                        Authorization: token,
                    },
                });
            }
            const fetchedData = response.data.data;
            setData(fetchedData);

            // Đặt giá trị ban đầu cho phone và address
            setPhone(fetchedData.phone);
            setAddress(fetchedData.address);
            setInitialData({ phone: fetchedData.phone, address: fetchedData.address });
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            Swal.fire({
                title: "Thông báo",
                text: "Số điện thoại không hợp lệ.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal-popup-inline',  // Tên class tùy chỉnh
                  },
                  didOpen: () => {
                    // Áp dụng trực tiếp CSS qua script khi Swal mở
                    const swalPopup = document.querySelector('.swal-popup-inline');
                    swalPopup.style.zIndex = 9999;
                    swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
                  }
            });
            return;
        }
        try {
            const updatedData = { phone, address };
            let response;
            if (roles.length === 2) {
                response = await axios.put(`http://localhost:8080/man/profile/${userId}`,
                    updatedData,
                    {
                        headers: {
                            Authorization: token,
                        },
                    });
            } else {
                response = await axios.put(`http://localhost:8080/emp/profile/${userId}`,
                    updatedData,
                    {
                        headers: {
                            Authorization: token,
                        },
                    });
            }
            setData(response.data.data);
            Swal.fire({
                title: "Thông báo",
                text: "Cập nhật thành công.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal-popup-inline',  // Tên class tùy chỉnh
                },
                didOpen: () => {
                    // Áp dụng trực tiếp CSS qua script khi Swal mở
                    const swalPopup = document.querySelector('.swal-popup-inline');
                    swalPopup.style.zIndex = 9999;
                    swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
                }
            });
        } catch (error) {
            Swal.fire({
                title: "Thông báo",
                text: "Số điện thoại đã tồn tại.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal-popup-inline',  // Tên class tùy chỉnh
                },
                didOpen: () => {
                    // Áp dụng trực tiếp CSS qua script khi Swal mở
                    const swalPopup = document.querySelector('.swal-popup-inline');
                    swalPopup.style.zIndex = 9999;
                    swalPopup.style.backgroundColor = '#f0f0f0';  // Thêm màu nền ví dụ
                }
            });
        } finally {
            fetch();
            setLoading(false);
        }
        setOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    const isSaveDisabled = phone === initialData.phone && address === initialData.address; // Kiểm tra thay đổi
    return (
        <Box sx={{ maxWidth: '400px', margin: '10px', padding: '20px' }}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center">
                <Typography variant="h2" color="black">{data.fullName || data.name}</Typography>
                <Typography variant="body1" color="blue.100">{roles.length === 2 ? "Quản lý" : "Nhân viên"}</Typography>
            </div>

            <Box sx={{ padding: '20px' }}>
                <Divider sx={{ marginBottom: '20px' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <User className="text-blue-500" size={24} />
                    <Box sx={{ marginLeft: '16px' }}>
                        <Typography variant="h6">Họ tên</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data.fullName || data.name}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <Mail className="text-green-500" size={24} />
                    <Box sx={{ marginLeft: '16px' }}>
                        <Typography variant="h6">Email</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data.email}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <Phone className="text-green-500" size={24} />
                    <Box sx={{ marginLeft: '16px' }}>
                        <Typography variant="h6">SĐT</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data.phone}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <MapPin className="text-red-500" size={24} />
                    <Box sx={{ marginLeft: '16px' }}>
                        <Typography variant="h6">Địa Chỉ</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data.address}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Button
                    sx={{ backgroundColor: "#005590", color: "white" }}
                    onClick={handleOpen} // Thêm sự kiện mở dialog
                >
                    <Edit size={20} />
                    Cập nhật thông tin cá nhân
                </Button>
            </Box>

            {/* Dialog để cập nhật thông tin */}
            <Dialog open={open} onClose={handleClose} sx={{ zIndex: 999 }}>
                <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
                <DialogContent>
                    <TextField
                        disabled
                        label="Họ tên"
                        defaultValue={data.fullName || data.name}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        disabled
                        label="Email"
                        defaultValue={data.email}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Số điện thoại"
                        defaultValue={data.phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Địa chỉ"
                        defaultValue={data.address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Hủy</Button>
                    <Button disabled={isSaveDisabled} onClick={handleSave} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;