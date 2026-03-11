/**
 * Idea Board Management Module
 * Handles displaying ideas with pagination, sorting, and filtering
 */

const IdeaBoardManager = (() => {
  const selectors = {
    form: '#ideaForm',
    authorSelect: '#ideaAuthor',
    contentEditor: '#ideaContent',
    ideasContainer: '#ideasContainer',
    paginationContainer: '#paginationContainer',
    sortContainer: '#sortControls',
    boardContainer: '#boardContainer',
    filterSelect: '#filterSelect',
    userSelectModal: '#userSelectModal',
    modalUserSelect: '#modalUserSelect',
  };

  const state = {
    currentPage: 1,
    itemsPerPage: 5,
    sortBy: 'newest',
    filterByUser: '',
    currentUser: null,
  };

  let quillEditor = null;

  /**
   * Initialize idea board
   */
  const init = () => {
    initializeQuill();
    attachEventListeners();
    renderIdeas();
    populateAuthorDropdown();
    populateFilterDropdown();
  };

  /**
   * Initialize Quill rich text editor
   */
  const initializeQuill = () => {
    const editorContainer = document.querySelector(selectors.contentEditor);
    if (editorContainer && typeof Quill !== 'undefined') {
      quillEditor = new Quill(selectors.contentEditor, {
        theme: 'snow',
        placeholder: 'Enter your idea here...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });
    }
  };

  /**
   * Check if an idea can be edited
   * @param {string} timestamp - Idea timestamp
   * @returns {boolean} Whether idea can be edited
   */
  const canEditIdea = (timestamp) => {
    const ideaTime = new Date(timestamp);
    const currentTime = new Date();
    const diffMs = currentTime - ideaTime;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins < 15; // Can edit within 15 minutes
  };

  /**
   * Get time remaining to edit
   * @param {string} timestamp - Idea timestamp
   * @returns {string} Time remaining or empty string if expired
   */
  const getEditTimeRemaining = (timestamp) => {
    const ideaTime = new Date(timestamp);
    const currentTime = new Date();
    const diffMs = currentTime - ideaTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins >= 15) {
      return '';
    }

    const minsLeft = 15 - diffMins;
    const secsLeft = 60 - (Math.floor((diffMs % 60000) / 1000));

    return `${minsLeft}:${secsLeft.toString().padStart(2, '0')}`;
  };

  /**
   * Attach event listeners
   */
  const attachEventListeners = () => {
    const form = document.querySelector(selectors.form);
    if (form) {
      form.addEventListener('submit', handleAddIdea);
    }

    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        state.currentPage = 1;
        renderIdeas();
      });
    }

    const filterSelect = document.querySelector(selectors.filterSelect);
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        state.filterByUser = e.target.value;
        state.currentPage = 1;
        renderIdeas();
      });
    }

    // Delegate read-more clicks to avoid recreating listeners on each render
    const container = document.querySelector(selectors.ideasContainer);
    if (container) {
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.read-more-btn');
        if (!btn) return;
        handleReadMoreClick(btn);
      });
    }
  };

  /**
   * Handle adding a new idea
   * @param {Event} e - Submit event
   */
  const isValidIdeaContent = (text) => {
    const trimmed = text.trim();
    return /^[A-Za-z0-9]/.test(trimmed);
  };

  const handleAddIdea = (e) => {
    e.preventDefault();

    const authorSelect = document.querySelector(selectors.authorSelect);
    const author = authorSelect.value;

    if (!author) {
      DialogManager.showAlert('Selection Required', 'Please select a team member');
      return;
    }

    let content = '';
    let plainText = '';

    if (quillEditor) {
      content = quillEditor.root.innerHTML;
      plainText = quillEditor.getText();

      if (content === '<p><br></p>' || plainText.trim() === '') {
        DialogManager.showAlert('Content Required', 'Please enter your idea');
        return;
      }
    } else {
      const textarea = document.querySelector(selectors.contentEditor);
      content = textarea ? textarea.value : '';
      plainText = content;

      if (!plainText.trim()) {
        DialogManager.showAlert('Content Required', 'Please enter your idea');
        return;
      }
    }

    if (!isValidIdeaContent(plainText)) {
      DialogManager.showAlert(
        'Invalid Idea',
        'Ideas must start with a letter or number'
      );
      return;
    }

    const idea = StorageManager.addIdea({
      author,
      content,
    });

    if (idea) {
      UIUtils.showSuccessMessage('Idea added successfully!', document.querySelector(selectors.boardContainer));
      UIUtils.clearForm(selectors.form);
      if (quillEditor) {
        quillEditor.setContents([]);
      }
      state.currentPage = 1;
      renderIdeas();
      StatsManager.updateStats();
    } else {
      DialogManager.showAlert('Error', 'Failed to add idea');
    }
  };

  /**
   * Populate author dropdown with active team members only
   */
  const populateAuthorDropdown = () => {
    const members = StorageManager.getTeamMembers();
    const currentMember = state.currentUser || StorageManager.getCurrentMember();
    UIUtils.populateSelect(selectors.authorSelect, members, currentMember || '');
  };

  /**
   * Populate filter dropdown with active team members
   */
  const populateFilterDropdown = () => {
    const members = StorageManager.getTeamMembers();
    const filterSelect = document.querySelector(selectors.filterSelect);
    
    if (!filterSelect) return;

    // Clear previous options
    filterSelect.innerHTML = '<option value="">All Users</option>';

    // Add team member options
    members.forEach(member => {
      const option = document.createElement('option');
      option.value = member;
      option.textContent = member;
      filterSelect.appendChild(option);
    });
  };

  /**
   * Reset filter
   */
  const resetFilter = () => {
    state.filterByUser = '';
    state.currentPage = 1;
    const filterSelect = document.querySelector(selectors.filterSelect);
    if (filterSelect) {
      filterSelect.value = '';
    }
    renderIdeas();
  };

  /**
   * Get sorted ideas with filter applied
   * @returns {Array} Filtered and sorted ideas
   */
  const getSortedIdeas = () => {
    let ideas = StorageManager.getIdeas();
    
    // Apply filter - exclude deleted users from results
    if (state.filterByUser) {
      ideas = ideas.filter(idea => idea.author === state.filterByUser);
    } else {
      // When showing all, filter out deleted users (ideas from removed team members)
      const activeMembers = StorageManager.getTeamMembers();
      ideas = ideas.filter(idea => activeMembers.includes(idea.author));
    }

    return [...ideas].sort((a, b) => {
      if (state.sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (state.sortBy === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else if (state.sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });
  };

  /**
   * Get paginated ideas (with all filters applied)
   * @returns {Object} Paginated ideas and pagination info
   */
  const getPaginatedIdeas = () => {
    const allIdeas = getSortedIdeas();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;

    return {
      ideas: allIdeas.slice(startIndex, endIndex),
      totalPages: Math.ceil(allIdeas.length / state.itemsPerPage),
      total: allIdeas.length,
    };
  };

  /**
   * Get delete icon SVG
   * @returns {string} SVG string for delete icon
   */
  const getDeleteIconSVG = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`;
  };

  /**
   * Handle incrementally revealing more lines in idea content
   * @param {HTMLElement} button - Read more button
   */
  const handleReadMoreClick = (button) => {
    const card = button.closest('.idea-card');
    if (!card) return;

    const contentEl = card.querySelector('.idea-content');
    if (!contentEl) return;

    const lineHeight = parseFloat(button.dataset.lineHeight) || parseFloat(getComputedStyle(contentEl).lineHeight) || 20;
    const linesShown = parseInt(button.dataset.linesShown || '3', 10);
    const newLines = linesShown + 3;

    const newMaxHeight = newLines * lineHeight;
    contentEl.style.maxHeight = `${newMaxHeight}px`;
    button.dataset.linesShown = newLines;

    // Hide button if we are showing the full content
    if (contentEl.scrollHeight <= newMaxHeight + 1) {
      button.style.display = 'none';
    }
  };

  /**
   * Apply read-more truncation (3 lines) for long idea content
   */
  const applyReadMoreTruncation = () => {
    const container = document.querySelector(selectors.ideasContainer);
    if (!container) return;

    const cards = container.querySelectorAll('.idea-card');
    cards.forEach((card) => {
      const contentEl = card.querySelector('.idea-content');
      const button = card.querySelector('.read-more-btn');
      if (!contentEl || !button) return;

      const lineHeight = parseFloat(getComputedStyle(contentEl).lineHeight) || 20;
      const initialLines = 3;
      const maxHeight = initialLines * lineHeight;

      contentEl.style.maxHeight = `${maxHeight}px`;
      contentEl.style.overflow = 'hidden';
      contentEl.style.position = 'relative';

      button.dataset.linesShown = initialLines;
      button.dataset.lineHeight = lineHeight;

      if (contentEl.scrollHeight <= maxHeight + 1) {
        button.style.display = 'none';
      } else {
        button.style.display = 'inline-block';
      }
    });
  };

  /**
   * Render ideas with applied filters and sorting
   */
  const renderIdeas = () => {
    const { ideas, totalPages, total } = getPaginatedIdeas();
    const container = document.querySelector(selectors.ideasContainer);
    const paginationContainer = document.querySelector(selectors.paginationContainer);

    if (!container) return;

    if (total === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <img src="assets/icons/lightbulb-icon.svg" alt="No ideas" style="width: 48px; height: 48px; opacity: 0.5;">
          </div>
          <h3>No ideas yet</h3>
          <p>${state.filterByUser ? 'No ideas from this user' : 'Add your first idea to get started'}</p>
        </div>
      `;

      if (paginationContainer) {
        paginationContainer.innerHTML = '';
      }
      return;
    }

    const ideasHtml = ideas
      .map(
        idea => {
          const canEdit = canEditIdea(idea.timestamp);
          const editBtn = canEdit ? `
            <button class="btn-edit" onclick="DialogManager.showEditIdea('${idea.id}')" title="Edit idea">
              Edit
            </button>
          ` : `<button class="btn-edit expired" title="Edit window expired" disabled>Edit</button>`;

          return `
            <div class="idea-card fade-in" data-idea-id="${idea.id}">
              <div class="idea-header">
                <div>
                  <div class="idea-author">${UIUtils.escapeHtml(idea.author)}</div>
                  <div class="idea-time">${UIUtils.formatDate(idea.timestamp)}</div>
                </div>
                <div class="idea-actions">
                  ${editBtn}
                  <button class="btn-icon" onclick="IdeaBoardManager.deleteIdea('${idea.id}')" title="Delete idea">
                    ${getDeleteIconSVG()}
                  </button>
                </div>
              </div>
              <div class="idea-content-wrapper">
                <div class="idea-content">
                  ${idea.content}
                </div>
                <button type="button" class="read-more-btn">Read more</button>
              </div>
            </div>
          `;
        }
      )
      .join('');

    container.innerHTML = ideasHtml;

    // Apply truncation/read-more handling for long ideas
    applyReadMoreTruncation();

    // Render pagination
    if (paginationContainer && totalPages > 1) {
      const paginationElement = UIUtils.createPagination(state.currentPage, totalPages, (page) => {
        state.currentPage = page;
        renderIdeas();
        document.querySelector(selectors.ideasContainer)?.scrollIntoView({ behavior: 'smooth' });
      });
      paginationContainer.innerHTML = '';
      paginationContainer.appendChild(paginationElement);
    } else if (paginationContainer) {
      paginationContainer.innerHTML = '';
    }
  };

  /**
   * Delete an idea
   * @param {string} ideaId - Idea ID
   */
  const deleteIdea = (ideaId) => {
    DialogManager.showConfirm('Delete Idea', 'Are you sure you want to delete this idea?', (confirmed) => {
      if (confirmed) {
        StorageManager.removeIdea(ideaId);
        const { totalPages } = getPaginatedIdeas();

        if (state.currentPage > totalPages && totalPages > 0) {
          state.currentPage = totalPages;
        }

        renderIdeas();
        StatsManager.updateStats();
        UIUtils.showSuccessMessage('Idea deleted');
      }
    });
  };

  /**
   * Show user selection modal on page load
   */
  const showUserSelectionModal = () => {
    const modal = document.querySelector(selectors.userSelectModal);
    const members = StorageManager.getTeamMembers();
    const modalSelect = document.querySelector(selectors.modalUserSelect);

    if (!modal || !modalSelect) return;

    // Check if currentMember exists in localStorage
    const currentMember = StorageManager.getCurrentMember();
    
    if (currentMember) {
      // Verify the current member still exists in team members list
      const memberExists = members.some(m => m === currentMember);
      
      if (memberExists) {
        // Set current user and don't show modal
        state.currentUser = currentMember;
        // Pre-select the current member in the author dropdown
        populateAuthorDropdown();
        return;
      } else {
        // Current member no longer exists, clear it
        localStorage.removeItem('ideaBoard_currentMember');
      }
    }

    // No current member or member doesn't exist - show modal
    // Populate modal dropdown
    modalSelect.innerHTML = '<option value="">Select a name...</option>';
    members.forEach(member => {
      const option = document.createElement('option');
      option.value = member;
      option.textContent = member;
      modalSelect.appendChild(option);
    });

    // Show modal
    modal.classList.add('show');
  };

  /**
   * Select user from modal
   */
  const selectUserFromModal = () => {
    const modalSelect = document.querySelector(selectors.modalUserSelect);
    const modal = document.querySelector(selectors.userSelectModal);

    if (!modalSelect || !modal) return;

    if (!modalSelect.value) {
      DialogManager.showAlert('Selection Required', 'Please select your name');
      return;
    }

    const selectedUser = modalSelect.value;
    state.currentUser = selectedUser;
    
    // Save to localStorage as currentMember
    StorageManager.setCurrentMember(selectedUser);
    
    // Update author dropdown to reflect current user
    populateAuthorDropdown();
    
    // Close modal
    modal.classList.remove('show');
  };

  /**
   * Go to add team member page
   */
  const goToAddTeamMember = () => {
    const modal = document.querySelector(selectors.userSelectModal);
    if (modal) {
      modal.classList.remove('show');
    }
    // Switch to team tab
    switchTab('team');
  };

  return {
    init,
    deleteIdea,
    resetFilter,
    showUserSelectionModal,
    selectUserFromModal,
    goToAddTeamMember,
    populateFilterDropdown,
    renderIdeas,
    canEditIdea,
  };
})();
