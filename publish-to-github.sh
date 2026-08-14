#!/usr/bin/env bash
# ==============================================================================
# Script de Publicação Automática no GitHub (Bash)
# Repositório: https://github.com/marceloinhuma-maker/Lista-Tarefas-.git
# ==============================================================================

set -e

REMOTE_URL="https://github.com/marceloinhuma-maker/Lista-Tarefas-.git"

echo -e "\n🚀 [DevOps] Iniciando publicação do TaskFlow no GitHub...\n"

if ! command -v git &> /dev/null; then
    echo "❌ Erro: Git não encontrado. Instale o Git antes de continuar."
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório Git local..."
    git init
fi

git branch -M main

if git remote get-url origin &> /dev/null; then
    echo "🔄 Atualizando remote origin para: $REMOTE_URL"
    git remote set-url origin "$REMOTE_URL"
else
    echo "🔗 Adicionando remote origin: $REMOTE_URL"
    git remote add origin "$REMOTE_URL"
fi

git add .

if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "📝 Criando commit com as alterações..."
    git commit -m "feat: initial commit - TaskFlow project complete setup and documentation"
else
    echo "✅ Nenhuma alteração pendente para commit."
fi

echo -e "\n🚀 Enviando código para o GitHub (branch: main)..."
git push -u origin main

echo -e "\n🎉 Sucesso! Projeto publicado com êxito no GitHub: https://github.com/marceloinhuma-maker/Lista-Tarefas-\n"
