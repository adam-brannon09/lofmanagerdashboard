import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDoc, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { toast } from "react-toastify";
import { FaRedoAlt } from "react-icons/fa";
import StatusBar from '../nonUserComponents/StatusBar';
import LeadsTable from '../nonUserComponents/LeadsTable';
import RepModal from './RepModal';


function NewLeadsRep() {
    const auth = getAuth()
    const [user, setUser] = useState(null)
    const [signedIn, setSignedIn] = useState(false);
const [userName, setUserName] = useState('');

    const [allLeads, setAllLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
    const [leadNums, setLeadNums] = useState(0)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [loading, setLoading] = useState(false)
    const [collectionName , setCollectionName] = useState('')

  

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
           //Determine collection by user
          // Create a mapping between sales reps and collections

          if(auth.currentUser){
            const repEmail = auth.currentUser.email;
              const salesRepCollections = {
                "aaron@liveoak.com": "aaronPadgett",
                "byran@liveoak.com": "bryanBennett",
                "barrett@liveoak.com": "barrettHibbett",
                "chris@liveoak.com": "chrisWallace",
                "gabby@liveoak.com": "gabbyHuddleston",
                "katy@liveoak.com": "katySarubbi",
                "travis@liveoak.com": "travisSelski",
                "savannah@liveoak.com": "savannahMcquaig"
            };
         
            try {
                setLoading(true)
               
                 
          const userCollection = salesRepCollections[repEmail];

                const querySnapshot = await getDocs(collection(db, userCollection));
                const leads = [];
                querySnapshot.forEach((doc) => {
                    leads.push({ ...doc.data(), id: doc.id });
                    
                });
                
                setLeadNums(leads.length)
                setAllLeads(leads);
                setLoading(false)
                
            } catch (error) {
                console.error(error);
            }
        }
      }
    
        fetchLeads(); // Call the fetchLeads function here
    
    }, [refreshCounter]); // refreshCounter is a dependency of this effect, meaning it runs when refreshCounter changes. RefreshCounter changes when the refresh button is clicked.
    
    const openModal = (lead) => {
        setSelectedLead(lead);
        document.getElementById('my_modal_2').showModal();
      };

      const handleChange = (e) => {
        setRepAssigned(userName);
        };

      const handleRefresh = () => {
        setRefreshCounter((prevCounter) => prevCounter + 1);
      }



      const saveAssignment = async () => {
        setLoading(true)
        try {
          if (userName) {
          
            // Add the lead to the "Contacted" collection with sales rep and timestamp
            const contactedLead = {
              ...selectedLead,
              salesRep: userName,
              contactedTimestamp: serverTimestamp(),
            }
          
    
            // Add the lead to the "archived" collection
            const contactedLeadRef = await addDoc(collection(db, `${collectionName}Contacted`), contactedLead);
    
            console.log('Lead assigned and archived with ID:', contactedLeadRef.id);
            // Delete the lead from the "leads" collection
            await deleteDoc(doc(db, `${collectionName}`, selectedLead.id));

            console.log(`Lead deleted from ${collectionName} with ID: ${selectedLead.id}`);
            
            // Update the state to remove the archived lead from the table
            setAllLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== selectedLead.id));
            // Update the lead count
            setLeadNums((prevNums) => prevNums - 1);
            // Set loading to false
            setLoading(false)
            // Close the modal
            document.getElementById('my_modal_2').close();
            // Show a toast message
            toast.success('Lead marked as contacted and archived successfully!');
            

          } else {
            console.error('Please select a sales rep before saving assignment.');
          }
        } catch (error) {
            toast.error('Error saving assignment.');
          console.error('Error saving assignment:', error);
        }
      };



  return (
    <div>
       <StatusBar handleRefresh={handleRefresh} leadNums={leadNums}/>
       <LeadsTable allLeads={allLeads} openModal={openModal}/>
         <RepModal 
         selectedLead={selectedLead} 
        //  repAssigned={repAssigned} 
         handleChange={handleChange} 
         saveAssignment={saveAssignment} 
         closeModal={() => document.getElementById('my_modal_2').close()}
         />

    </div>
  )
}

export default NewLeadsRep