import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../../hooks/useAuthStatus'
import Loading from '../nonUserComponents/Loading'

// only allows logged in users to access the route example: /note
const PrivateRoute = () => {
    // useAuthStatus is a custom hook that returns loggedIn and checkingStatus
    const { loggedIn, checkingStatus } = useAuthStatus()
    // if checkingStatus is true, a loading message is rendered
    if (checkingStatus) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loading />
            </div>)
    }
    // if logged in the outlet is rendered. in app.js the outlet is the NoteScreen component, lines 20-22
    return loggedIn ? <Outlet /> : <Navigate to='/note' />
}

export default PrivateRoute