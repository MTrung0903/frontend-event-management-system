import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProviderForm = ({onClose,providerid,handleFetch}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const  providerId  = providerid 
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null); // State để lưu dữ liệu provider

  useEffect(() => {
    // Gọi API để lấy thông tin của provider theo ID
    const fetchProvider = async () =>  {
      try {
        const response = await axios.get(`http://localhost:8080/man/provider/${providerId}`,  {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          });
 
        const providerData = response.data;
        setInitialValues({
          id: providerData.id,
          name: providerData.name,
          contact: providerData.contact,
          email: providerData.email,
          phone: providerData.phone,
          address: providerData.address,
          website: providerData.website,
        });
      } catch (error) {
        console.error("Error fetching provider data:", error);
        alert("Failed to load provider details. Please try again.");
      }
    };

    fetchProvider();
  }, [providerId]);

  const handleFormSubmit = async (values) => {
    try {
      // Gửi request PUT để cập nhật provider
      const response = await axios.put(`http://localhost:8080/man/provider`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      alert("Cập nhật thành công!");
      console.log("Response:", response.data);
      onClose();
      handleFetch();
    } catch (error) {
      console.error("Error updating provider:", error);
      alert("Cập nhật thất bại. Thử lại sau");
    }
  };

  if (!initialValues) {
    // Hiển thị loading khi đang tải dữ liệu
    return <div>Tải nhà cung cấp dịch vụ...</div>;
  }

  return (
    <Box m="20px">
      <Header title="EDIT PROVIDER"  />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize 
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
               
                type="text"
                label="Provider Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
               
                type="text"
                label="Contact Person"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
           
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
              
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
             
                type="text"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.website}
                name="website"
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Cập nhật nhà cung cấp dịch vụ
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
  name: yup.string().required("Tên không được trống"),
  contact: yup.string().required("Người liên hệ không được để trống"),
  email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
  phone: yup
    .string()
    .matches(phoneRegExp, "SĐT không hợp lệ")
    .required("SĐT không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  website: yup.string().url("URL không hợp lệ").required("Website không được để trống"),
});

export default EditProviderForm;
