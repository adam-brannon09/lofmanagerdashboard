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
    </>
  )
}

export default Modal