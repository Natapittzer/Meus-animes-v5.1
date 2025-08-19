// Classe principal para gerenciar o catálogo de animes
class AnimeCatalog {
    constructor() {
        this.animes = [];
        this.currentFilter = 'all';
        this.currentSort = 'name';
        this.currentGenre = '';
        this.searchTerm = '';
        this.editingAnimeId = null;
        
        this.init();
    }

    init() {
        this.loadAnimes();
        this.loadProfile();
        this.loadTheme();
        this.setupEventListeners();
        this.renderAnimes();
        this.updateStats();
        this.updateGenreFilter();
        this.setupThemeSync();
    }

    // Carregar animes do localStorage
    loadAnimes() {
        const saved = localStorage.getItem('animeCatalog');
        this.animes = saved ? JSON.parse(saved) : [];
    }

    // Salvar animes no localStorage
    saveAnimes() {
        localStorage.setItem('animeCatalog', JSON.stringify(this.animes));
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botão adicionar anime
        document.getElementById('addAnimeBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Botão de ajuda
        document.getElementById('helpBtn').addEventListener('click', () => {
            window.location.href = 'ajuda.html';
        });

        // Botão de alternar tema
        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal de anime
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Formulário de anime
        document.getElementById('animeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAnime();
        });

        // Modal de confirmação
        document.getElementById('closeConfirmModal').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.deleteAnime();
        });

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Pesquisa
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderAnimes();
        });

        // Filtro de gênero
        document.getElementById('genreFilter').addEventListener('change', (e) => {
            this.currentGenre = e.target.value;
            this.renderAnimes();
        });

        // Ordenação
        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderAnimes();
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeConfirmModal();
                this.closeImportModal();
                this.closeProfileModal();
                this.closeCloudBackupModal();
            }
        });

        // Botões de exportar e importar
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToJSON();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            this.openImportModal();
        });

        // Botões de backup na nuvem
        document.getElementById('cloudBackupBtn').addEventListener('click', () => {
            this.openCloudBackupModal();
        });

        document.getElementById('cloudRestoreBtn').addEventListener('click', () => {
            this.openCloudBackupModal();
        });

        // Sistema de perfil
        document.getElementById('profileBtn').addEventListener('click', () => {
            this.openProfileModal();
        });

        document.getElementById('closeProfileModal').addEventListener('click', () => {
            this.closeProfileModal();
        });

        document.getElementById('cancelProfileBtn').addEventListener('click', () => {
            this.closeProfileModal();
        });

        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            this.saveProfile();
        });

        // Botão de log de registro
        document.getElementById('logRegistroBtn').addEventListener('click', () => {
            window.open('log-registro.html', '_blank');
        });

        // Seleção de temas
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        });

        document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarUpload').click();
        });

        document.getElementById('removeAvatarBtn').addEventListener('click', () => {
            this.removeAvatar();
        });

        document.getElementById('avatarUpload').addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // Modal de importação
        document.getElementById('closeImportModal').addEventListener('click', () => {
            this.closeImportModal();
        });

        // Modal de backup na nuvem
        document.getElementById('closeCloudBackupModal').addEventListener('click', () => {
            this.closeCloudBackupModal();
        });

        document.getElementById('testConnectionBtn').addEventListener('click', () => {
            this.testCloudConnection();
        });

        document.getElementById('uploadBackupBtn').addEventListener('click', () => {
            this.uploadToCloud();
        });

        document.getElementById('downloadBackupBtn').addEventListener('click', () => {
            this.downloadFromCloud();
        });

        document.getElementById('replaceAllBtn').addEventListener('click', () => {
            this.importFromJSON('replace');
        });

        document.getElementById('mergeDataBtn').addEventListener('click', () => {
            this.importFromJSON('merge');
        });

        // Input file para importação
        document.getElementById('jsonFileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Fechar modais clicando fora
        document.getElementById('animeModal').addEventListener('click', (e) => {
            if (e.target.id === 'animeModal') {
                this.closeModal();
            }
        });

        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                this.closeConfirmModal();
            }
        });

        document.getElementById('importModal').addEventListener('click', (e) => {
            if (e.target.id === 'importModal') {
                this.closeImportModal();
            }
        });

        document.getElementById('profileModal').addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.closeProfileModal();
            }
        });

        document.getElementById('cloudBackupModal').addEventListener('click', (e) => {
            if (e.target.id === 'cloudBackupModal') {
                this.closeCloudBackupModal();
            }
        });
    }

    // Abrir modal para adicionar/editar anime
    openModal(animeId = null) {
        const modal = document.getElementById('animeModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('animeForm');

        if (animeId) {
            // Modo edição
            this.editingAnimeId = animeId;
            const anime = this.animes.find(a => a.id === animeId);
            if (anime) {
                modalTitle.textContent = 'Editar Anime';
                this.fillForm(anime);
            }
        } else {
            // Modo adição
            this.editingAnimeId = null;
            modalTitle.textContent = 'Adicionar Novo Anime';
            form.reset();
        }

        modal.classList.add('active');
        document.getElementById('animeName').focus();
    }

    // Preencher formulário com dados do anime
    fillForm(anime) {
        document.getElementById('animeName').value = anime.name;
        document.getElementById('animeImage').value = anime.image || '';
        document.getElementById('imageUpload').value = '';
        document.getElementById('animeGenres').value = anime.genres || '';
        document.getElementById('animeStatus').value = anime.status;
        document.getElementById('totalSeasons').value = anime.totalSeasons || 1;
        document.getElementById('totalEpisodes').value = anime.totalEpisodes;
        document.getElementById('watchedEpisodes').value = anime.watchedEpisodes || 0;
        document.getElementById('watchCount').value = anime.watchCount || 1;
        document.getElementById('startDate').value = anime.startDate || '';
        document.getElementById('endDate').value = anime.endDate || '';
        // Compatibilidade com animes antigos que podem ter externalLink em vez de externalLinks
        const externalLinks = anime.externalLinks || (anime.externalLink ? [anime.externalLink] : []);
        document.getElementById('externalLink1').value = externalLinks[0] || '';
        document.getElementById('externalLink2').value = externalLinks[1] || '';
        document.getElementById('externalLink3').value = externalLinks[2] || '';
        document.getElementById('isFavorite').checked = anime.isFavorite || false;
        document.getElementById('isHidden').checked = anime.isHidden || false;
        document.getElementById('animeComments').value = anime.comments || '';
    }

    // Fechar modal
    closeModal() {
        document.getElementById('animeModal').classList.remove('active');
        this.editingAnimeId = null;
    }

    // Salvar anime
    saveAnime() {
        console.log('Salvando anime...');
        
        // Processar upload de imagem
        const imageUpload = document.getElementById('imageUpload');
        let imageData = document.getElementById('animeImage').value.trim();
        
        if (imageUpload.files.length > 0) {
            const file = imageUpload.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imageData = e.target.result;
                this.saveAnimeData(imageData);
            };
            reader.readAsDataURL(file);
            return;
        }
        
        this.saveAnimeData(imageData);
    }

    // Salvar dados do anime
    saveAnimeData(imageData) {
        console.log('Salvando dados do anime...');
        
        const formData = {
            name: document.getElementById('animeName').value.trim(),
            image: imageData,
            genres: document.getElementById('animeGenres').value.trim(),
            status: document.getElementById('animeStatus').value,
            totalSeasons: parseInt(document.getElementById('totalSeasons').value) || 1,
            totalEpisodes: parseInt(document.getElementById('totalEpisodes').value),
            watchedEpisodes: parseInt(document.getElementById('watchedEpisodes').value) || 0,
            watchCount: parseInt(document.getElementById('watchCount').value) || 1,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            externalLinks: [
                document.getElementById('externalLink1').value.trim(),
                document.getElementById('externalLink2').value.trim(),
                document.getElementById('externalLink3').value.trim()
            ].filter(link => link), // Remove links vazios
            isFavorite: document.getElementById('isFavorite').checked,
            isHidden: document.getElementById('isHidden').checked,
            comments: document.getElementById('animeComments').value.trim(),
            dateAdded: new Date().toISOString()
        };

        console.log('Dados do formulário:', formData);

        if (!formData.name || !formData.totalEpisodes) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }

        if (this.editingAnimeId) {
            // Editar anime existente
            const index = this.animes.findIndex(a => a.id === this.editingAnimeId);
            if (index !== -1) {
                this.animes[index] = { ...this.animes[index], ...formData };
                // Adicionar log de edição
                this.addLog('edit', `Anime "${formData.name}" foi editado`, formData.name);
            }
        } else {
            // Adicionar novo anime
            const newAnime = {
                id: Date.now().toString(),
                ...formData
            };
            this.animes.push(newAnime);
            // Adicionar log de criação
            this.addLog('create', `Novo anime "${formData.name}" foi criado`, formData.name);
        }

        this.saveAnimes();
        this.renderAnimes();
        this.updateStats();
        this.updateGenreFilter();
        this.closeModal();
    }

    // Abrir modal de confirmação para exclusão
    openConfirmModal(animeId) {
        const anime = this.animes.find(a => a.id === animeId);
        if (anime) {
            document.getElementById('confirmAnimeName').textContent = anime.name;
            document.getElementById('confirmModal').classList.add('active');
            this.animeToDelete = animeId;
        }
    }

    // Fechar modal de confirmação
    closeConfirmModal() {
        document.getElementById('confirmModal').classList.remove('active');
        this.animeToDelete = null;
    }

    // Excluir anime
    deleteAnime() {
        if (this.animeToDelete) {
            const animeToDelete = this.animes.find(a => a.id === this.animeToDelete);
            if (animeToDelete) {
                // Adicionar log de exclusão
                this.addLog('delete', `Anime "${animeToDelete.name}" foi excluído`, animeToDelete.name);
            }
            
            this.animes = this.animes.filter(a => a.id !== this.animeToDelete);
            this.saveAnimes();
            this.renderAnimes();
            this.updateStats();
            this.updateGenreFilter();
            this.closeConfirmModal();
        }
    }

    // Definir filtro
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Atualizar botões ativos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderAnimes();
    }

    // Filtrar e ordenar animes
    getFilteredAnimes() {
        let filtered = [...this.animes];

        // Aplicar filtro de status
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'favorites') {
                filtered = filtered.filter(anime => anime.isFavorite);
            } else if (this.currentFilter === 'hidden') {
                filtered = filtered.filter(anime => anime.isHidden);
            } else {
                filtered = filtered.filter(anime => anime.status === this.currentFilter);
            }
        } else {
            // No filtro "Todos", ocultar animes marcados como ocultos
            filtered = filtered.filter(anime => !anime.isHidden);
        }

        // Aplicar filtro de gênero
        if (this.currentGenre) {
            filtered = filtered.filter(anime => 
                anime.genres && anime.genres.toLowerCase().includes(this.currentGenre.toLowerCase())
            );
        }

        // Aplicar pesquisa
        if (this.searchTerm) {
            filtered = filtered.filter(anime => 
                anime.name.toLowerCase().includes(this.searchTerm) ||
                (anime.genres && anime.genres.toLowerCase().includes(this.searchTerm))
            );
        }

        // Aplicar ordenação
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'episodes':
                    return (b.totalEpisodes - b.watchedEpisodes) - (a.totalEpisodes - a.watchedEpisodes);
                case 'date':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // Renderizar lista de animes
    renderAnimes() {
        const animeList = document.getElementById('animeList');
        const filteredAnimes = this.getFilteredAnimes();

        if (filteredAnimes.length === 0) {
            animeList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tv"></i>
                    <h3>Nenhum anime encontrado</h3>
                    <p>${this.animes.length === 0 ? 'Adicione seu primeiro anime!' : 'Tente ajustar os filtros ou a pesquisa.'}</p>
                </div>
            `;
            return;
        }

        animeList.innerHTML = filteredAnimes.map(anime => this.createAnimeCard(anime)).join('');
    }

         // Criar card de anime
     createAnimeCard(anime) {
         const progress = anime.totalEpisodes > 0 ? (anime.watchedEpisodes / anime.totalEpisodes) * 100 : 0;
         const remainingEpisodes = anime.totalEpisodes - anime.watchedEpisodes;
         const hasImage = anime.image && anime.image.trim() !== '';

         if (hasImage) {
             // Layout completo com imagem
             return `
                 <div class="anime-card anime-card-expanded" data-id="${anime.id}">
                     <div class="anime-image">
                         <img src="${anime.image}" alt="${anime.name}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fas fa-image\\'></i></div>'">
                         <button class="favorite-btn ${anime.isFavorite ? 'active' : ''}" 
                                 onclick="animeCatalog.toggleFavorite('${anime.id}')">
                             <i class="fas fa-heart"></i>
                         </button>
                     </div>
                     <div class="anime-content">
                         <div class="anime-header">
                             <div>
                                 <h3 class="anime-title">${anime.name}</h3>
                                 <span class="anime-status status-${anime.status}">
                                     ${this.getStatusText(anime.status)}
                                 </span>
                             </div>
                         </div>
                         ${anime.genres ? `<p class="anime-genres">${this.truncateGenres(anime.genres)}</p>` : ''}
                         ${anime.totalSeasons && anime.totalSeasons > 1 ? `<p class="anime-seasons">${anime.totalSeasons} temporada${anime.totalSeasons > 1 ? 's' : ''}</p>` : ''}
                         <div class="anime-progress">
                             <div class="progress-bar">
                                 <div class="progress-fill" style="width: ${progress}%"></div>
                             </div>
                             <div class="progress-text">
                                 <span>${anime.watchedEpisodes} / ${anime.totalEpisodes} episódios</span>
                                 <span>${remainingEpisodes > 0 ? remainingEpisodes + ' restantes' : 'Concluído!'}</span>
                             </div>
                         </div>
                         
                         <div class="anime-actions">
                             <button class="action-btn" onclick="animeCatalog.incrementEpisode('${anime.id}')" title="+1 Episódio">
                                 <i class="fas fa-plus"></i>
                             </button>
                             <button class="action-btn" onclick="animeCatalog.openModal('${anime.id}')" title="Editar">
                                 <i class="fas fa-edit"></i>
                             </button>
                              ${(() => {
                                  const links = anime.externalLinks || (anime.externalLink ? [anime.externalLink] : []);
                                  return links.length > 0 ? 
                                      links.map((link, index) => 
                                          `<a href="${link}" target="_blank" class="action-btn" title="Link ${index + 1}">
                                              <i class="fas fa-external-link-alt"></i>
                                          </a>`
                                      ).join('') : '';
                              })()}
                             <button class="action-btn ${anime.isHidden ? 'active' : ''}" onclick="animeCatalog.toggleHidden('${anime.id}')" title="${anime.isHidden ? 'Mostrar' : 'Ocultar'}">
                                 <i class="fas fa-eye${anime.isHidden ? '-slash' : ''}"></i>
                             </button>
                             <button class="action-btn" onclick="animeCatalog.openConfirmModal('${anime.id}')" title="Excluir">
                                 <i class="fas fa-trash"></i>
                             </button>
                         </div>
                     </div>
                 </div>
             `;
         } else {
             // Layout compacto sem imagem
             return `
                 <div class="anime-card anime-card-compact" data-id="${anime.id}">
                     <div class="anime-content-compact">
                                                <div class="anime-header-compact">
                           <h3 class="anime-title-compact">${anime.name}</h3>
                           <div class="compact-controls">
                               <button class="favorite-btn-compact ${anime.isFavorite ? 'active' : ''}" 
                                       onclick="animeCatalog.toggleFavorite('${anime.id}')">
                                   <i class="fas fa-heart"></i>
                               </button>
                           </div>
                       </div>
                                               ${anime.genres ? `<p class="anime-genres-compact">${this.truncateGenres(anime.genres)}</p>` : ''}
                        <div class="compact-details">
                             <div class="anime-status-compact">
                                 <span class="anime-status status-${anime.status}">
                                     ${this.getStatusText(anime.status)}
                                 </span>
                             </div>
                             <div class="anime-progress-compact">
                                 <div class="progress-bar">
                                     <div class="progress-fill" style="width: ${progress}%"></div>
                                 </div>
                                 <div class="progress-text">
                                     <span>${anime.watchedEpisodes} / ${anime.totalEpisodes} episódios</span>
                                     <span>${remainingEpisodes > 0 ? remainingEpisodes + ' restantes' : 'Concluído!'}</span>
                                 </div>
                             </div>
                         </div>
                         <div class="anime-actions-compact">
                             <button class="action-btn-compact" onclick="animeCatalog.openModal('${anime.id}')" title="Editar">
                                 <i class="fas fa-edit"></i>
                             </button>
                             <button class="action-btn-compact" onclick="animeCatalog.incrementEpisode('${anime.id}')" title="+1 Episódio">
                                 <i class="fas fa-plus"></i>
                             </button>
                             <button class="action-btn-compact ${anime.isHidden ? 'active' : ''}" onclick="animeCatalog.toggleHidden('${anime.id}')" title="${anime.isHidden ? 'Mostrar' : 'Ocultar'}">
                                 <i class="fas fa-eye${anime.isHidden ? '-slash' : ''}"></i>
                             </button>
                             <button class="action-btn-compact" onclick="animeCatalog.openConfirmModal('${anime.id}')" title="Excluir">
                                 <i class="fas fa-trash"></i>
                             </button>
                         </div>
                     </div>
                 </div>
             `;
         }
     }

    // Obter texto do status
    getStatusText(status) {
        const statusMap = {
            'watching': 'Assistindo',
            'completed': 'Terminado',
            'plan': 'Quero Assistir'
        };
        return statusMap[status] || status;
    }

    // Truncar gêneros se forem muito longos
    truncateGenres(genres, maxLength = 50) {
        if (!genres || genres.trim() === '') return '';
        
        if (genres.length <= maxLength) return genres;
        
        // Encontrar o último espaço antes do limite
        const truncated = genres.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > 0) {
            return truncated.substring(0, lastSpace) + '...';
        }
        
        return truncated + '...';
    }

    // Incrementar episódio
    incrementEpisode(animeId) {
        const anime = this.animes.find(a => a.id === animeId);
        if (anime && anime.watchedEpisodes < anime.totalEpisodes) {
            anime.watchedEpisodes++;
            
            // Adicionar log de episódio marcado
            this.addLog('episode', `Episódio ${anime.watchedEpisodes} de "${anime.name}" marcado como assistido`, anime.name);
            
            if (anime.watchedEpisodes >= anime.totalEpisodes) {
                anime.status = 'completed';
                anime.endDate = new Date().toISOString().split('T')[0];
                // Adicionar log de conclusão
                this.addLog('episode', `Anime "${anime.name}" foi marcado como concluído!`, anime.name);
            }
            
            this.saveAnimes();
            this.renderAnimes();
            this.updateStats();
        }
    }

    

    // Alternar favorito
    toggleFavorite(animeId) {
        const anime = this.animes.find(a => a.id === animeId);
        if (anime) {
            anime.isFavorite = !anime.isFavorite;
            const action = anime.isFavorite ? 'marcado como favorito' : 'removido dos favoritos';
            this.addLog('favorite', `Anime "${anime.name}" foi ${action}`, anime.name);
            this.saveAnimes();
            this.renderAnimes();
            this.updateStats();
        }
    }

    // Alternar oculto
    toggleHidden(animeId) {
        const anime = this.animes.find(a => a.id === animeId);
        if (anime) {
            anime.isHidden = !anime.isHidden;
            const action = anime.isHidden ? 'ocultado' : 'tornado visível';
            this.addLog('hide', `Anime "${anime.name}" foi ${action}`, anime.name);
            this.saveAnimes();
            this.renderAnimes();
            this.updateStats();
        }
    }

    // Alternar visualização compacta


    // Atualizar estatísticas
    updateStats() {
        // Filtrar apenas animes visíveis (não ocultos) para estatísticas gerais
        const visibleAnimes = this.animes.filter(anime => !anime.isHidden);
        
        const totalAnimes = visibleAnimes.length;
        const totalEpisodios = visibleAnimes.reduce((sum, anime) => {
            const episodiosAssistidos = anime.watchedEpisodes || 0;
            const vezesAssistidas = anime.watchCount || 1;
            return sum + (episodiosAssistidos * vezesAssistidas);
        }, 0);
        const tempoTotal = Math.round(totalEpisodios * 24 / 60); // 24 minutos por episódio
        const totalFavoritos = visibleAnimes.filter(anime => anime.isFavorite).length;

        // Contadores por status (apenas animes visíveis)
        const watchingCount = visibleAnimes.filter(anime => anime.status === 'watching').length;
        const completedCount = visibleAnimes.filter(anime => anime.status === 'completed').length;
        const planCount = visibleAnimes.filter(anime => anime.status === 'plan').length;
        const hiddenCount = this.animes.filter(anime => anime.isHidden).length;

        // Calcular total de vezes assistidas
        const totalWatchCount = visibleAnimes.reduce((sum, anime) => sum + (anime.watchCount || 1), 0);

        // Atualizar estatísticas principais
        document.getElementById('totalAnimes').textContent = totalAnimes;
        document.getElementById('totalEpisodios').textContent = totalEpisodios;
        document.getElementById('tempoTotal').textContent = `${tempoTotal}h`;
        document.getElementById('totalFavoritos').textContent = totalFavoritos;
        document.getElementById('totalWatchCount').textContent = totalWatchCount;

        // Atualizar contadores dos filtros
        document.getElementById('watchingCount').textContent = watchingCount;
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('planCount').textContent = planCount;
        document.getElementById('hiddenCount').textContent = hiddenCount;
    }

    // Atualizar filtro de gêneros
    updateGenreFilter() {
        const genreSelect = document.getElementById('genreFilter');
        const currentValue = genreSelect.value;
        
        // Coletar todos os gêneros únicos
        const allGenres = new Set();
        this.animes.forEach(anime => {
            if (anime.genres) {
                anime.genres.split(',').forEach(genre => {
                    allGenres.add(genre.trim());
                });
            }
        });

        // Manter a opção "Todos os gêneros"
        genreSelect.innerHTML = '<option value="">Todos os gêneros</option>';
        
        // Adicionar opções de gêneros
        Array.from(allGenres).sort().forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });

        // Restaurar valor selecionado se ainda existir
        if (currentValue && Array.from(allGenres).includes(currentValue)) {
            genreSelect.value = currentValue;
        }
    }

    // Exportar catálogo para JSON
    exportToJSON() {
        try {
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                totalAnimes: this.animes.length,
                animes: this.animes
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `catalogo-animes-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(link.href);
            
            // Adicionar log de exportação
            this.addLog('backup', `Catálogo exportado com ${this.animes.length} animes`);
            
            // Mostrar notificação de sucesso
            this.showNotification('Catálogo exportado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar:', error);
            this.showNotification('Erro ao exportar o catálogo', 'error');
        }
    }

    // Abrir modal de importação
    openImportModal() {
        document.getElementById('importModal').classList.add('active');
        document.getElementById('importPreview').style.display = 'none';
        document.getElementById('previewContent').innerHTML = '';
        
        // Trigger do input file
        setTimeout(() => {
            document.getElementById('jsonFileInput').click();
        }, 100);
    }

    // Fechar modal de importação
    closeImportModal() {
        document.getElementById('importModal').classList.remove('active');
        document.getElementById('jsonFileInput').value = '';
    }

    // Lidar com seleção de arquivo
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.json')) {
            this.showNotification('Por favor, selecione um arquivo JSON válido', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                this.showImportPreview(jsonData);
            } catch (error) {
                this.showNotification('Arquivo JSON inválido', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Mostrar prévia dos dados de importação
    showImportPreview(jsonData) {
        const previewDiv = document.getElementById('importPreview');
        const previewContent = document.getElementById('previewContent');
        
        if (!jsonData.animes || !Array.isArray(jsonData.animes)) {
            this.showNotification('Formato de arquivo inválido', 'error');
            return;
        }

        const previewText = `Total de animes: ${jsonData.animes.length}
Versão: ${jsonData.version || 'N/A'}
Data de exportação: ${jsonData.exportDate || 'N/A'}

Primeiros 3 animes:
${jsonData.animes.slice(0, 3).map(anime => `- ${anime.name} (${anime.status})`).join('\n')}`;

        previewContent.textContent = previewText;
        previewDiv.style.display = 'block';
    }

    // Importar dados do JSON
    importFromJSON(mode) {
        const fileInput = document.getElementById('jsonFileInput');
        if (!fileInput.files[0]) {
            this.showNotification('Por favor, selecione um arquivo primeiro', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                
                if (!jsonData.animes || !Array.isArray(jsonData.animes)) {
                    this.showNotification('Formato de arquivo inválido', 'error');
                    return;
                }

                if (mode === 'replace') {
                    // Substituir todos os dados
                    const oldCount = this.animes.length;
                    this.animes = jsonData.animes;
                    this.addLog('backup', `Catálogo substituído: ${oldCount} animes antigos por ${jsonData.animes.length} novos`);
                    this.showNotification(`Catálogo substituído com ${jsonData.animes.length} animes`, 'success');
                } else if (mode === 'merge') {
                    // Mesclar dados
                    const existingIds = new Set(this.animes.map(a => a.id));
                    const newAnimes = jsonData.animes.filter(anime => !existingIds.has(anime.id));
                    
                    if (newAnimes.length === 0) {
                        this.showNotification('Todos os animes já existem no catálogo', 'info');
                        return;
                    }
                    
                    this.animes.push(...newAnimes);
                    this.addLog('backup', `${newAnimes.length} novos animes mesclados ao catálogo existente`);
                    this.showNotification(`${newAnimes.length} novos animes adicionados ao catálogo`, 'success');
                }

                // Salvar e atualizar interface
                this.saveAnimes();
                this.renderAnimes();
                this.updateStats();
                this.updateGenreFilter();
                this.closeImportModal();
                
            } catch (error) {
                console.error('Erro ao importar:', error);
                this.showNotification('Erro ao importar o arquivo', 'error');
            }
        };
        reader.readAsText(fileInput.files[0]);
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Sistema de Perfil
    loadProfile() {
        const saved = localStorage.getItem('userProfile');
        this.userProfile = saved ? JSON.parse(saved) : {
            name: '',
            email: '',
            bio: '',
            avatar: ''
        };
        this.updateProfileDisplay();
        
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
        this.updateThemeSelection(savedTheme);
    }

    saveProfile() {
        const profileData = {
            name: document.getElementById('profileName').value.trim(),
            email: document.getElementById('profileEmail').value.trim(),
            bio: document.getElementById('profileBio').value.trim(),
            avatar: this.userProfile.avatar
        };

        this.userProfile = profileData;
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        this.updateProfileDisplay();
        this.closeProfileModal();
        this.showNotification('Perfil salvo com sucesso!', 'success');
    }

    updateProfileDisplay() {
        // Atualizar campos do modal
        document.getElementById('profileName').value = this.userProfile.name || '';
        document.getElementById('profileEmail').value = this.userProfile.email || '';
        document.getElementById('profileBio').value = this.userProfile.bio || '';

        // Atualizar avatar no header
        const headerAvatar = document.getElementById('avatarImage');
        const headerDefaultAvatar = document.getElementById('defaultAvatar');
        const largeAvatar = document.getElementById('avatarImageLarge');
        const largeDefaultAvatar = document.getElementById('defaultAvatarLarge');

        if (this.userProfile.avatar) {
            headerAvatar.src = this.userProfile.avatar;
            headerAvatar.style.display = 'block';
            headerDefaultAvatar.style.display = 'none';
            largeAvatar.src = this.userProfile.avatar;
            largeAvatar.style.display = 'block';
            largeDefaultAvatar.style.display = 'none';
            
            // Mostrar botão de remover
            document.getElementById('removeAvatarBtn').style.display = 'block';
        } else {
            headerAvatar.style.display = 'none';
            headerDefaultAvatar.style.display = 'block';
            largeAvatar.style.display = 'none';
            largeDefaultAvatar.style.display = 'block';
            
            // Ocultar botão de remover
            document.getElementById('removeAvatarBtn').style.display = 'none';
        }

        // Atualizar texto de boas-vindas
        const welcomeText = document.querySelector('.welcome-text');
        if (this.userProfile.name) {
            welcomeText.textContent = `Bem-vindo, ${this.userProfile.name}!`;
        } else {
            welcomeText.textContent = 'Bem-vindo!';
        }
    }

    openProfileModal() {
        document.getElementById('profileModal').classList.add('active');
        this.updateProfileDisplay();
    }

    closeProfileModal() {
        document.getElementById('profileModal').classList.remove('active');
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione uma imagem válida', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.userProfile.avatar = e.target.result;
            this.updateProfileDisplay();
            this.showNotification('Avatar atualizado!', 'success');
        };
        reader.readAsDataURL(file);
    }

    removeAvatar() {
        this.userProfile.avatar = '';
        this.updateProfileDisplay();
        this.showNotification('Avatar removido!', 'info');
    }

    // Sistema de Backup na Nuvem
    openCloudBackupModal() {
        document.getElementById('cloudBackupModal').classList.add('active');
        this.loadCloudSettings();
    }

    closeCloudBackupModal() {
        document.getElementById('cloudBackupModal').classList.remove('active');
    }

    loadCloudSettings() {
        const savedSettings = localStorage.getItem('cloudBackupSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('apiKey').value = settings.apiKey || '';
            document.getElementById('binId').value = settings.binId || '';
        }
    }

    saveCloudSettings() {
        const settings = {
            apiKey: document.getElementById('apiKey').value.trim(),
            binId: document.getElementById('binId').value.trim()
        };
        localStorage.setItem('cloudBackupSettings', JSON.stringify(settings));
        return settings;
    }

    async testCloudConnection() {
        const settings = this.saveCloudSettings();
        
        if (!settings.apiKey) {
            this.showNotification('Por favor, preencha a chave da API', 'error');
            return;
        }

        try {
            this.showCloudStatus('Testando conexão...', 'info');
            
            // Teste via Netlify Function
            const response = await fetch('/.netlify/functions/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: 'GET',
                    apiKey: settings.apiKey
                })
            });

            if (response.ok) {
                this.showCloudStatus('Conexão bem-sucedida! Servidor acessível.', 'success');
            } else {
                const errorData = await response.json();
                this.showCloudStatus(`Erro na conexão: ${errorData.error || response.statusText}`, 'error');
            }
        } catch (error) {
            this.showCloudStatus(`Erro de conexão: ${error.message}`, 'error');
        }
    }

    async uploadToCloud() {
        const settings = this.saveCloudSettings();
        
        if (!settings.apiKey) {
            this.showNotification('Por favor, preencha a chave da API', 'error');
            return;
        }

        try {
            this.showCloudStatus('Fazendo backup na nuvem...', 'info');
            
            const backupData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                totalAnimes: this.animes.length,
                animes: this.animes,
                userProfile: this.userProfile
            };

            let method = 'POST';
            if (settings.binId) {
                method = 'PUT';
            }

            const response = await fetch('/.netlify/functions/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: method,
                    apiKey: settings.apiKey,
                    binId: settings.binId,
                    data: backupData
                })
            });

            if (response.ok) {
                const result = await response.json();
                const newBinId = result.metadata?.id || result.id;
                
                if (newBinId && !settings.binId) {
                    // Salvar o novo ID do bin
                    settings.binId = newBinId;
                    document.getElementById('binId').value = newBinId;
                    this.saveCloudSettings();
                }
                
                this.showCloudStatus(`Backup realizado com sucesso! ID: ${newBinId}`, 'success');
                this.showNotification('Backup na nuvem realizado com sucesso!', 'success');
            } else {
                const errorData = await response.json();
                this.showCloudStatus(`Erro no backup: ${errorData.error || response.statusText}`, 'error');
            }
        } catch (error) {
            this.showCloudStatus(`Erro no backup: ${error.message}`, 'error');
        }
    }

    async downloadFromCloud() {
        const settings = this.saveCloudSettings();
        
        if (!settings.apiKey || !settings.binId) {
            this.showNotification('Por favor, preencha a chave da API e o ID do Bin', 'error');
            return;
        }

        try {
            this.showCloudStatus('Baixando backup da nuvem...', 'info');
            
            const response = await fetch('/.netlify/functions/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: 'GET',
                    apiKey: settings.apiKey,
                    binId: settings.binId
                })
            });

            if (response.ok) {
                const backupData = await response.json();
                
                if (backupData.record && backupData.record.animes) {
                    // Restaurar dados
                    this.animes = backupData.record.animes;
                    if (backupData.record.userProfile) {
                        this.userProfile = backupData.record.userProfile;
                    }
                    
                    this.saveAnimes();
                    this.renderAnimes();
                    this.updateStats();
                    this.updateGenreFilter();
                    this.updateProfileDisplay();
                    
                    this.showCloudStatus('Backup restaurado com sucesso!', 'success');
                    this.showNotification('Dados restaurados da nuvem com sucesso!', 'success');
                } else {
                    this.showCloudStatus('Formato de backup inválido', 'error');
                }
            } else {
                const errorData = await response.json();
                this.showCloudStatus(`Erro ao baixar: ${errorData.error || response.statusText}`, 'error');
            }
        } catch (error) {
            this.showCloudStatus(`Erro ao baixar: ${error.message}`, 'error');
        }
    }

    showCloudStatus(message, type = 'info') {
        const statusDiv = document.getElementById('cloudStatus');
        const connectionStatus = document.getElementById('connectionStatus');
        
        statusDiv.style.display = 'block';
        connectionStatus.innerHTML = `
            <div class="status-message status-${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
    }

    // Sistema de Temas
    loadTheme() {
        let savedTheme = localStorage.getItem('currentTheme') || localStorage.getItem('selectedTheme');
        
        // Se não há tema salvo, detectar preferência do sistema
        if (!savedTheme) {
            savedTheme = this.detectSystemTheme();
        }
        
        this.changeTheme(savedTheme);
        
        // Atualizar radio button no perfil
        const radioButton = document.getElementById(`theme-${savedTheme}`);
        if (radioButton) {
            radioButton.checked = true;
        }
    }

    detectSystemTheme() {
        // Detectar preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'fulgor'; // Tema mais claro para sistemas que preferem claro
        }
        return 'dark'; // Tema escuro como padrão
    }

    changeTheme(themeName) {
        // Remover tema anterior
        document.documentElement.removeAttribute('data-theme');
        
        // Aplicar novo tema
        if (themeName !== 'dark') {
            document.documentElement.setAttribute('data-theme', themeName);
        }
        
        // Salvar no localStorage
        localStorage.setItem('selectedTheme', themeName);
        localStorage.setItem('currentTheme', themeName);
        
        // Atualizar ícone do botão
        this.updateThemeIcon(themeName);
        
        // Atualizar seleção no perfil
        this.updateThemeSelection(themeName);
        
        // Disparar evento para sincronização entre páginas
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
        
        // Adicionar log
        this.addLog('theme', `Tema alterado para: ${this.getThemeDisplayName(themeName)}`);
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('currentTheme') || localStorage.getItem('selectedTheme') || 'dark';
        let nextTheme;
        
        switch (currentTheme) {
            case 'dark':
                nextTheme = 'sunset';
                break;
            case 'sunset':
                nextTheme = 'sakura';
                break;
            case 'sakura':
                nextTheme = 'fulgor';
                break;
            case 'fulgor':
                nextTheme = 'viride';
                break;
            case 'viride':
                nextTheme = 'crepusculo';
                break;
            case 'crepusculo':
                nextTheme = 'aurora';
                break;
            case 'aurora':
                nextTheme = 'dark';
                break;
            default:
                nextTheme = 'dark';
        }
        
        this.changeTheme(nextTheme);
        this.showNotification(`Tema alterado para: ${this.getThemeDisplayName(nextTheme)}`, 'success');
    }

    getThemeDisplayName(themeName) {
        const themeNames = {
            'dark': '🌙 Noite Escura',
            'sunset': '☀️ Por do Sol',
            'sakura': '🌸 Cerejeira',
            'fulgor': '⚡ Fulgor',
            'viride': '🌿 Viride',
            'crepusculo': '🌌 Crepúsculo',
            'aurora': '🌊 Aurora'
        };
        return themeNames[themeName] || themeName;
    }

    updateThemeIcon(themeName) {
        const themeIcon = document.getElementById('themeIcon');
        const iconMap = {
            'dark': 'fa-moon',
            'sunset': 'fa-sun',
            'sakura': 'fa-heart',
            'fulgor': 'fa-bolt',
            'viride': 'fa-leaf',
            'crepusculo': 'fa-star',
            'aurora': 'fa-snowflake'
        };
        
        if (themeIcon && iconMap[themeName]) {
            themeIcon.className = `fas ${iconMap[themeName]}`;
        }
    }

    updateThemeSelection(themeName) {
        // Atualizar radio buttons
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.checked = radio.value === themeName;
        });
        
        // Atualizar bordas das opções
        document.querySelectorAll('.theme-option').forEach(option => {
            option.style.borderColor = option.dataset.theme === themeName ? 
                'var(--accent-primary)' : 'transparent';
        });
    }

    // Sistema de Logs Automático
    addLog(action, details, animeName = null) {
        const log = {
            action: action,
            details: details,
            animeName: animeName,
            timestamp: new Date().toISOString()
        };
        
        const logs = JSON.parse(localStorage.getItem('animeLogs') || '[]');
        logs.unshift(log);
        
        // Manter apenas os últimos 1000 logs
        if (logs.length > 1000) {
            logs.splice(1000);
        }
        
        localStorage.setItem('animeLogs', JSON.stringify(logs));
        
        // Disparar evento customizado para sincronização
        window.dispatchEvent(new CustomEvent('animeLogAdded', { detail: log }));
    }

    // Sincronização de Temas entre Páginas
    setupThemeSync() {
        // Escutar mudanças de tema em outras abas/páginas
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentTheme') {
                this.applyTheme(e.newValue);
            }
        });
        
        // Disparar evento quando tema for alterado
        window.addEventListener('themeChanged', (e) => {
            localStorage.setItem('currentTheme', e.detail.theme);
            this.applyTheme(e.detail.theme);
        });
    }

    applyTheme(themeName) {
        if (!themeName) return;
        
        document.documentElement.setAttribute('data-theme', themeName);
        this.updateThemeIcon(themeName);
        this.updateThemeSelection(themeName);
        
        // Salvar no localStorage
        localStorage.setItem('currentTheme', themeName);
        localStorage.setItem('selectedTheme', themeName);
    }
}

// Inicializar o catálogo quando a página carregar
let animeCatalog;
document.addEventListener('DOMContentLoaded', () => {
    animeCatalog = new AnimeCatalog();
});

// Funções globais para uso nos event handlers
window.animeCatalog = null;

// Aguardar o carregamento completo da página
window.addEventListener('load', () => {
    window.animeCatalog = animeCatalog;
});
