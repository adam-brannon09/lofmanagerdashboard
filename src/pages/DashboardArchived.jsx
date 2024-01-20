import ArchivedLeads from "../components/ArchivedLeads"
import Time from '../components/Time'
import { Link } from 'react-router-dom'

function DashboardArchived() {
  return (
    <>
    <hr />
     <div className='flex justify-between my-10 mx-4'>
        <Link to="/dashboard/newleads" className='btn lof-blue text-white'>New Leads</Link>
        <h1 className='text-2xl font-bold text-center'>Archived Leads</h1>
        <Time />
        </div>
    <ArchivedLeads />
    </>
  )
}

export default DashboardArchived