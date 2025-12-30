import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import { toast } from 'react-toastify';
import { User, LogIn, UserPlus, Key } from 'lucide-react';

const AccountApp = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login | register | dash
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    // Check auto login
    const t = localStorage.getItem('zenv_token');
    if(t) fetchProfile();
  }, []);

  const fetchProfile = () => {
      API.auth.profile().then(res => {
          setUser(res.data.user);
          setView('dash');
      }).catch(() => {
          localStorage.removeItem('zenv_token');
          setView('login');
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        // Envoi strict
        await API.auth.register({
            username: form.username,
            email: form.email,
            password: form.password
        });
        toast.success("Compte créé ! Connectez-vous.");
        setView('login');
    } catch (err) {
        console.error(err);
        toast.error("Erreur d'inscription. Vérifiez les champs.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await API.auth.login({
            username: form.username,
            password: form.password
        });
        localStorage.setItem('zenv_token', res.data.token.access_token);
        fetchProfile();
        toast.success("Connecté !");
    } catch {
        toast.error("Identifiants incorrects");
    }
  };

  if (view === 'dash' && user) {
      return (
          <div className="p-8 text-white h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {user.username[0].toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold mb-2">Bienvenue, {user.username}</h1>
              <p className="text-gray-400 mb-8">{user.email}</p>
              
              <div className="w-full max-w-md bg-[#2d2d2d] p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold flex items-center gap-2 mb-4"><Key size={16}/> API Token</h3>
                <button onClick={() => API.auth.genToken().then(() => toast.success("Token généré !"))} className="w-full bg-blue-600 py-2 rounded font-bold hover:bg-blue-500">
                    Générer un nouveau Token
                </button>
              </div>
              
              <button onClick={() => { localStorage.removeItem('zenv_token'); setUser(null); setView('login'); }} className="mt-8 text-red-400 hover:underline">
                Déconnexion
              </button>
          </div>
      );
  }

  return (
    <div className="p-8 h-full flex items-center justify-center text-white">
      <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">{view === 'login' ? 'Connexion' : 'Inscription'}</h1>
        
        <div className="space-y-2">
            <input 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded focus:border-blue-500 outline-none"
                placeholder="Nom d'utilisateur"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
            />
            {view === 'register' && (
                <input 
                    className="w-full bg-black/50 border border-gray-700 p-3 rounded focus:border-blue-500 outline-none"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
            )}
            <input 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded focus:border-blue-500 outline-none"
                placeholder="Mot de passe"
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
            />
        </div>

        <button className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-500 transition-colors">
            {view === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4 cursor-pointer hover:text-white" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
            {view === 'login' ? "Pas de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </p>
      </form>
    </div>
  );
};
export default AccountApp;