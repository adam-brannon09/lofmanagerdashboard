import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Skeleton from '../components/Skeleton'

// only allows logged in users to access the route example: /note
const PrivateRoute = () => {
    // useAuthStatus is a custom hook that returns loggedIn and checkingStatus
    const { loggedIn, checkingStatus } = useAuthStatus()
    // if checkingStatus is true, a loading message is rendered
    if (checkingStatus) {
        return (<h1>Loading...</h1>)
    }
    // if logged in the outlet is rendered. in app.js the outlet is the NoteScreen component, lines 20-22
    return loggedIn ? <Outlet /> : <Navigate to='/note' />
}

export default PrivateRoute