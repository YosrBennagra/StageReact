import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import DashboardRequests from 'src/views/dashboards/requests/DashboardRequests';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(lazy(() => import('../views/authentication/auth2/ForgotPassword2')),);
const ResetPw = Loadable(lazy(() => import('../views/authentication/auth1/ResetPw')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));
const ClickToVerify = Loadable(lazy(() => import('../views/authentication/Confirm Email')));
const VerifyMail = Loadable(lazy(() => import('../views/authentication/VerifiyEmail')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

// dashboards 
const DashboardAdmin = Loadable(lazy(() => import('../views/dashboards/DashboardAdmin')));
const Responsables = Loadable(lazy(() => import('../views/dashboards/responsables/Responsables')));
const Teachers = Loadable(lazy(() => import('../views/dashboards/teachers/Teachers')));
const DashboardStudent = Loadable(lazy(() => import('../views/dashboards/students/DashboardStudent')));
const DashboardGroup = Loadable(lazy(() => import('../views/dashboards/groups/DashboardGroup')));
const DashboardAssignments = Loadable(lazy(() => import('../views/dashboards/assignements/DashboardAssignments')));
const StudentDashboardAssignments = Loadable(lazy(() => import('../views/dashboards/assignements/StudentDashboardAssignments')));
const DashboardInstitutions = Loadable(lazy(() => import('../views/dashboards/institutions/DashboardInstitutions')));
const DashboardSalary = Loadable(lazy(() => import('../views/dashboards/salaries/DashboardSalary')));
const MySchedule = Loadable(lazy(() => import('../views/dashboards/MySchedule/MySchedule')));
const MyResults = Loadable(lazy(() => import('../views/dashboards/Results/MyResults')));
const MyInstitution = Loadable(lazy(() => import('../views/dashboards/institutions/MyInstitution')));
const AddAccount = Loadable(lazy(() => import('../views/dashboards/addaccount/Addaccount')));

// assignments
const CreateAssignment = Loadable(lazy(() => import('../views/pages/assignments/CreateAssignment')));
const StudentAssignment = Loadable(lazy(() => import('../views/MyAssignments/StudentAssignment')));
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/landingpage" /> },
      { path: '/admin/dashboard', exact: true, element: <DashboardAdmin /> },
      { path: '/responsables', exact: true, element: <Responsables /> },
      { path: '/teachers', exact: true, element: <Teachers /> },
      { path: '/dashboard/students', exact: true, element: <DashboardStudent /> },
      { path: '/dashboard/groups', exact: true, element: <DashboardGroup /> },
      { path: '/dashboard/assignments', exact: true, element: <DashboardAssignments /> },
      { path: '/dashboard/salaries', exact: true, element: <DashboardSalary /> },
      { path: '/student/dashboard/assignments', element: <StudentDashboardAssignments /> },
      { path: '/dashboard/institutions', exact: true, element: <DashboardInstitutions /> },
      { path: '/edit/institution/:InstitutionId', element: <MyInstitution /> },
      { path: '/add-account', element: <AddAccount /> },
      { path: '/MyResults', element: <MyResults /> },
      { path: '/dashboard/requests', exact: true, element: <DashboardRequests /> },
      { path: '/create/assignment/:id', element: <CreateAssignment /> },
      { path: '/pass/assignment/:id', element: <StudentAssignment /> },
      { path: '/MySchedule', element: <MySchedule /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/verify', element: <VerifyMail /> },
      { path: '/auth/confirm/*', element: <ClickToVerify /> },
      { path: '/auth/resetpw', element: <ResetPw /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
