import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const ProviderAddForm = ({ onClose ,onProviderAdded }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const providerDTO = {
        name: values.name,
        contact: values.contact,
        email: values.email,
        phone: values.phone,
        address: values.address,
        website: values.website,
      };

      const response = await axios.post(
        "http://localhost:8080/man/provider",
        providerDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Response:", response.data);
      if (response.data.statusCode === 0 && response.data.data === true) {
        alert("Thêm thành công");
      } else {
        alert("Thêm thất bại");
      }

      resetForm();
      onProviderAdded ()
      onClose();
    } catch (error) {
      console.error("Error adding provider:", error);
      //alert("Failed to add provider. Please try again.");
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Tên không được để trống"),
    contact: yup.string().required("Liên hệ không được để trống"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    phone: yup
      .string()
      .matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "SĐT không hợp lệ"
      )
      .required("Phone không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
    website: yup.string().url(" URL không hợp lệ").required("Website không được để trống"),
  });

  const initialValues = {
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  };

  return (
    <Box
      p={6}
      bgcolor="#f9f9f9"
      borderRadius="16px"
      boxShadow="0 6px 12px rgba(0, 0, 0, 0.2)"
      maxWidth="700px"
      mx="auto"
    >
      <Typography variant="h3" textAlign="center" mb={3} fontWeight="bold">
        Thêm nhà cung cấp dịch vụ
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mb={5}
      >
        Điền vào mẫu dưới đây để thêm nhà cung cấp mới.
      </Typography>

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
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap={3}
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? "span 1" : "span 2",
                  width: "100%", // Tăng chiều rộng của các thẻ
                },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Tên nhà cung cấp dịch vụ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Người liên hệ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Email"
                type="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.website}
                name="website"
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt={5}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 2,
                  backgroundColor: "#007bff",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Thêm
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ProviderAddForm;
