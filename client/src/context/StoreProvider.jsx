import React from 'react'
import storeReducer from './storereducer';
import StoreContext from './storeContext';
import { useReducer } from 'react';
import decode_token from '@/utils/index';
;


const StoreProvider = ({children}) => {
    const [store, dispatch] = useReducer(storeReducer, {
        userinfo :decode_token(localStorage.getItem('news_token')) || null,
        token :localStorage.getItem('news_token') ||""
    });
  return <StoreContext.Provider value={{store, dispatch}}>
        {children}
  </StoreContext.Provider>
}

export default StoreProvider
