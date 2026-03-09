/**
 * Idea Board Management Module
 * Handles displaying ideas with pagination and sorting
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
  };

  const state = {
    currentPage: 1,
    itemsPerPage: 5,
    sortBy: 'newest', // newest or oldest
    ideas: [],
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
  };

  /**
   * Handle adding a new idea
   * @param {Event} e - Submit event
   */
  const handleAddIdea = (e) => {
    e.preventDefault();

    const authorSelect = document.querySelector(selectors.authorSelect);
    const author = authorSelect.value;

    if (!author) {
      alert('Please select a team member');
      return;
    }

    let content = '';
    if (quillEditor) {
      content = quillEditor.root.innerHTML;
      // Check if content is empty (only has default paragraph)
      if (content === '<p><br></p>' || content.trim() === '') {
        alert('Please enter your idea');
        return;
      }
    } else {
      // Fallback if Quill is not loaded
      const textarea = document.querySelector(selectors.contentEditor);
      content = textarea ? textarea.value : '';
      if (!content.trim()) {
        alert('Please enter your idea');
        return;
      }
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
    } else {
      alert('Failed to add idea');
    }
  };

  /**
   * Populate author dropdown
   */
  const populateAuthorDropdown = () => {
    const members = StorageManager.getTeamMembers();
    UIUtils.populateSelect(selectors.authorSelect, members);
  };

  /**
   * Get sorted ideas
   * @returns {Array} Sorted ideas
   */
  const getSortedIdeas = () => {
    const ideas = StorageManager.getIdeas();

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
   * Get paginated ideas
   * @returns {Array} Paginated ideas
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
   * Render ideas
   */
  const renderIdeas = () => {
    const { ideas, totalPages, total } = getPaginatedIdeas();
    const container = document.querySelector(selectors.ideasContainer);
    const paginationContainer = document.querySelector(selectors.paginationContainer);

    if (!container) return;

    if (total === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💡</div>
          <h3>No ideas yet</h3>
          <p>Add your first idea to get started</p>
        </div>
      `;

      if (paginationContainer) {
        paginationContainer.innerHTML = '';
      }
      return;
    }

    const ideasHtml = ideas
      .map(
        idea => `
        <div class="idea-card fade-in">
          <div class="idea-header">
            <div>
              <div class="idea-author">${UIUtils.escapeHtml(idea.author)}</div>
              <div class="idea-time">${UIUtils.formatDate(idea.timestamp)}</div>
            </div>
            <button class="btn btn-sm" onclick="IdeaBoardManager.deleteIdea('${idea.id}')">
              Delete
            </button>
          </div>
          <div class="idea-content">
            ${idea.content}
          </div>
        </div>
      `
      )
      .join('');

    container.innerHTML = ideasHtml;

    // Render pagination
    if (paginationContainer && totalPages > 1) {
      const paginationElement = UIUtils.createPagination(state.currentPage, totalPages, (page) => {
        state.currentPage = page;
        renderIdeas();
        // Scroll to ideas
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
    if (confirm('Are you sure you want to delete this idea?')) {
      StorageManager.removeIdea(ideaId);
      const { totalPages } = getPaginatedIdeas();

      // Adjust current page if needed
      if (state.currentPage > totalPages && totalPages > 0) {
        state.currentPage = totalPages;
      }

      renderIdeas();
      UIUtils.showSuccessMessage('Idea deleted');
    }
  };

  return {
    init,
    deleteIdea,
  };
})();
