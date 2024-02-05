function ContactedModal({selectedLead}) {
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
          <p>Contacted at: {selectedLead.contactedTimestamp && new Date(selectedLead.contactedTimestamp.toMillis()).toLocaleString()}</p>
        </>
      )}
      <hr />
      
      <button className="btn lof-red text-white mt-8" onClick={() => document.getElementById('my_modal_2').close()}>Close</button>
    </div>
  </dialog>
      </>
    )
  }

export default ContactedModal