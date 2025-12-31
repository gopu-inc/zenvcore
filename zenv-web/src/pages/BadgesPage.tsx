import React, { useEffect, useState } from "react"
import { Zap, Copy } from "lucide-react"
import BadgeGenerator from "@/components/badges/BadgeGenerator"
import { badgeService } from "@/services/api"

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<any[]>([])
  
  useEffect(() => {
    loadBadges()
  }, [])
  
  const loadBadges = async () => {
    try {
      const data = await badgeService.listBadges()
      setBadges(data.badges.slice(0, 10))
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Badges</h1>
        <p className="text-muted-foreground">
          Créez et gérez des badges SVG pour vos projets
        </p>
      </div>
      
      <BadgeGenerator />
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Badges Récemment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-zenv-500" />
                  <span className="font-semibold">{badge.name}</span>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Copy size={14} />
                </button>
              </div>
              
              <div className="flex justify-center mb-4">
                <img
                  src={\`/badge/svg/\${badge.name}\`}
                  alt={badge.name}
                  className="h-8"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {badge.label}: {badge.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BadgesPage
