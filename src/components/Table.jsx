import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'



function Table() {
    const auth = getAuth()
    const isMounted = useRef(true)
    const [allLeads, setAllLeads] = useState([])
    const [selectedLead, setSelectedLead] = useState(null)
   
    
    
   

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


    


  return (
    <div>
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
      {/* row 1 */}

      {/* Open the modal using document.getElementById('ID').showModal() method */}


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

<dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">{selectedLead && `${selectedLead.firstName} ${selectedLead.lastName}`}</h3>
    <hr />
    {selectedLead && (
      <>
        <p>Address: {`${selectedLead.streetAddress} ${selectedLead.city} ${selectedLead.state} ${selectedLead.zipCode}`}</p>
        <p>Email: {selectedLead.email}</p>
        <p>Phone: {selectedLead.phone}</p>
        <p>Account Type: {selectedLead.businessOrResidential}</p>
        <p>Selected Plan: {selectedLead.plan}</p>
        <p>Notes: {selectedLead.message}</p>
      </>
    )}

    <button className="btn lof-blue text-white" onClick={() => document.getElementById('my_modal_2').close()}>Close</button>
  </div>
</dialog>



    </div>
  )
}

export default Table