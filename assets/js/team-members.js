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
      // Update the dropdown in the main board
      updateAuthorDropdown();
    } else {
      alert('Failed to add team member. The name might already exist.');
    }
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
          <div class="empty-state-icon">👥</div>
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
            <button class="btn btn-sm" onclick="TeamMembersManager.removeMember('${member}')">
              Remove
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
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      StorageManager.removeTeamMember(name);
      renderTeamMembers();
      updateAuthorDropdown();
      UIUtils.showSuccessMessage(`${name} removed`);
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

  return {
    init,
    removeMember,
    updateAuthorDropdown,
  };
})();
