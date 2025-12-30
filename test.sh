#!/bin/bash
echo "🔍 Vérification de la structure des fichiers..."

# Vérifier les extensions
echo "📁 Extensions des fichiers :"
find src -name "*.js" -o -name "*.jsx" | while read file; do
    if [[ "$file" == *.js ]]; then
        if grep -q "return.*<\|<[A-Z]\|import React" "$file"; then
            echo "  ⚠️  $file contient du JSX mais a l'extension .js"
        fi
    fi
done

# Vérifier la casse
echo ""
echo "📁 Casse des fichiers :"
if [ -f "src/components/stats.jsx" ]; then
    echo "  ⚠️  Renommer src/components/stats.jsx → src/components/Stats.jsx"
    mv src/components/stats.jsx src/components/Stats.jsx
fi

# Vérifier les imports dans App.jsx
echo ""
echo "📄 Vérification des imports dans App.jsx :"
if grep -q "from './components/stats'" src/App.jsx; then
    echo "  ⚠️  Mettre à jour l'import de stats → Stats"
    sed -i "s|from './components/stats'|from './components/Stats'|g" src/App.jsx
fi

# Vérifier que tous les fichiers importés existent
echo ""
echo "🔗 Vérification des fichiers importés :"
grep -o "from '\./[^']*'" src/App.jsx | sed "s/from '\.\/\(.*\)'/\\1/" | while read import; do
    if [ ! -f "src/$import" ] && [ ! -f "src/$import.jsx" ] && [ ! -f "src/$import.js" ]; then
        echo "  ❌ Fichier manquant: src/$import"
    fi
done

echo ""
echo "✅ Vérification terminée"
