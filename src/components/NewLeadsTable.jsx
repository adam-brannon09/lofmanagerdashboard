import React from 'react'

function NewLeadsTable({allLeads, openModal}) {
  return (
    <>
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
    </>
  )
}

export default NewLeadsTable