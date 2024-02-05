import React from 'react'
import { FaRedoAlt } from "react-icons/fa";

function StatusBar({leadNums, handleRefresh}) {
  return (
    <>
         <hr />
        <div className='flex justify-end items-center'>
        <button className="inline-flex items-center btn btn-ghost" alt="Refresh Leads" onClick={handleRefresh}>Refresh <FaRedoAlt /></button>
        <p className='text-end mr-6 ml-4'>{leadNums === 0 ? '0 Leads Received' : leadNums > 1 ? `${leadNums} Leads Received` : `${leadNums} Lead Received`}</p>
        </div>
    </>


  )
}

export default StatusBar