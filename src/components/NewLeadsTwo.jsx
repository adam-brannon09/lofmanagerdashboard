import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify";
import { FaRedoAlt } from "react-icons/fa";
import StatusBar from './StatusBar';
import NewLeadsTable from './NewLeadsTable';
import Modal from './Modal';


function NewLeadsTwo() {
    const auth = getAuth()
    const [user, setUser] = useState(true)
    const [allLeads, setAllLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
    const [repAssigned, setRepAssigned] = useState('')
    const [leadNums, setLeadNums] = useState(0)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(true);  
          } else {
            setUser(false);
            console.log('No user is signed in.');
          }
        });
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
                "travis@liveoak.com": "travisSelski",
                "savannah@liveoak.com": "savannahMcquaig"
            };
         
            try {
                setLoading(true)
               
                 
          const userCollection = salesRepCollections[repEmail];

                const querySnapshot = await getDocs(collection(db, userCollection));
                const leads = [];
                querySnapshot.forEach((doc) => {
                    console.log("lead found");
                    leads.push({ ...doc.data(), id: doc.id });
                    
                });
                
                setLeadNums(leads.length)
                setAllLeads(leads);
                console.log("leads set")
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
            const archivedLead = {
              ...selectedLead,
              salesRep: repAssigned,
              archivedTimestamp: serverTimestamp(),
            };
    
            // Add the lead to the "archived" collection
            const archivedLeadRef = await addDoc(collection(db, 'archived'), archivedLead);
    
            console.log('Lead assigned and archived with ID:', archivedLeadRef.id);
            // Delete the lead from the "leads" collection
            await deleteDoc(doc(db, 'leads', selectedLead.id));

            console.log('Lead deleted from "leads" collection.');
            
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
       <StatusBar handleRefresh={handleRefresh} leadNums={leadNums}/>
       <NewLeadsTable allLeads={allLeads} openModal={openModal}/>
         <Modal 
         selectedLead={selectedLead} 
         repAssigned={repAssigned} 
         handleChange={handleChange} 
         saveAssignment={saveAssignment} 
         closeModal={() => document.getElementById('my_modal_2').close()}
         />

    </div>
  )
}

export default NewLeadsTwo