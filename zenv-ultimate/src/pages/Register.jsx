import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    // Utilisation d'un state strict pour le JSON
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validation basique
        if(!formData.username || !formData.email || !formData.password) {
            toast.warning("Veuillez remplir tous les champs");
            setLoading(false);
            return;
        }

        try {
            console.log("Envoi données:", formData);
            await AuthService.register(formData);
            toast.success('Compte créé avec succès ! Connectez-vous.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || 'Erreur lors de l\'inscription';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <form onSubmit={submit} className="bg-card border border-border p-8 rounded-xl w-full max-w-md space-y-6 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
                    <p className="text-gray-400">Rejoignez le Zenv Hub</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-border p-3 pl-10 rounded text-white focus:border-primary outline-none" 
                            placeholder="Nom d'utilisateur"
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-border p-3 pl-10 rounded text-white focus:border-primary outline-none" 
                            placeholder="Email"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-border p-3 pl-10 rounded text-white focus:border-primary outline-none" 
                            placeholder="Mot de passe"
                        />
                    </div>
                </div>

                <button disabled={loading} className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 text-white flex justify-center items-center gap-2 transition-colors">
                    {loading ? 'Création...' : <><UserPlus size={18}/> Créer mon compte</>}
                </button>
                
                <p className="text-center text-sm text-gray-500">
                    Déjà un compte ? <Link to="/login" className="text-blue-400 hover:underline">Connexion</Link>
                </p>
            </form>
        </div>
    );
};
export default Register;