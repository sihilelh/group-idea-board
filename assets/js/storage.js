/**
 * Storage Utility Module
 * Handles all localStorage operations for the idea board
 * Reusable for storing and retrieving data
 */

const StorageManager = (() => {
  const STORAGE_KEYS = {
    TEAM_MEMBERS: 'ideaBoard_teamMembers',
    IDEAS: 'ideaBoard_ideas',
  };

  /**
   * Get all team members from localStorage
   * @returns {Array} Array of team members
   */
  const getTeamMembers = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving team members:', error);
      return [];
    }
  };

  /**
   * Add a new team member
   * @param {string} name - Team member name
   * @returns {boolean} Success status
   */
  const addTeamMember = (name) => {
    try {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid team member name');
      }

      const members = getTeamMembers();
      const normalizedName = name.trim();

      // Check for duplicates
      if (members.some(m => m.toLowerCase() === normalizedName.toLowerCase())) {
        throw new Error('Team member already exists');
      }

      members.push(normalizedName);
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
      return true;
    } catch (error) {
      console.error('Error adding team member:', error);
      return false;
    }
  };

  /**
   * Remove a team member
   * @param {string} name - Team member name
   * @returns {boolean} Success status
   */
  const removeTeamMember = (name) => {
    try {
      let members = getTeamMembers();
      members = members.filter(m => m !== name);
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
      return true;
    } catch (error) {
      console.error('Error removing team member:', error);
      return false;
    }
  };

  /**
   * Get all ideas from localStorage
   * @returns {Array} Array of ideas
   */
  const getIdeas = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving ideas:', error);
      return [];
    }
  };

  /**
   * Add a new idea
   * @param {Object} idea - Idea object with author and content
   * @returns {Object} Created idea with timestamp and id
   */
  const addIdea = (idea) => {
    try {
      if (!idea.author || !idea.content) {
        throw new Error('Idea must have author and content');
      }

      const ideas = getIdeas();
      const newIdea = {
        id: Date.now().toString(),
        author: idea.author.trim(),
        content: idea.content.trim(),
        timestamp: new Date().toISOString(),
      };

      ideas.push(newIdea);
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
      return newIdea;
    } catch (error) {
      console.error('Error adding idea:', error);
      return null;
    }
  };

  /**
   * Remove an idea by id
   * @param {string} ideaId - Idea ID
   * @returns {boolean} Success status
   */
  const removeIdea = (ideaId) => {
    try {
      let ideas = getIdeas();
      ideas = ideas.filter(idea => idea.id !== ideaId);
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
      return true;
    } catch (error) {
      console.error('Error removing idea:', error);
      return false;
    }
  };

  /**
   * Clear all data (for development/testing)
   */
  const clearAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
      localStorage.removeItem(STORAGE_KEYS.IDEAS);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  return {
    getTeamMembers,
    addTeamMember,
    removeTeamMember,
    getIdeas,
    addIdea,
    removeIdea,
    clearAll,
  };
})();
