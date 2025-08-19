# 🚀 Início Rápido - Backup na Nuvem

## ⚡ Solução Rápida para CORS

### 1. Deploy no Netlify (2 minutos)
- Acesse [netlify.com](https://netlify.com)
- Login com GitHub
- "New site from Git" → Seu repositório
- Deploy automático

### 2. Configurar Backup
- Clique em "Backup na Nuvem"
- Cole sua chave da API do [jsonbin.io](https://jsonbin.io)
- Teste conexão
- Pronto! ✅

## 🔧 Arquivos Criados
- `netlify/functions/backup.js` - Backend intermediário
- `netlify.toml` - Configuração do Netlify
- `package.json` - Dependências
- `DEPLOY_INSTRUCTIONS.md` - Instruções completas

## 🌐 URLs
- **Site:** `https://seu-site.netlify.app`
- **Função:** `https://seu-site.netlify.app/.netlify/functions/backup`

## 💡 Como Funciona
```
GitHub Pages → Netlify Function → JsonBin.io
```

**Resultado:** Sem problemas de CORS! 🎉
