import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from './pages/Main';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { getItem } from './utils/storage';

function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token');

    return token ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path='/' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />

                <Route element={<ProtectedRoutes redirectTo='/' />}>
                    <Route path='/main' element={<Main />} />
                </Route>
                
            </Routes>
        </>
    );
}

export default MainRoutes;