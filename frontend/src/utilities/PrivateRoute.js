import { Navigate } from 'react-router-dom'
import { useAuth } from './utilities/AuthContext'

export default function PrivateRoute () {
    const { isAuthenticated, user } = useAuth()

    if(!isAuthenticated) {
        return <Navigate to='login' />
    }

    if(roles && !roles.includes(user?.role)) {
        return <Navigate to='/unauthorized' />
    }

    return children;
}