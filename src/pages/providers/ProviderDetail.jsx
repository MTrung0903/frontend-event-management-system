import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme, styled } from "@mui/material/styles";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { Email, Phone, Home, Web } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ServiceAddForm from "../provider-services/ProviderServiceAdd";
import EditProviderForm from "./ProviderEdit";
import ProviderServiceDetail from "../provider-services/ProviderServiceDetail";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/provider/",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});
const deleteProviderService = async (serviceId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/proService/${serviceId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete provider:", error);
    throw error;
  }
};
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#446FC1",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#1BB5D1",
  },
}));

const CustomCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
}));

const ProviderDetail = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const [isDialogAddOpen, setIsDialogAddOpen] = useState(false);
  const handleDialogAddOpen = () => setIsDialogAddOpen(true);
  const handleDialogAddClose = () => setIsDialogAddOpen(false);

  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const handleDialogEditOpen = () => setIsDialogEditOpen(true);
  const handleDialogEditClose = () => setIsDialogEditOpen(false);

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isDialogServiceOpen, setIsDialogServiceOpen] = useState(false);
  const handleDialogServiceOpen = () => setIsDialogServiceOpen(true);
  const handleDialogServiceClose = () => setIsDialogServiceOpen(false);

  const removeProviderService = async (serviceId) => {
    try {
      await deleteProviderService(serviceId);
      alert("Xóa thành công");
      fetchProviderDetail();
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  const fetchProviderDetail = async () => {
    try {
      console.log("Fetching providerId from URL:", providerId);

      const response = await axiosInstance.get(`/${providerId}`);
      console.log(response.data);
      setProvider(response.data);
    } catch (err) {
      console.error("Error fetching provider detail:", err);
      setError("Unable to fetch provider details. Please try again later.");
    }
  };
  useEffect(() => {
    if (providerId) {
      fetchProviderDetail();
    }
  }, [providerId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!provider) return <Typography>Loading...</Typography>;
  const handleFetch = () => {
    fetchProviderDetail();
  };
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Icon trở về */}
      <IconButton sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon fontSize="large" sx={{ color: "#42D2EC" }} />
      </IconButton>

      <CustomCard sx={{ mb: 4, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "32px", color: "#333" }}
          >
            {provider.name}
          </Typography>
          <IconButton>
            <EditOutlinedIcon onClick={handleDialogEditOpen} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
            >
              <Phone sx={{ mr: 1, color: "#42D2EC" }} /> Liên hệ
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", ml: 3 }}>
              {provider.contact}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
            >
              <Email sx={{ mr: 1, color: "#42D2EC" }} /> Email
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", ml: 3 }}>
              {provider.email}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
            >
              <Phone sx={{ mr: 1, color: "#42D2EC" }} /> Số điện thoại
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", ml: 3 }}>
              {provider.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
            >
              <Home sx={{ mr: 1, color: "#42D2EC" }} /> Địa chỉ
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", ml: 3 }}>
              {provider.address}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", display: "flex", alignItems: "center" }}
            >
              <Web sx={{ mr: 1, color: "#42D2EC" }} /> Website
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", ml: 3 }}>
              {provider.website}
            </Typography>
          </Grid>
        </Grid>
      </CustomCard>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "22px" }}>
          Danh sách dịch vụ
        </Typography>

        <Button
          onClick={handleDialogAddOpen}
          color="secondary"
          variant="contained"
        >
          Thêm dịch vụ
        </Button>
      </Box>

      {provider.listProviderServices &&
      provider.listProviderServices.length > 0 ? (
        <Grid container spacing={2}>
          {provider.listProviderServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CustomCard
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      mb: 1,
                      fontSize: "1rem",
                      color: "#333",
                    }}
                  >
                    {service.serviceName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Loại:</strong> {service.serviceType}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Giá:</strong> {service.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 0.5, fontSize: "0.875rem" }}
                  >
                    <strong>Thời gian sử dụng:</strong> {service.duration}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomButton
                    size="small"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      handleDialogServiceOpen();
                      console.log("Service ID:", service.id);
                    }}
                  >
                    Chi tiết
                  </CustomButton>
                  <IconButton onClick={() => {removeProviderService(service.id)}}>
                    <DeleteOutlineOutlinedIcon
                      fontSize="12px"
                      sx={{ color: "#D1D1D1" }}
                    />
                  </IconButton>
                </Box>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Dịch vụ này không khả dụng</Typography>
      )}
      {/*Dialog add service  */}
      <Dialog
        open={isDialogAddOpen}
        onClose={handleDialogAddClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "900px",
            maxWidth: "none",
          },
        }}
        fullWidth
      >
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          <ServiceAddForm
            onClose={handleDialogAddClose}
            providerid={providerId}
            handleFetch={handleFetch}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogAddClose} color="primary">
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialog edit  */}
      <Dialog
        open={isDialogEditOpen}
        onClose={handleDialogEditClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "900px",
            maxWidth: "none",
          },
        }}
        fullWidth
      >
        {/* <DialogTitle>Edit Provider</DialogTitle> */}
        <DialogContent>
          <EditProviderForm
            onClose={handleDialogEditClose}
            providerid={providerId}
            handleFetch={handleFetch}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogEditClose} color="primary">
          Thoát
          </Button>
        </DialogActions>
      </Dialog>

      {/*Dialog Xem chi tiết dịch vụ  */}
      <Dialog
        open={isDialogServiceOpen}
        onClose={handleDialogServiceClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "900px",
            maxWidth: "none",
          },
        }}
        fullWidth
      >
        <DialogContent>
          <ProviderServiceDetail serviceid={selectedServiceId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogServiceClose} color="primary">
          Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProviderDetail;
