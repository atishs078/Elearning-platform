import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/student/login")
    }, [])
    
  return (
    <div>
      
    </div>
  )
}

export default Home
