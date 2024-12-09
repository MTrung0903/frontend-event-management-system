import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  Typography,
  IconButton,
  Grid
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from "react-router-dom";

const SponsorAdd = ({ closeDialog, fetchSponsors }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sponsorshipLevels, setSponsorshipLevels] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Fetch sponsorship levels from API
  useEffect(() => {
    const fetchSponsorshipLevels = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/man/sponsorship",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setSponsorshipLevels(response.data.data);
      } catch (error) {
        console.error("Error fetching sponsorship levels:", error);
      }
    };
    fetchSponsorshipLevels();
  }, []);
  const onBack = async () => {
    navigate(`/sponsors`);
  };
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("contact", values.contact);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("website", values.website);
      formData.append("sponsorshipId", values.sponsorshipId);
      formData.append("sponsorshipLevel", values.sponsorshipLevel);

      // Nếu có logo, thêm vào formData
      if (values.sponsorLogo) {
        formData.append("logo", values.sponsorLogo);
      }

      const response = await axios.post(
        "http://localhost:8080/man/sponsor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Sponsor added successfully!");
      console.log("Response:", response.data);
      resetForm();
      closeDialog();
      fetchSponsors();
      setPreviewImage(null);
    } catch (error) {
      console.error("Error adding sponsor:", error);
      alert("Failed to add sponsor. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  {previewImage ? (
                    <Box
                      component="img"
                      src={previewImage}
                      alt="Preview"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        objectFit: "cover",
                        mb: 2,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Ảnh không khả dụng
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      textTransform: "none",
                      width: "fit-content",
                      padding: "6px 16px",
                    }}
                  >
                    Chọn logo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValue("sponsorLogo", file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setPreviewImage(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Button>
                  {touched.sponsorLogo && errors.sponsorLogo && (
                    <FormHelperText error>{errors.sponsorLogo}</FormHelperText>
                  )}
                </Box>
              </Grid>

              {/* Các trường input khác */}
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="Sponsor Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                {touched.name && errors.name && (
                  <FormHelperText error>{errors.name}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <textarea
                  placeholder="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  name="contact"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical', // Cho phép thay đổi kích thước theo chiều dọc
                    minHeight: '100px', // Chiều cao tối thiểu để hiển thị nhiều dòng
                  }}
                />
                {touched.contact && errors.contact && (
                  <FormHelperText error>{errors.contact}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <input
                  type="email"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="Phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                {touched.phone && errors.phone && (
                  <FormHelperText error>{errors.phone}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                {touched.address && errors.address && (
                  <FormHelperText error>{errors.address}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="Website"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.website}
                  name="website"
                  style={{
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                {touched.website && errors.website && (
                  <FormHelperText error>{errors.website}</FormHelperText>
                )}
              </Grid>

              {/* Sponsorship Level Select */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="filled"
                  error={!!touched.sponsorshipId && !!errors.sponsorshipId}
                >
                  <Select
                    value={values.sponsorshipId || ""}
                    onChange={(e) => {
                      const selected = sponsorshipLevels.find(
                        (level) => level.sponsorShipID === e.target.value
                      );
                      setFieldValue("sponsorshipId", e.target.value);
                      setFieldValue("sponsorshipLevel", selected?.level || "");
                    }}
                    onBlur={handleBlur}
                    name="sponsorshipId"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Chọn mức độ tài trợ
                    </MenuItem>
                    {sponsorshipLevels.map((level) => (
                      <MenuItem
                        key={level.sponsorShipID}
                        value={level.sponsorShipID}
                      >
                        {level.level}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.sponsorshipId && errors.sponsorshipId}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Thêm nhà tài trợ
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>

  );
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Sponsor name is required"),
  contact: yup.string().required("Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
  sponsorshipId: yup.string().required("Sponsorship level is required"),
  sponsorLogo: yup.mixed(),
});

const initialValues = {
  name: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  sponsorshipId: "",
  sponsorshipLevel: "",
  sponsorLogo: null,
};

export default SponsorAdd;
