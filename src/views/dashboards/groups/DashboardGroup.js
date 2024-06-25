import React, { useEffect, useState } from 'react';
import { Button, Box, Drawer, useMediaQuery, Tabs, Tab, Avatar, Chip, Tooltip, Divider } from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import EmailLists from '../../../components/apps/TeacherGroupsLayout/EmailList';
import EmailSearch from '../../../components/apps/TeacherGroupsLayout/EmailSearch';
import EmailContent from '../../../components/apps/TeacherGroupsLayout/EmailContent';
import PageContainer from '../../../components/container/PageContainer';
import AppCard from 'src/components/shared/AppCard';
import breadcrumbImg from '../../../assets/images/breadcrumb/emailSv.png';
import { TabContext, TabPanel } from '@mui/lab';
import { IconBook2, IconUser } from '@tabler/icons';
import GroupsLeftLayout from '../../../components/apps/TeacherGroupsLayout/GroupsLeftLayout';
import { useSelector } from 'react-redux';
import Fade from '@mui/material/Fade';
import StudentSearch from 'src/components/apps/TeacherGroupsLayout/StudentSearch';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const drawerWidth = 400;
const secdrawerWidth = 400;

const COMMON_TAB = [
    { value: '1', icon: <IconBook2 width={20} height={20} />, label: 'Item One', disabled: false },
    { value: '2', icon: <IconUser width={20} height={20} />, label: 'Item Two', disabled: false }
];

const DashboardGroup = () => {
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const { members: globalMembers } = useSelector((state) => state.groups);
    const [groupMembers, setGroupMembers] = useState([]);
    const [value, setValue] = useState('1');
    const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);
    const currentLoggedInUser = useAuthUser();

    useEffect(() => {
        if (globalMembers && Array.isArray(globalMembers.users)) {
            setGroupMembers(globalMembers.users);
        } else {
            setGroupMembers([]);
        }
    }, [globalMembers]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDeleteUserFromGroup = async (id) => {
        console.log('User To Delete: ', id, currentSelectedGroup);
        try {
            await axios.put(`http://localhost:3001/groups/${currentSelectedGroup}/removeUser/${id}`);
            setGroupMembers((prevMembers) => Array.isArray(prevMembers) ? prevMembers.filter((user) => user._id !== id) : []);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return (
        <PageContainer title="Groups">
            <Breadcrumb title="Groups">
                <Box>
                    <img src={breadcrumbImg} alt={breadcrumbImg} width={'165px'} />
                </Box>
            </Breadcrumb>

            <AppCard>
                {/* Left part */}
                <Drawer
                    open={isLeftSidebarOpen}
                    onClose={() => setLeftSidebarOpen(false)}
                    sx={{
                        width: drawerWidth,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, position: 'relative', zIndex: 2 },
                        flexShrink: 0,
                    }}
                    variant={lgUp ? 'permanent' : 'temporary'}
                >
                    <GroupsLeftLayout />
                </Drawer>

                {/* Middle part */}
                <Box
                    sx={{
                        minWidth: secdrawerWidth,
                        width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
                        flexShrink: 0,
                    }}>
                    <TabContext value={value}>
                        <Tabs
                            variant="fullWidth"
                            scrollButtons="auto"
                            centered
                            value={value}
                            onChange={handleChange}
                            aria-label="icon tabs example"
                        >
                            {COMMON_TAB.map((tab) => (
                                <Tab key={tab.value} icon={tab.icon} value={tab.value} />
                            ))}
                        </Tabs>
                        <TabPanel
                            sx={{
                                p: 0,
                                m: 0,
                                backgroundColor: '#2A3447',
                            }}
                            key="1"
                            value="1"
                        >
                            <EmailSearch onClick={() => setLeftSidebarOpen(true)} />
                            <Divider sx={{ my: 1 }} />
                            <EmailLists showrightSidebar={() => setRightSidebarOpen(true)} />
                        </TabPanel>
                        <TabPanel
                            key="2"
                            value="2"
                            sx={{
                                p: 0,
                                m: 0,
                                backgroundColor: '#2A3447',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <StudentSearch onClick={() => setLeftSidebarOpen(true)} />
                            <Divider sx={{ my: 1 }} />
                            {groupMembers.length > 0 ? (
                                groupMembers.map((user) => (
                                    <Tooltip
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        title={
                                            <div>
                                                <div>Email: {user.email}</div>
                                                <div>Username: {user.username}</div>
                                            </div>
                                        }
                                        key={user._id}
                                    >
                                        <Chip
                                            sx={{
                                                m: 1,
                                                textTransform: 'capitalize'
                                            }}
                                            key={user._id}
                                            avatar={<Avatar alt={user.email} />}
                                            label={`${user.firstname} ${user.lastname}`}
                                            color={user._id === currentLoggedInUser.userId ? 'success' : 'primary'}
                                            onDelete={() => handleDeleteUserFromGroup(user._id)}
                                        />
                                    </Tooltip>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </TabPanel>
                    </TabContext>
                </Box>

                {/* Right part */}
                {mdUp ? (
                    <Drawer
                        anchor="right"
                        variant="permanent"
                        sx={{
                            zIndex: 0,
                            width: '200px',
                            flex: '1 1 auto',
                            [`& .MuiDrawer-paper`]: { position: 'relative' },
                        }}
                    >
                        <Box>
                            <EmailContent />
                        </Box>
                    </Drawer>
                ) : (
                    <Drawer
                        anchor="right"
                        open={isRightSidebarOpen}
                        onClose={() => setRightSidebarOpen(false)}
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: { width: '85%' },
                        }}
                        variant="temporary"
                    >
                        <Box>
                            <Box pl={3} pt={3}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => setRightSidebarOpen(false)}
                                    sx={{ display: { xs: 'block', md: 'none', lg: 'none' } }}
                                >
                                    {' '}
                                    Back{' '}
                                </Button>
                            </Box>
                            <EmailContent />
                        </Box>
                    </Drawer>
                )}
            </AppCard>
        </PageContainer>
    );
};

export default DashboardGroup;
