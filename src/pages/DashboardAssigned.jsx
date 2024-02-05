import AssignedLeads from "../components/adminComponents/AssignedLeads"
import ContactedLeads from "../components/repComponents/ContactedLeads"
import Time from '../components/nonUserComponents/Time'
import { Link } from 'react-router-dom'

function DashboardAssigned() {
  return (
    <>
    <hr />
     <div className='flex justify-between my-10 mx-4'>
        <Link to="/dashboard/newleads" className='btn lof-blue text-white'>See New Leads</Link>
        <h1 className='text-2xl font-bold text-center'>Assigned Leads</h1>
        <Time />
        </div>
    <AssignedLeads />
    </>
  )
}

export default DashboardAssigned