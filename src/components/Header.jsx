import Logo from '../assets/images/liveOakLogo.png'
import { useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

function Header() {
    const auth = getAuth();
    const [signedIn, setSignedIn] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    
    useEffect(() => {
        // Check if user is signed in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                setUser(user);
                setSignedIn(true);
                // Fetch user's name from Firestore based on their email
                try {
                    const userDocRef = doc(db, 'users', user.email);
                    const userDocSnapshot = await getDoc(userDocRef);
                    // If user document exists, set the user's name
                    if (userDocSnapshot.exists()) {
                        setUserName(userDocSnapshot.data().displayName)
                    } else {
                        console.log('User document not found in Firestore');
                    }
                } catch (error) {
                    console.error('Error fetching user document:', error);
                }
            } else {
                setUser(null);
                setSignedIn(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);
    


    const onLogout = () => {
       try{ auth.signOut();
        setSignedIn(false);
        navigate("/");}
        catch(error){
            console.log(error)
        }
    }



    return (
        <nav className='flex flex-wrap mt-10 mb-10 justify-around bg-base-100'>
           <a href='https://liveoakfiber.com/'> <img src={Logo} alt="Live Oak Fiber" /></a>
            <h1 className='text-3xl lof-blue-text'>{userName}</h1>
            {signedIn && <button className='btn lof-red text-white' onClick={onLogout}>Logout</button>}
            <hr />
        </nav>
    )
}
export default Header



