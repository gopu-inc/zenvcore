import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Lock } from "lucide-react"
import { useStore } from "@/hooks/useStore"
import { authService } from "@/services/api"
import { toast } from "react-hot-toast"

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useStore()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !email || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit faire au moins 8 caractères")
      return
    }
    
    try {
      setLoading(true)
      const response = await authService.register(username, email, password)
      
      setUser(response.user)
      setToken(response.token.access_token)
      localStorage.setItem("zenv_user", JSON.stringify(response.user))
      
      toast.success("Inscription réussie!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur d'inscription")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-xl bg-zenv-100 mb-4">
          <User className="h-8 w-8 text-zenv-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Inscription</h1>
        <p className="text-muted-foreground">
          Créez votre compte Zenv Hub
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="inline mr-2" size={14} />
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            placeholder="john_doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="inline mr-2" size={14} />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            <Lock className="inline mr-2" size={14} />
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
        
        <div className="text-center text-sm text-muted-foreground">
          Déjà un compte?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
