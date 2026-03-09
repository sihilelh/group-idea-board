/**
 * Dialog Manager Module
 * Handles custom dialogs, alerts, and confirms
 */

const DialogManager = (() => {
  let confirmCallback = null;
  let alertCallback = null;
  let currentEditingIdeaId = null;
  let editIdeaQuill = null;
  let editTimeInterval = null;

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Dialog message
   * @param {Function} callback - Callback function (true/false)
   */
  const showConfirm = (title, message, callback) => {
    const dialog = document.querySelector('#confirmDialog');
    const titleEl = document.querySelector('#confirmTitle');
    const messageEl = document.querySelector('#confirmMessage');

    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmCallback = callback;

    dialog.classList.add('show');
  };

  /**
   * Close confirm dialog
   * @param {boolean} result - User result
   */
  const closeConfirm = (result) => {
    const dialog = document.querySelector('#confirmDialog');
    dialog.classList.remove('show');

    if (confirmCallback) {
      confirmCallback(result);
      confirmCallback = null;
    }
  };

  /**
   * Show alert dialog
   * @param {string} title - Dialog title
   * @param {string} message - Dialog message
   * @param {Function} callback - Optional callback
   */
  const showAlert = (title, message, callback = null) => {
    const dialog = document.querySelector('#alertDialog');
    const titleEl = document.querySelector('#alertTitle');
    const messageEl = document.querySelector('#alertMessage');

    titleEl.textContent = title;
    messageEl.textContent = message;
    alertCallback = callback;

    dialog.classList.add('show');
  };

  /**
   * Close alert dialog
   */
  const closeAlert = () => {
    const dialog = document.querySelector('#alertDialog');
    dialog.classList.remove('show');

    if (alertCallback) {
      alertCallback();
      alertCallback = null;
    }
  };

  /**
   * Show edit idea modal
   * @param {string} ideaId - Idea ID to edit
   * @param {string} content - Current idea content
   */
  const showEditIdea = (ideaId, content) => {
    const modal = document.querySelector('#editIdeaModal');
    const ideaContainer = document.querySelector('#editIdeaContent');

    currentEditingIdeaId = ideaId;

    // Initialize Quill editor if not already done
    if (!editIdeaQuill) {
      editIdeaQuill = new Quill('#editIdeaContent', {
        theme: 'snow',
        placeholder: 'Edit your idea here...',
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

    // Set content
    editIdeaQuill.root.innerHTML = content;

    // Start timer countdown
    startEditTimer();

    // Show modal
    modal.classList.add('show');
  };

  /**
   * Start edit timer countdown (15 minutes)
   */
  const startEditTimer = () => {
    const timeEl = document.querySelector('#editTimeRemaining');
    let secondsRemaining = 15 * 60; // 15 minutes

    if (editTimeInterval) {
      clearInterval(editTimeInterval);
    }

    editTimeInterval = setInterval(() => {
      secondsRemaining--;

      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;

      timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      if (secondsRemaining <= 0) {
        clearInterval(editTimeInterval);
        closeEditIdea();
        showAlert('Edit Time Expired', 'Your 15-minute edit window has expired.');
      }
    }, 1000);
  };

  /**
   * Save edited idea
   */
  const saveEditedIdea = () => {
    if (!currentEditingIdeaId || !editIdeaQuill) return;

    const newContent = editIdeaQuill.root.innerHTML;

    // Get the idea from storage
    const ideas = StorageManager.getIdeas();
    const ideaIndex = ideas.findIndex(idea => idea.id === currentEditingIdeaId);

    if (ideaIndex !== -1) {
      ideas[ideaIndex].content = newContent;
      localStorage.setItem('ideaBoard_ideas', JSON.stringify(ideas));

      closeEditIdea();
      IdeaBoardManager.renderIdeas();
      UIUtils.showSuccessMessage('Idea updated successfully!');
    }
  };

  /**
   * Close edit idea modal
   */
  const closeEditIdea = () => {
    const modal = document.querySelector('#editIdeaModal');
    modal.classList.remove('show');

    if (editTimeInterval) {
      clearInterval(editTimeInterval);
    }

    currentEditingIdeaId = null;
  };

  return {
    showConfirm,
    closeConfirm,
    showAlert,
    closeAlert,
    showEditIdea,
    saveEditedIdea,
    closeEditIdea,
  };
})();
