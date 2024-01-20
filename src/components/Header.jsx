import Logo from '../assets/images/liveOakLogo.png'
import { useState } from "react"
import { getAuth } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Header() {
    const auth = getAuth();
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            setSignedIn(true)
            console.log(user)
        }
    }, [user])

    const onLogout = () => {
       try{ auth.signOut();
        setSignedIn(false);
        navigate("/");}
        catch(error){
            console.log(error)
        }
    }

    return (
        <nav className='flex flex-wrap mt-10 mb-20 justify-around bg-base-100'>
           <a href='https://liveoakfiber.com/'> <img src={Logo} alt="Live Oak Fiber" /></a>
            <h1 className='text-3xl lof-blue-text'>Sales Manager Lead Dashboard</h1>
            {signedIn && <button className='btn lof-red text-white' onClick={onLogout}>Logout</button>}
            <hr />
        </nav>
    )
}
export default Header