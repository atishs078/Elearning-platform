import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const StudentProtected = ({children}) => {
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('authtoken')){
            navigate('/student/login')
        }
    }, [navigate])

  return (
    <div>
      {children}
    </div>
  )
}

export default StudentProtected
