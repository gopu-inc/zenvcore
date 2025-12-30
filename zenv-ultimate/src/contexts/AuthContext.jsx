import React, {createContext, useContext, useState, useEffect} from 'react';
import {AuthService} from '../services/api';
const Ctx = createContext(null);
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = localStorage.getItem('zenv_token');
        if(t) AuthService.getProfile().then(r => setUser(r.data.user)).catch(()=>localStorage.removeItem('zenv_token')).finally(()=>setLoading(false));
        else setLoading(false);
    }, []);
    const login = (t, u) => { localStorage.setItem('zenv_token', t); setUser(u); };
    const logout = () => { localStorage.removeItem('zenv_token'); setUser(null); };
    return <Ctx.Provider value={{user, login, logout, loading}}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);