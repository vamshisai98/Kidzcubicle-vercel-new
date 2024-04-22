import React, { useState, useEffect } from 'react';

import Footer from '../../common/components/Footer/Footer';
import Navbar from '../../common/components/Navbar/Navbar';
import './Dashboard.scss';
import { Box, Button, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import dashBoardLogo from '../../assets/Images/dashboard-bg.svg';
import dashBoardMobileLogo from '../../assets/Images/mobile-bg.svg';
import TabPanel from './TabPanel';
import CustomTabs from './CustomTabs';
import Fade from '@mui/material/Fade';
import Avatar from '@mui/material/Avatar';
import CountryCodeList from '../../common/components/CountryCodeList';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import TextField from '@mui/material/TextField';
import { ADD_PHONE_INITIAL_VALUES, addPhoneSchema } from '../../common/utils/AuthUtils';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import AWS from 'aws-sdk';
import awsConfig from '../../aws/aws-config';
import { checkIfUserExists, checkIfUserExistsGetEmail, getUserDetailsByEmail } from '../../aws/cognito-helper';

const Dashboard = () => {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const { cognitoUser, googleUser } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [values, setValues] = useState({
    countryCode: '',
    mobile: '',
  });

  const handleClickOpen = () => {
    console.log('first');
    console.log(cognitoUser, 'cognitoUser');

    if (cognitoUser) setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChangeTabValue = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TAB_HEADERS = ['Add', 'Packages', 'Settings', 'Bookings'];

  const getUserCognitoDetails = async () => {
    console.log(googleUser?.email, 'GU');
    const userEmail = await getUserDetailsByEmail(googleUser?.email);
    console.log(userEmail, 'UEM');
  };

  useEffect(() => {
    // getUserCognitoDetails();
  }, []);

  return (
    <div className="Dashboard__layout">
      <div className="Dashboard--container">
        <Navbar />
        <Box className="Dashboard--content">
          <Grid>
            <img
              src={windowWidth <= 768 ? dashBoardMobileLogo : dashBoardLogo}
              alt=""
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid
            container
            className="Dashboard__second-section"
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Grid className="Dashboard__second-card">
                <Avatar
                  alt="Profile Picture"
                  sx={{ height: 60, width: 60 }}
                />
                <Box mt={1}>Name</Box>
                <Box mt={1}>phone</Box>
                <Box mt={1}>email</Box>
                <Box mt={2}>Member since</Box>
              </Grid>
            </Grid>
            <Grid>
              <Grid>
                <CustomTabs
                  className="Dashboard__tabs"
                  tabsList={TAB_HEADERS}
                  tabValue={currentTab}
                  onTabChange={handleChangeTabValue}
                />
                <TabPanel
                  value={currentTab}
                  index={0}
                >
                  <Fade
                    in
                    timeout={1000}
                  >
                    <Grid>
                      <Button
                        variant="contained"
                        onClick={handleClickOpen}
                      >
                        Add Package
                      </Button>
                    </Grid>
                  </Fade>
                </TabPanel>

                <TabPanel
                  value={currentTab}
                  index={1}
                >
                  <Fade
                    in
                    timeout={1000}
                  >
                    <Grid>PACKAGES</Grid>
                  </Fade>
                </TabPanel>

                <TabPanel
                  value={currentTab}
                  index={2}
                >
                  <Fade
                    in
                    timeout={1000}
                  >
                    <Grid>SETTINGS</Grid>
                  </Fade>
                </TabPanel>

                <TabPanel
                  value={currentTab}
                  index={3}
                >
                  <Fade
                    in
                    timeout={1000}
                  >
                    <Grid>BOOKINGS</Grid>
                  </Fade>
                </TabPanel>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <React.Fragment>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={'sm'}
            fullWidth={true}
          >
            <Formik
              initialValues={ADD_PHONE_INITIAL_VALUES}
              validationSchema={addPhoneSchema}
            >
              {({ values, errors }) => (
                <Form>
                  <DialogContent dividers>
                    <Grid textAlign={'center'}>
                      <Typography
                        fontWeight={'bold'}
                        fontSize={'23px'}
                      >
                        Phone Number
                      </Typography>
                    </Grid>

                    <Grid>
                      <Grid
                        className="PhoneDetails__form"
                        item
                        xs={12}
                      >
                        <Grid
                          container
                          my={4}
                          gap={2}
                        >
                          <Grid
                            item
                            xs={4}
                          >
                            <Field name="countryCode">
                              {({ field, form }) => {
                                return (
                                  <div>
                                    <CountryCodeList
                                      onSelectChange={(selectedOption) => {
                                        setValues({ ...values, countryCode: selectedOption });
                                        form.setFieldValue('countryCode', selectedOption);
                                      }}
                                      countryCode={field.value}
                                    />
                                    {form.errors.countryCode ? (
                                      <div className="Common__error-message">{form.errors.countryCode}</div>
                                    ) : null}
                                  </div>
                                );
                              }}
                            </Field>
                          </Grid>
                          <Grid
                            item
                            xs
                          >
                            <Field
                              name="mobile"
                              as={TextField}
                              label="Mobile"
                              variant="outlined"
                              fullWidth
                              inputProps={{
                                maxLength: 10,
                                onInput: (event) => {
                                  event.target.value = event.target.value.replace(/[^0-9]/g, '');
                                  setValues({ ...values, mobile: event.target.value });
                                },
                              }}
                            />
                            <ErrorMessage
                              name="mobile"
                              component="div"
                              className="Common__error-message"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Grid
                      container
                      justifyContent={'center'}
                      p={2}
                    >
                      <Button
                        className="Common__Login-btn"
                        fullWidth
                        color="primary"
                        variant="contained"
                        sx={{ color: Colors.WHITE_COLOR }}
                        disabled={!values.mobile || !values.countryCode || Object.keys(errors).length > 0}
                        onClick={() => {}}
                      >
                        Verify
                      </Button>
                      <Typography
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                        }}
                        onClick={handleClose}
                      >
                        <ArrowBackIcon
                          fontSize="small"
                          mx={2}
                        />
                        <span>Close</span>
                      </Typography>
                    </Grid>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Dialog>
        </React.Fragment>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
