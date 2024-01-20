import { useState, useEffect, useRef } from 'react'
import {Link} from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify";

function Archived() {
  const [allLeads, setAllLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)


  useEffect(() => {
    const fetchLeads = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'archived'));
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
    <th>Account Type</th>
    <th>Plan Selected</th>
    <th>Assigned Rep</th>
    <th>Assigned On</th>
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
    <td>{lead.businessOrResidential}</td>
    <td>{lead.plan}</td>
    <td>{lead.salesRep}</td>
    <td>{lead.archivedTimestamp && new Date(lead.archivedTimestamp.toMillis()).toLocaleString()}</td>
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
  </>
)}
<hr />

<button className="btn lof-red text-white mt-8" onClick={() => document.getElementById('my_modal_2').close()}>Close</button>
</div>
</dialog>
</div>
  )
}

export default Archived