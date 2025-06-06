import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { PrivateRoute } from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthProvider';
import { Login } from './pages/Login';
import { Signup } from './pages/SignUp';
import { TeamBoard } from './pages/TeamBoard';
import { NotFound } from './pages/NotFound';
import { PublicOnlyRoute } from './PublicOnlyRoutes';

export const AppWrapper = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path='/' element={<PrivateRoute><App /></PrivateRoute>} />
                <Route path='/login' element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path='/signup' element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                <Route path='/team-board' element={<PublicOnlyRoute><TeamBoard /></PublicOnlyRoute>} />
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </Router>
    </AuthProvider>
);
