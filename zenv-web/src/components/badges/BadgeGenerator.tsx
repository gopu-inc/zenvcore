import React, { useState } from "react"
import { Copy, Palette } from "lucide-react"

const BadgeGenerator: React.FC = () => {
  const [label, setLabel] = useState("version")
  const [value, setValue] = useState("1.0.0")
  const [color, setColor] = useState("blue")
  
  const badgeUrl = \`/badge/custom/\${label}/\${value}/\${color}\`
  
  const colors = [
    { value: "blue", name: "Bleu" },
    { value: "green", name: "Vert" },
    { value: "red", name: "Rouge" },
    { value: "orange", name: "Orange" },
    { value: "yellow", name: "Jaune" },
  ]
  
  const handleCopy = () => {
    navigator.clipboard.writeText(badgeUrl)
  }
  
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-6">Générateur de Badge</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input w-full"
              placeholder="version"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Valeur</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input w-full"
              placeholder="1.0.0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Palette size={16} />
              Couleur
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={\`px-3 py-2 rounded \${color === c.value ? 'bg-primary text-white' : 'bg-muted'}\`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-6 flex items-center justify-center">
            <img src={badgeUrl} alt="Badge preview" className="h-8" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">URL du badge</label>
            <div className="flex gap-2">
              <code className="flex-1 text-sm p-2 bg-muted rounded truncate">
                {badgeUrl}
              </code>
              <button onClick={handleCopy} className="btn btn-outline">
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Markdown</label>
            <code className="block text-sm p-2 bg-muted rounded">
              ![{label}: {value}]({badgeUrl})
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeGenerator
