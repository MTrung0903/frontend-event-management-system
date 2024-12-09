import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, CircularProgress, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";

const SponsorshipTabs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/man/sponsorship", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),

                    },
                });
                const result = await response.json();
                if (result.statusCode === 0) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch sponsorship data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "contact", headerName: "Contact", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phone", headerName: "Phone", flex: 1 },
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Typography variant="h4" gutterBottom>
                Sponsorship Levels
            </Typography>
            {/* <Box display="flex" justifyContent="end" mt="20px" marginBottom="20px" marginRight="10px">
                <Link to={`/sponsorships/add`} style={{ textDecoration: 'none' }}>
                    <Button type="submit" color="secondary" variant="contained">
                        Add level
                    </Button>
                </Link>
            </Box> */}
            {data.length > 0 ? (
                <Box>
                    {/* Tabs Header */}
                    <Tabs
                        value={activeTab}
                        onChange={handleChangeTab}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {data.map((sponsorship, index) => (
                            <Tab key={sponsorship.sponsorShipID} label={sponsorship.level} />
                        ))}
                    </Tabs>

                    {/* Tab Content */}
                    {data.map((sponsorship, index) => (
                        <Box
                            key={sponsorship.sponsorShipID}
                            role="tabpanel"
                            hidden={activeTab !== index}
                            sx={{ mt: 3 }}
                        >
                            {activeTab === index && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Lợi ích: {sponsorship.benefit}
                                    </Typography>
                                    <Box
                                        height="500px"
                                        sx={{
                                            "& .MuiDataGrid-root": {
                                                border: "none",
                                            },
                                            "& .MuiDataGrid-cell": {
                                                borderBottom: "none",
                                            },
                                            "& .MuiDataGrid-columnHeaders": {
                                                backgroundColor: colors.blueAccent[700],
                                                borderBottom: "none",
                                            },
                                            "& .MuiDataGrid-virtualScroller": {
                                                backgroundColor: colors.primary[400],
                                            },
                                            "& .MuiDataGrid-footerContainer": {
                                                borderTop: "none",
                                                backgroundColor: colors.blueAccent[700],
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={sponsorship.listSponsors.map((sponsor, i) => ({
                                                id: sponsor.id || i,
                                                name: sponsor.name,
                                                contact: sponsor.contact,
                                                email: sponsor.email,
                                                phone: sponsor.phone,
                                            }))}
                                            columns={columns}
                                            components={{ Toolbar: GridToolbar }}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography>No sponsorship data available</Typography>
            )}
        </Box>
    );
};

export default SponsorshipTabs;
