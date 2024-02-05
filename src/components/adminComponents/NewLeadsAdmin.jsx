import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { toast } from "react-toastify";
import { FaRedoAlt } from "react-icons/fa";
import Modal from './Modal'
import LeadsTableAdmin from './LeadsTableAdmin'
import StatusBar from '../nonUserComponents/StatusBar';


function NewLeadsAdmin() {
    const auth = getAuth()
    const [user, setUser] = useState(true)
    const [allLeads, setAllLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
    const [repAssigned, setRepAssigned] = useState('')
    const [leadNums, setLeadNums] = useState(0)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [loading, setLoading] = useState(false)
    const [signedIn, setSignedIn] = useState(false);
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
                      console.log(`${userDocSnapshot.data().displayName} is signed in.`)
                      
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
                "katy@liveoak.com": "katySarubbi",
                "chris@liveoak.com": "chrisWallace",
                "gabby@liveoak.com": "gabbyHuddleston",
                "travis@liveoak.com": "travisSelski",
                "savannah@liveoak.com": "savannahMcquaig"
            };
         
            try {
                setLoading(true)
               
                 
          const userCollection = salesRepCollections[repEmail];

                const querySnapshot = await getDocs(collection(db, "newLeads"));
                const leads = [];
                querySnapshot.forEach((doc) => {
                    leads.push({ ...doc.data(), id: doc.id });
                    leads.sort((a, b) => b.submittedAt.toMillis() - a.submittedAt.toMillis());
                    
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
        setRepAssigned(e.target.value);
        };

      const handleRefresh = () => {
        setRefreshCounter((prevCounter) => prevCounter + 1);
      }

      // Send Email Function that Sends an email to the assigned rep when a lead is assigned to them
      const sendEmail = async () => {
        if (selectedLead && repAssigned) {
          const subject = `New Lead Assignment: ${selectedLead.firstName} ${selectedLead.lastName}`;
          const body = `
            You have been assigned a new lead. Please contact them as soon as possible.
            Lead Details:
            Name: ${selectedLead.firstName} ${selectedLead.lastName}
            Address: ${selectedLead.streetAddress}, ${selectedLead.city}, ${selectedLead.state} ${selectedLead.zipCode}
            Email: ${selectedLead.email}
            Phone: ${selectedLead.phone}
            Account Type: ${selectedLead.businessOrResidential}
            Selected Plan: ${selectedLead.plan}
            Notes: ${selectedLead.message}
            Received: ${selectedLead.submittedAt && new Date(selectedLead.submittedAt.toMillis()).toLocaleString()}
    
            Assigned to Rep: ${repAssigned}
          `;
    
          const mailtoLink = `mailto:${repAssigned}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
          // Open default email client with pre-filled details
          window.location.href = mailtoLink;
        } else {
          toast.error('Please select a lead and a sales rep before sending the email.');
        }
      };



      const saveAssignment = async () => {
        setLoading(true)
        try {
          // Check if a sales rep is selected
          if (repAssigned) {
            // Add the lead to the "archived" collection with sales rep and timestamp
            const assignedLead = {
              ...selectedLead,
              salesRep: repAssigned,
              assignedTimestamp: serverTimestamp(),
            };
    
            // Add the lead to the "archived" collection
            const assignedLeadRef = await addDoc(collection(db, 'assignedLeads'), assignedLead);
    
            console.log('Lead assigned and archived with ID:', assignedLeadRef.id);
            // Delete the lead from the "leads" collection
            await deleteDoc(doc(db, 'newLeads', selectedLead.id));

            console.log('Lead deleted from "newLeads" collection.');
            
            // Update the state to remove the archived lead from the table
            setAllLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== selectedLead.id));
            // Update the lead count
            setLeadNums((prevNums) => prevNums - 1);
            // Set loading to false
            setLoading(false)
            // Close the modal
            document.getElementById('my_modal_2').close();
            // Show a toast message
            toast.success('Lead assigned and archived successfully!');
            // Send an email to the assigned rep
            sendEmail();

          } else {
            toast.error('Please select a sales rep before saving assignment.');
            console.error('Please select a sales rep before saving assignment.');
          }
        } catch (error) {
            toast.error('Error saving assignment.');
          console.error('Error saving assignment:', error);
        }
      };

      


    


  return (
    <div>
        <hr />
        <StatusBar handleRefresh={handleRefresh} leadNums={leadNums}/>
        <LeadsTableAdmin allLeads={allLeads} openModal={openModal}/>

<Modal selectedLead={selectedLead} repAssigned={repAssigned} handleChange={handleChange} saveAssignment={saveAssignment} />
    </div>
  )
}

export default NewLeadsAdmin