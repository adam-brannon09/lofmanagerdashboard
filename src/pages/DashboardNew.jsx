import React from 'react'
import NewLeads from '../components/NewLeadsAdmin'
import Time from '../components/nonUserComponents/Time'
import { Link } from 'react-router-dom'
import NewLeadsRep from '../components/repComponents/NewLeadsRep'

function DashboardNew() {

  return (
    <>
    <hr />
    <div className='flex justify-between my-10 mx-4'>

        <Link to="/dashboard/archived" className='btn lof-blue text-white'>See Assigned Leads</Link>
        <h1 className='text-2xl font-bold text-center'>New Leads</h1>
        <Time />
        </div>
    {/* <NewLeads /> */}
    <NewLeadsRep />
    </>
  )
}

export default DashboardNew