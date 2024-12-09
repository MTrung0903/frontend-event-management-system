import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";


const ServiceAddForm = ({onClose,providerid,handleFetch}) => {
  const providerId = providerid;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  console.log("ID"+providerId)
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      
      const serviceDTO = {
        ...values,
        providerId
      };

      const response = await axios.post(
        "http://localhost:8080/man/proService",
        serviceDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      alert("Service added successfully!");
      console.log("Response:", response.data);
      resetForm(); 
      onClose();
      handleFetch()
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD SERVICE" subtitle="Add a New Service for Provider" />

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
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceType}
                name="serviceType"
                error={!!touched.serviceType && !!errors.serviceType}
                helperText={touched.serviceType && errors.serviceType}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceName}
                name="serviceName"
                error={!!touched.serviceName && !!errors.serviceName}
                helperText={touched.serviceName && errors.serviceName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceDesc}
                name="serviceDesc"
                error={!!touched.serviceDesc && !!errors.serviceDesc}
                helperText={touched.serviceDesc && errors.serviceDesc}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Duration"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.duration}
                name="duration"
                error={!!touched.duration && !!errors.duration}
                helperText={touched.duration && errors.duration}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Service
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  serviceType: yup.string().required("Loại dịch vụ không được để trống"),
  serviceName: yup.string().required("Tên dịch vụ không được để trống"),
  serviceDesc: yup.string().required("Chi tiết dịch vụ không được để trống"),
  price: yup.string().required("Giá không được để trống"),
  duration: yup.string().required("Thời gian sử dụng không được để trống"),
});

const initialValues = {
  serviceType: "",
  serviceName: "",
  serviceDesc: "",
  price: "",
  duration: "",
};

export default ServiceAddForm;
