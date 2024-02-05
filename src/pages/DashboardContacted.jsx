import ContactedLeads from "../components/repComponents/ContactedLeads"
import Time from '../components/nonUserComponents/Time'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"

function DashboardContacted() {

const [user, setUser] = useState(null)

const [signedIn, setSignedIn] = useState(false);
const [userName, setUserName] = useState('');
const [collectionName , setCollectionName] = useState('')
const auth = getAuth()

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
                    setCollectionName(userDocSnapshot.data().collectionName)
                    console.log(userDocSnapshot.data().isAdmin)
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


  return (
    <>
    <hr />
     <div className='flex justify-between my-10 mx-4'>
        <Link to="/dashboard/newleads" className='btn lof-blue text-white'>See New Leads</Link>
        <h1 className='text-2xl font-bold text-center'>Contacted Leads</h1>
        <Time />
        </div>
    <ContactedLeads />
    
    </>
  )
}

export default DashboardContacted