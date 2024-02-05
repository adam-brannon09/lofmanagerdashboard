import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.config'
import LeadsTableAdmin from './LeadsTableAdmin'
import ModalNoAssign from './ModalNoAssign'
import StatusBar from '../nonUserComponents/StatusBar'

function AssignedLeads() {
  const [allLeads, setAllLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadNums, setLeadNums] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLeads = async () => {
        setLoading(true)
        try {
            const querySnapshot = await getDocs(collection(db, 'assignedLeads'));
            const leads = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                leads.push({ ...doc.data(), id: doc.id });
                      // Sort the leads based on archivedTimestamp (newest to oldest)
                      leads.sort((a, b) => b.assignedTimestamp.toMillis() - a.assignedTimestamp.toMillis());
            });
            setAllLeads(leads);
            setLeadNums(leads.length)
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    fetchLeads(); // Call the fetchLeads function here

}, []); // Empty dependency array, meaning this effect runs once after the initial render

const handleRefresh = () => {
 
}


const openModal = (lead) => {
  setSelectedLead(lead);
  document.getElementById('my_modal_2').showModal();
};


  return (
    <div className='mb-20'>
    <StatusBar handleRefresh={handleRefresh} leadNums={leadNums}/>
    <LeadsTableAdmin allLeads={allLeads} openModal={openModal}/>

    <ModalNoAssign selectedLead={selectedLead} />
<hr />
</div>
  )
}

export default AssignedLeads