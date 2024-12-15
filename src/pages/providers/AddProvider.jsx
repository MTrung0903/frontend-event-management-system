import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Checkbox,
  MenuItem,
  Select,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2';

const ProviderTabs = ({ onClose, onProviderAdded }) => {
  const { eventId } = useParams();
  const [providers, setProviders] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [serviceDates, setServiceDates] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3); 

  const handleDateChange = (providerId, serviceId, field, value) => {
    setServiceDates((prevState) => ({
      ...prevState,
      [providerId]: {
        ...prevState[providerId],
        [serviceId]: {
          ...prevState[providerId]?.[serviceId],
          [field]: value,
        },
      },
    }));
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listprovider`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data?.data) {
        setProviders(response.data.data);
        setActiveTab(response.data.data[0]?.id || "");
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const addProvider = async (providerId) => {
    try {
      await axios.post(
        `http://localhost:8080/man/event/${eventId}/providers/${providerId}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      //alert("Provider added successfully!");
      fetchProviders();
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  const addServiceForEvent = async (eventId, serviceId, rentalDate, expDate) => {
    try {
      const formattedRentalDate = format(new Date(rentalDate), "yyyy-MM-dd HH:mm:ss");
      const formattedExpDate = format(new Date(expDate), "yyyy-MM-dd HH:mm:ss");

      const serviceEventDTO = {
        eventId,
        serviceId,
        rentalDate: formattedRentalDate,
        expDate: formattedExpDate,
      };

      const response = await axios.post(
        `http://localhost:8080/man/proService/add-ser`,
        serviceEventDTO,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding service to event:", error);
      throw error;
    }
  };

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  const handleServiceToggle = (providerId, serviceId) => {
    setSelectedServices((prevState) => ({
      ...prevState,
      [providerId]: {
        ...prevState[providerId],
        [serviceId]: !prevState[providerId]?.[serviceId],
      },
    }));
  };

  const handleSave = async () => {
    try {
      const providerIds = Object.keys(selectedServices);
      for (const providerId of providerIds) {
        await addProvider(providerId);

        const serviceIds = Object.keys(selectedServices[providerId]).filter(
          (serviceId) => selectedServices[providerId][serviceId]
        );

        for (const serviceId of serviceIds) {
          const dates = serviceDates[providerId]?.[serviceId] || {};
          const { rentalDate, expDate } = dates;

          if (!rentalDate || !expDate) {
            alert(
              `Vui lòng nhập đầy đủ ngày thuê và ngày trả cho dịch vụ ${serviceId}`
            );
            return;
          }

          await addServiceForEvent(eventId, serviceId, rentalDate, expDate);
        }
      }
      Swal.fire({
        title: "Save",
        text: "Thêm thành côngcông",
        icon: "success",
        confirmButtonText: "OK",
        showClass: {
          popup: "animate__animated animate__fadeInDown" 
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp" 
        },
      });
      fetchProviders();
      onProviderAdded();
      onClose();
    } catch (error) {
      console.error("Error saving services and providers:", error);
      alert("Lưu thất bại. Thử lại sau");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  useEffect(() => {
    fetchProviders();
  }, [eventId]);

  return (
    <Box sx ={{marginLeft:'10px',paddingLeft:'0'}}>
      {/* Dropdown Menu for Tabs */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "transparent", boxShadow: "none", width:'100%' }}
      >
        <Select
          value={activeTab}
          onChange={handleTabChange}
          displayEmpty
          sx={{ maxWidth: 800 }}
        >
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          ))}
        </Select>
      </AppBar>

      {/* Tab Content */}
      <Box sx={{ paddingTop:'5px' }}>
        {providers.map((provider) => (
          <Box
            role="tabpanel"
            hidden={activeTab !== provider.id}
            key={provider.id}
            id={`tabpanel-${provider.id}`}
            aria-labelledby={`tab-${provider.id}`}
          >
            {activeTab === provider.id && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Thông tin 
                </Typography>
                <Typography sx={{  fontSize: "13px",display: "flex", alignItems: "center", lineHeight: "1.6", }}>Email: {provider.email}</Typography>
                <Typography sx={{  fontSize: "13px",display: "flex", alignItems: "center", lineHeight: "1.6", }}>SĐT: {provider.phone}</Typography>
                <Typography sx={{  fontSize: "13px",display: "flex", alignItems: "center", lineHeight: "1.6", }}>Địa chỉ: {provider.address}</Typography>

                {/* Table with Pagination */}
                {provider.listProviderServices.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table sx={{ width: "100%" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên dịch vụ</TableCell>
                          <TableCell>Loại</TableCell>
                          <TableCell>Giá</TableCell>
                          <TableCell>Ngày thuê</TableCell>
                          <TableCell>Ngày trả</TableCell>
                          <TableCell>Chọn</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {provider.listProviderServices
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((service) => (
                            <TableRow key={service.id}>
                              <TableCell>{service.serviceName}</TableCell>
                              <TableCell>{service.serviceType}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("vi-VN").format(service.price)} VNĐ
                              </TableCell>
                              <TableCell>
                                <input
                                  type="datetime-local"
                                  value={serviceDates[provider.id]?.[service.id]?.rentalDate || ""}
                                  onChange={(e) =>
                                    handleDateChange(provider.id, service.id, "rentalDate", e.target.value)
                                  }
                                  style={{ width: "75%", padding: "4px", fontSize: "14px", marginTop: "8px" }}
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="datetime-local"
                                  value={serviceDates[provider.id]?.[service.id]?.expDate || ""}
                                  onChange={(e) =>
                                    handleDateChange(provider.id, service.id, "expDate", e.target.value)
                                  }
                                  style={{ width: "75%", padding: "4px", fontSize: "14px", marginTop: "8px" }}
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={selectedServices[provider.id]?.[service.id] || false}
                                  onChange={() => handleServiceToggle(provider.id, service.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[3, 5, 10]}
                      component="div"
                      count={provider.listProviderServices.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                ) : (
                  <Typography sx={{ mt: 2 }}>
                    Không có dịch vụ nào khả dụng cho nhà cung cấp dịch vụ này.
                  </Typography>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>

      {/* Save Button */}
      <Box sx={{ textAlign: "right", mt: 4, pr: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#42D2EC", color: "#fff", fontWeight: "bold" }}
          onClick={handleSave}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};

export default ProviderTabs;
