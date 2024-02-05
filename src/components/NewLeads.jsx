import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify";
import { FaRedoAlt } from "react-icons/fa";


function NewLeads() {
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
        console.log("selectedLead set")
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
        <hr />
        <div className='flex justify-end items-center'>
        <button className="inline-flex items-center btn btn-ghost" alt="Refresh Leads" onClick={handleRefresh}>Refresh <FaRedoAlt /></button>
        <p className='text-end mr-6 ml-4'>{leadNums === 0 ? '0 Leads Received' : leadNums > 1 ? `${leadNums} Leads Received` : `${leadNums} Lead Received`}</p>
        </div>
        <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Name</th>
        <th>E-Mail</th>
        <th>Phone</th>
        <th>Street</th>
        <th>City</th>
        <th>State</th>
        <th>Zip</th>
        <th>Account Type</th>
        <th>Plan Selected</th>
      </tr>
    </thead>
    <tbody>


      {/* leads will be mapped through and turned into rows. lead notes will be visible in the modal*/}

    {allLeads.map((lead) => (
      
        <tr key={lead.id} className='hover cursor-pointer'
        onClick={() => openModal(lead)}
        >
        <td>{`${lead.firstName} ${lead.lastName}`}</td>
        <td>{lead.email}</td>
        <td>{lead.phone}</td>
        <td>{lead.streetAddress}</td>
        <td>{lead.city}</td>
        <td>{lead.state}</td>
        <td>{lead.zipCode}</td>
        <td>{lead.businessOrResidential}</td>
        <td>{lead.plan}</td>
      </tr>
    ))}

    </tbody>
  </table>
</div>

{/* modal */}
<dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">{selectedLead && `${selectedLead.firstName} ${selectedLead.lastName}`}</h3>
    <hr />
    {selectedLead && (
      <>
        <p>Address: {`${selectedLead.streetAddress}, ${selectedLead.city}, ${selectedLead.state} ${selectedLead.zipCode}`}</p>
        <p>Email: {selectedLead.email}</p>
        <p>Phone: {selectedLead.phone}</p>
        <p>Account Type: {selectedLead.businessOrResidential}</p>
        <p>Selected Plan: {selectedLead.plan}</p>
        <p>Notes: {selectedLead.message ? selectedLead.message : `No notes from lead.`}</p>
        <p>Received: {selectedLead.submittedAt && new Date(selectedLead.submittedAt.toMillis()).toLocaleString()}</p>
      </>
    )}
    <hr />
    <div className='mt-8'>
    <label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text">Assign To Rep</span>
  </div>
  <select 
  className="select select-bordered"
  value={repAssigned}
  onChange={handleChange}>
    <option value="">Select a Rep to Assign Lead</option>
    <option value="adam.brannon09@icloud.com">Adam Brannon</option>
    <option value="amber.brannon@liveoakfiber.com">Amber Brannon</option>
    <option value="joey.broadway@liveoakfiber.com">Joey Broadway</option>
  </select>
  
</label>
    </div>
    <button className='btn lof-blue text-white' onClick={saveAssignment} >Save Assignment</button>
    <button className="btn lof-red text-white mt-8" onClick={() => document.getElementById('my_modal_2').close()}>Close</button>
  </div>
</dialog>
    </div>
  )
}

export default NewLeads