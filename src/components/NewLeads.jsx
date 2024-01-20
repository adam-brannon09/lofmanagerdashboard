import { useState, useEffect, useRef } from 'react'
import {Link} from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify";


function NewLeads() {
    const auth = getAuth()
    const isMounted = useRef(true)
    const [allLeads, setAllLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
    const [repAssigned, setRepAssigned] = useState('')
   
    const currentDate = new Date();
    
   

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'leads'));
                const leads = [];
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    leads.push({ ...doc.data(), id: doc.id });
                });
                setAllLeads(leads);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchLeads(); // Call the fetchLeads function here
    
    }, []); // Empty dependency array, meaning this effect runs once after the initial render
    
    const openModal = (lead) => {
        setSelectedLead(lead);
        document.getElementById('my_modal_2').showModal();
      };
      const handleChange = (e) => {
        setRepAssigned(e.target.value);
        };


      const saveAssignment = async () => {
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

            // Close the modal
            document.getElementById('my_modal_2').close();
            // Show a toast message
            toast.success('Lead assigned and archived successfully!');

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
        <tr key={lead.id} className='hover'
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
        <p>Notes: {selectedLead.message}</p>
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
    <option value="" selected>Select a Rep to Assign Lead</option>
    <option value="adam.brannon09@icloud.com">Adam Brannon</option>
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