# ==============================================================================
# Script de Publicação Automática no GitHub (PowerShell)
# Repositório: https://github.com/marceloinhuma-maker/Lista-Tarefas-.git
# ==============================================================================

Write-Host "`n🚀 [DevOps] Iniciando publicação do TaskFlow no GitHub...`n" -ForegroundColor Cyan

$RemoteUrl = "https://github.com/marceloinhuma-maker/Lista-Tarefas-.git"

# 1. Verificar se o Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erro: Git não encontrado no PATH. Instale o Git antes de continuar." -ForegroundColor Red
    exit 1
}

# 2. Inicializar repositório Git se necessário
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando repositório Git local..." -ForegroundColor Yellow
    git init
}

# 3. Garantir que a branch principal seja 'main'
git branch -M main

# 4. Configurar ou atualizar remote origin
$CurrentRemote = git remote get-url origin 2>$null
if ($null -eq $CurrentRemote) {
    Write-Host "🔗 Adicionando remote origin: $RemoteUrl" -ForegroundColor Yellow
    git remote add origin $RemoteUrl
} else {
    Write-Host "🔄 Atualizando remote origin para: $RemoteUrl" -ForegroundColor Yellow
    git remote set-url origin $RemoteUrl
}

# 5. Adicionar arquivos e criar commit inicial se necessário
git add .
$Status = git status --porcelain
if ($Status) {
    Write-Host "📝 Criando commit com as alterações..." -ForegroundColor Yellow
    git commit -m "feat: initial commit - TaskFlow project complete setup and documentation"
} else {
    Write-Host "✅ Nenhuma alteração pendente para commit." -ForegroundColor Green
}

# 6. Realizar Push para o GitHub
Write-Host "`n🚀 Enviando código para o GitHub (branch: main)..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Sucesso! Projeto publicado com êxito no GitHub:" -ForegroundColor Green
    Write-Host "👉 https://github.com/marceloinhuma-maker/Lista-Tarefas-`n" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Atenção: Se o push falhar por credenciais ou se o repositório remoto já contiver commits," -ForegroundColor Yellow
    Write-Host "você pode sincronizar ou usar 'git push -u origin main --force' se desejar sobrescrever o repositório remoto vazio.`n" -ForegroundColor Yellow
}
