import StoreContext from '@/context/storeContext'
import React from 'react'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectDashboard = () => {
    const {store} = useContext(StoreContext)
    
    if(store.token){
        return <Outlet/>
    }else{
        return <Navigate to="/login"/>
    }
 
  
}

export default ProtectDashboard
