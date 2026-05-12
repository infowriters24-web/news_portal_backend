import StoreContext from '@/context/storeContext'
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Protectrole = ({role}) => {
       const {store} = useContext(StoreContext)
    if(store.userinfo?.role === role){
        return<Outlet/>
    }else{
        return <Navigate to="/dashboard/unable-access"/>
    }
 
  
}

export default Protectrole
