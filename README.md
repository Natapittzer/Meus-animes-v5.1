# 🎌 Meu Catálogo de Animes

Um sistema completo para gerenciar sua coleção de animes com funcionalidades avançadas de organização, filtros e backup na nuvem.

## ✨ Funcionalidades Principais

### 📚 Gerenciamento de Animes
- **Adicionar/Editar/Excluir** animes
- **Upload de imagens** ou URLs de imagem
- **Controle de episódios** assistidos vs. total
- **Sistema de status**: Assistindo, Terminado, Quero Assistir
- **Marcação de favoritos** e **ocultação** de animes
- **Links externos** para plataformas de streaming
- **Comentários e impressões** pessoais sobre cada anime

### 🔍 Sistema de Filtros e Pesquisa
- **Filtros por status** (Todos, Assistindo, Terminado, Quero Assistir, Favoritos, Ocultos)
- **Filtro por gêneros** (automático baseado nos animes cadastrados)
- **Pesquisa por nome** ou gêneros
- **Ordenação** por nome, status, episódios restantes ou data de adição

### 📊 Estatísticas Detalhadas
- Total de animes na coleção
- Episódios assistidos
- Tempo total estimado (24 min/episódio)
- Contadores por status
- Animes favoritos

### 👤 Sistema de Perfil
- **Nome e email** personalizados
- **Biografia** do usuário
- **Avatar personalizado** com upload de imagem
- **Boas-vindas** personalizadas

### 💾 Sistema de Backup
- **Exportar/Importar** em formato JSON
- **Backup na nuvem** usando JSONBin.io
- **Sincronização** entre dispositivos
- **Restauração** automática de dados

## 🆕 Novas Funcionalidades Implementadas

### 💭 Sistema de Comentários
- **Campo de comentários** no formulário de edição
- **Anotações pessoais** sobre cada anime
- **Impressões e opiniões** sobre episódios
- **Momentos favoritos** e lembranças
- **Comentários privados** (não aparecem na visualização principal)

### ☁️ Backup na Nuvem
- **Sincronização automática** com JSONBin.io
- **Configuração de servidor** personalizada
- **Teste de conexão** antes do backup
- **Backup e restauração** automáticos
- **Sincronização** entre múltiplos dispositivos

## 🚀 Como Usar

### 1. Primeira Execução
1. Abra o arquivo `index.html` no seu navegador
2. Clique no botão **❓** (interrogação) para abrir o tutorial completo
3. Clique em "Adicionar Anime" para começar
4. Configure seu perfil clicando no botão "Config"

### 2. Adicionando Animes
1. Clique em "Adicionar Anime"
2. Preencha os campos obrigatórios (Nome e Total de Episódios)
3. Adicione uma imagem (URL ou upload)
4. Configure gêneros, status e outras informações
5. **Adicione seus comentários e impressões** no campo de comentários
6. Clique em "Salvar"

### 3. Sistema de Comentários
- **Para adicionar comentários**: Edite qualquer anime e use o campo "Comentários e Impressões"
- **Para visualizar comentários**: Abra o anime para edição
- **Comentários são privados**: Só aparecem na tela de edição, não na visualização principal

### 4. Backup na Nuvem
1. **Deploy no Netlify** (obrigatório para GitHub Pages):
   - Veja [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) para instruções completas
   - Esta etapa resolve problemas de CORS

2. **Obtenha uma chave da API**:
   - Acesse [JSONBin.io](https://jsonbin.io/)
   - Crie uma conta gratuita
   - Gere sua chave da API

3. **Configure o backup**:
   - Clique em "Backup na Nuvem"
   - Cole sua chave da API do JsonBin
   - Deixe o ID do Bin vazio para criar um novo

4. **Teste a conexão**:
   - Clique em "Testar Conexão"
   - Verifique se a conexão foi bem-sucedida

5. **Faça o backup**:
   - Clique em "Fazer Backup" para enviar dados para a nuvem
   - O sistema salvará automaticamente o ID do Bin

6. **Restaurar dados**:
   - Use "Restaurar da Nuvem" para baixar dados de outro dispositivo
   - Todos os dados serão sincronizados automaticamente

## 🔧 Configuração do Backup na Nuvem

### ⚠️ Solução para CORS (GitHub Pages)
O sistema usa **Netlify Functions** como backend intermediário para resolver problemas de CORS.

### JSONBin.io (Recomendado)
- **Backend**: Netlify Functions (gratuito)
- **Limite gratuito**: 10.000 requisições/mês
- **Segurança**: Chave da API obrigatória
- **Sincronização**: Tempo real
- **Sem problemas de CORS**

### Como Funciona
```
Seu Site → Netlify Function → JsonBin.io
```

### Vantagens
✅ **Sem problemas de CORS**
✅ **Chave da API segura no backend**
✅ **Funciona em qualquer host**
✅ **Deploy automático via GitHub**
✅ **Gratuito e confiável**

## 📱 Compatibilidade

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: Responsivo para smartphones e tablets
- ✅ **Offline**: Funciona sem internet (exceto backup na nuvem)
- ✅ **Armazenamento**: LocalStorage do navegador

## 🎨 Personalização

### Cores e Temas
- Tema escuro moderno
- Gradientes e sombras elegantes
- Cores de destaque personalizáveis

### Layout
- Interface responsiva
- Grid adaptativo
- Modais elegantes
- Animações suaves

## 🔒 Privacidade e Segurança

- **Dados locais**: Armazenados apenas no seu navegador
- **Backup opcional**: Só envia dados se você configurar
- **Chave da API**: Necessária para acesso aos dados na nuvem
- **Sem rastreamento**: Não coleta dados de uso

## 🆘 Suporte

### 📚 Página de Ajuda
- **Clique no botão ❓** no canto superior esquerdo para abrir o tutorial completo
- **Guia passo a passo** para todas as funcionalidades
- **Instruções detalhadas** para configurar backups na nuvem
- **Dicas e truques** para aproveitar melhor o sistema

### Problemas Comuns
1. **Dados não salvam**: Verifique se o localStorage está habilitado
2. **Backup falha**: Teste a conexão primeiro
3. **Imagens não carregam**: Verifique URLs ou use upload local
4. **Interface quebrada**: Atualize o navegador

### Recursos Úteis
- **Exportar JSON**: Backup local sempre disponível
- **Importar JSON**: Restaurar dados de backup local
- **Limpar dados**: Remover animes individualmente ou resetar tudo

## 📈 Próximas Funcionalidades

- [ ] Sistema de avaliações (1-5 estrelas)
- [ ] Listas personalizadas e coleções
- [ ] Histórico de visualização por data
- [ ] Gráficos e estatísticas avançadas
- [ ] Modo escuro/claro alternável
- [ ] Notificações para novos episódios
- [ ] Integração com APIs de anime (MyAnimeList, etc.)

---

**Desenvolvido com ❤️ para otakus que amam organizar suas coleções!**
