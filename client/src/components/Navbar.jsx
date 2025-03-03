import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from "../assets/assets"
import { AppContext } from '../context/AppContext'
const Navbar = () => {
    const {openSignIn} = useClerk()
    const {user} = useUser()
    const {setShowRecruiterLogin} =  useContext(AppContext)
  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img src={assets.logo} alt="" />
            {
                user ?
                <div className='flex items-center gap-3'>
                    <Link to={"/applications"}>Applied jobs</Link>
                    <p>|</p>
                    <p>Hi,{user.firstName+" "+user.lastName}</p>
                    <UserButton/>
                </div> : 
            <div className='flex gap-4 max-sm:text-sm'>
                <button className='text-gray-600' onClick={()=>setShowRecruiterLogin(true)}>Recruiter login</button>
                <button onClick={()=>openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar