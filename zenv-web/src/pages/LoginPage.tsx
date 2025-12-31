import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LogIn, Mail, Lock } from "lucide-react"
import { useStore } from "@/hooks/useStore"
import { authService } from "@/services/api"
import { toast } from "react-hot-toast"

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useStore()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    try {
      setLoading(true)
      const response = await authService.login(username, password)
      
      setUser(response.user)
      setToken(response.token.access_token)
      localStorage.setItem("zenv_user", JSON.stringify(response.user))
      
      toast.success("Connexion réussie!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-xl bg-zenv-100 mb-4">
          <LogIn className="h-8 w-8 text-zenv-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Connexion</h1>
        <p className="text-muted-foreground">
          Connectez-vous à votre compte Zenv Hub
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="inline mr-2" size={14} />
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        
        <div className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <Link to="/register" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
