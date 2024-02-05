import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase.config'
import ContactedModal from './ContactedModal'
import LeadsTable from '../nonUserComponents/LeadsTable'
import StatusBar from '../nonUserComponents/StatusBar'


function ContactedLeads() {

  const [allLeads, setAllLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadNums, setLeadNums] = useState(0)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [collectionName , setCollectionName] = useState('')
  const [refreshCounter, setRefreshCounter] = useState(0)

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


  useEffect(() => {
    const fetchLeads = async () => {
        setLoading(true)
        try {
            const querySnapshot = await getDocs(collection(db,`${collectionName}Contacted`));
            const leads = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                leads.push({ ...doc.data(), id: doc.id });
                      // Sort the leads based on archivedTimestamp (newest to oldest)
                leads.sort((a, b) => b.contactedTimestamp.toMillis() - a.contactedTimestamp.toMillis());
            });
            setAllLeads(leads);
            setLeadNums(leads.length)
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    fetchLeads(); // Call the fetchLeads function here

}, [collectionName]); // Empty dependency array, meaning this effect runs once after the initial render


const handleRefresh = () => {
  setRefreshCounter((prevCounter) => prevCounter + 1);
}
const openModal = (lead) => {
  setSelectedLead(lead);
  document.getElementById('my_modal_2').showModal();
};


  return (
    <div className='mb-20'>
    <StatusBar handleRefresh={handleRefresh} leadNums={leadNums}/>
    <LeadsTable allLeads={allLeads} openModal={openModal} />
    <ContactedModal selectedLead={selectedLead} />


</div>
  )
}

export default ContactedLeads