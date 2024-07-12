import { TabContext, TabPanel } from '@mui/lab';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    Fade,
    Tab,
    Tabs,
    Tooltip,
    useMediaQuery,
} from '@mui/material';
import { IconBook2, IconUser } from '@tabler/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useDispatch, useSelector } from 'react-redux';
import StudentSearch from 'src/components/apps/TeacherGroupsLayout/StudentSearch';
import AppCard from 'src/components/shared/AppCard';
import breadcrumbImg from '../../../assets/images/breadcrumb/emailSv.png';
import EmailContent from '../../../components/apps/TeacherGroupsLayout/EmailContent';
import GroupsLeftLayout from '../../../components/apps/TeacherGroupsLayout/GroupsLeftLayout';
import LessonList from '../../../components/apps/TeacherGroupsLayout/LessonList';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { fetchGroupLessons, fetchGroupMembers } from '../../../store/apps/groups/groupsSlice';

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
    const dispatch = useDispatch();
    const { selectedLesson, members: globalMembers } = useSelector((state) => state.groups);
    const user = useAuthUser();
    console.log("🚀 ~ file: DashboardGroup.js:47 ~ DashboardGroup ~ user:", user);
    const [groupMembers, setGroupMembers] = useState([]);
    const [value, setValue] = useState('1');
    const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);
    const currentLoggedInUser = useAuthUser();

    useEffect(() => {
        if (currentSelectedGroup != null) {
            dispatch(fetchGroupMembers(currentSelectedGroup));
            dispatch(fetchGroupLessons());
        }
    }, [dispatch]);

    useEffect(() => {
        if (globalMembers && Array.isArray(globalMembers)) {
            setGroupMembers(globalMembers);
        } else {
            setGroupMembers([]);
        }
    }, [globalMembers]);
    const handleDeleteUserFromGroup = async (id) => {
        console.log('User To Delete: ', id, currentSelectedGroup);
        try {
            await axios.put(`http://localhost:3001/groups/${currentSelectedGroup}/removeUser/${id}`);
            setGroupMembers((prevMembers) => Array.isArray(prevMembers) ? prevMembers.filter((user) => user._id !== id) : []);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                    }}
                >
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
                            <Divider sx={{ mt: 0 }} />
                            <LessonList showrightSidebar={() => setRightSidebarOpen(true)} />
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
                            {user.role !== 'admin' && user.role !== 'responsable' ? null :
                                <StudentSearch onClick={() => setLeftSidebarOpen(true)} />
                            }
                            <Divider sx={{ my: 0 }} />
                            {groupMembers.length > 0 ? (
                                groupMembers.map((userL) => (
                                    <Tooltip
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        title={
                                            <div>
                                                <div>Email: {userL.email}</div>
                                                <div>Username: {userL.username}</div>
                                            </div>
                                        }
                                        key={userL._id}
                                    >
                                        {user.role !== 'admin' && user.role !== 'responsable' ?
                                            <Chip
                                                sx={{
                                                    m: 1,
                                                    textTransform: 'capitalize'
                                                }}
                                                key={userL._id}
                                                avatar={<Avatar alt={userL.email} />}
                                                label={`${userL.firstname} ${userL.lastname}`}
                                                color={userL._id === currentLoggedInUser.userId ? 'success' : 'primary'}
                                            />
                                            :
                                            <Chip
                                                sx={{
                                                    m: 1,
                                                    textTransform: 'capitalize'
                                                }}
                                                key={userL._id}
                                                avatar={<Avatar alt={userL.email} />}
                                                label={`${userL.firstname} ${userL.lastname}`}
                                                color={userL._id === currentLoggedInUser.userId ? 'success' : 'primary'}
                                                onDelete={() => handleDeleteUserFromGroup(userL._id)}
                                            />
                                        }
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
                            <EmailContent lesson={selectedLesson} />
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
                            <EmailContent lesson={selectedLesson} />
                        </Box>
                    </Drawer>
                )}
            </AppCard>
        </PageContainer>
    );
};

export default DashboardGroup;
