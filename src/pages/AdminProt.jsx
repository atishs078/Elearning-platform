import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const AdminProt = ({children}) => {
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('adminToken')){
            navigate('/admin/login')
        }
    }, [navigate])

  return (
    <div>
      {children}
    </div>
  )
}

export default AdminProt
