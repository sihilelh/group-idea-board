/**
 * Team Members Management Module
 * Handles adding and displaying team members
 */

const TeamMembersManager = (() => {
  const selectors = {
    form: '#teamMemberForm',
    input: '#teamMemberInput',
    list: '#teamMembersList',
    container: '#teamMembersContainer',
  };

  /**
   * Initialize team members management
   */
  const init = () => {
    attachEventListeners();
    renderTeamMembers();
  };

  /**
   * Attach event listeners
   */
  const attachEventListeners = () => {
    const form = document.querySelector(selectors.form);
    if (form) {
      form.addEventListener('submit', handleAddTeamMember);
    }
  };

  /**
   * Handle adding a team member
   * @param {Event} e - Submit event
   */
  const handleAddTeamMember = (e) => {
    e.preventDefault();

    const input = document.querySelector(selectors.input);
    const name = input.value.trim();

    if (!name) {
      alert('Please enter a team member name');
      return;
    }

    const success = StorageManager.addTeamMember(name);

    if (success) {
      UIUtils.showSuccessMessage(`${name} added successfully!`, document.querySelector(selectors.container));
      UIUtils.clearForm(selectors.form);
      renderTeamMembers();
      updateAuthorDropdown();
      updateFilterDropdown();
    } else {
      alert('Failed to add team member. The name might already exist.');
    }
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
   * Render team members list
   */
  const renderTeamMembers = () => {
    const members = StorageManager.getTeamMembers();
    const listContainer = document.querySelector(selectors.list);

    if (!listContainer) return;

    if (members.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <img src="assets/icons/people-icon.svg" alt="No team members" style="width: 48px; height: 48px; opacity: 0.5;">
          </div>
          <h3>No team members yet</h3>
          <p>Add your first team member above to get started</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = members
      .map(
        member => `
        <div class="idea-card">
          <div class="idea-header">
            <span class="idea-author">${member}</span>
            <button class="btn-icon" onclick="TeamMembersManager.removeMember('${member}')" title="Remove team member">
              ${getDeleteIconSVG()}
            </button>
          </div>
        </div>
      `
      )
      .join('');
  };

  /**
   * Remove a team member
   * @param {string} name - Team member name
   */
  const removeMember = (name) => {
    if (confirm(`Are you sure you want to remove ${name}? Their ideas will be omitted from the board.`)) {
      StorageManager.removeTeamMember(name);
      renderTeamMembers();
      updateAuthorDropdown();
      updateFilterDropdown();
      IdeaBoardManager.resetFilter();
      UIUtils.showSuccessMessage(`${name} removed. Their ideas have been removed from the board.`);
    }
  };

  /**
   * Update the author dropdown in the main board
   */
  const updateAuthorDropdown = () => {
    const members = StorageManager.getTeamMembers();
    const authorSelect = document.querySelector('#ideaAuthor');

    if (authorSelect) {
      UIUtils.populateSelect(authorSelect, members);
    }
  };

  /**
   * Update the filter dropdown in the main board
   */
  const updateFilterDropdown = () => {
    if (typeof IdeaBoardManager !== 'undefined' && IdeaBoardManager.populateFilterDropdown) {
      IdeaBoardManager.populateFilterDropdown();
    }
  };

  return {
    init,
    removeMember,
    updateAuthorDropdown,
    updateFilterDropdown,
  };
})();
