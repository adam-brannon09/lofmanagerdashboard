import React from 'react'

function Modal({selectedLead, repAssigned, handleChange, saveAssignment}) {
  return (
    <>
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
        <p>Recieved: {new Date(selectedLead.submittedAt.toMillis()).toLocaleString()}</p>
        <p>Assigned: {selectedLead.assignedTimestamp && new Date(selectedLead.assignedTimestamp.toMillis()).toLocaleString()}</p>
        {selectedLead.salesRep? <p>Rep Assigned: {selectedLead.salesRep}</p> : <></>}
      </>
    )}
    <hr />
    <div className='mt-8'>
    <label className="form-control w-full max-w-xs">
  
  
  
</label>
    </div>
    <button className="btn lof-red text-white mt-8" onClick={() => document.getElementById('my_modal_2').close()}>Close</button>
  </div>
</dialog>
    </>
  )
}

export default Modal