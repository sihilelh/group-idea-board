/**
 * Stats Manager Module
 * Handles displaying statistics
 */

const StatsManager = (() => {
  /**
   * Initialize stats manager
   */
  const init = () => {
    updateStats();
    
    // Update stats when ideas or members change
    window.addEventListener('ideasUpdated', updateStats);
    window.addEventListener('membersUpdated', updateStats);
  };

  /**
   * Update all statistics
   */
  const updateStats = () => {
    updateTotalIdeas();
    updateTopContributor();
    updateTotalMembers();
  };

  /**
   * Update total ideas count
   */
  const updateTotalIdeas = () => {
    const ideas = StorageManager.getIdeas();
    const members = StorageManager.getTeamMembers();
    
    // Filter out ideas from deleted members
    const activeIdeas = ideas.filter(idea => members.includes(idea.author));
    
    const totalIdeasEl = document.querySelector('#totalIdeas');
    if (totalIdeasEl) {
      totalIdeasEl.textContent = activeIdeas.length;
    }
  };

  /**
   * Update top contributor
   */
  const updateTopContributor = () => {
    const ideas = StorageManager.getIdeas();
    const members = StorageManager.getTeamMembers();
    
    // Filter out ideas from deleted members
    const activeIdeas = ideas.filter(idea => members.includes(idea.author));
    
    // Count ideas by author
    const authorCounts = {};
    activeIdeas.forEach(idea => {
      authorCounts[idea.author] = (authorCounts[idea.author] || 0) + 1;
    });

    // Find top contributor
    let topContributor = '-';
    let maxIdeas = 0;

    for (const [author, count] of Object.entries(authorCounts)) {
      if (count > maxIdeas) {
        maxIdeas = count;
        topContributor = author;
      }
    }

    const topContributorEl = document.querySelector('#topContributorName');
    if (topContributorEl) {
      topContributorEl.textContent = topContributor;
    }

    // Update badges in idea cards
    updateBadges(topContributor);
  };

  /**
   * Update total members count
   */
  const updateTotalMembers = () => {
    const members = StorageManager.getTeamMembers();
    const totalMembersEl = document.querySelector('#totalMembers');
    if (totalMembersEl) {
      totalMembersEl.textContent = members.length;
    }
  };

  /**
   * Update badges for top contributor
   * @param {string} topContributor - Top contributor name
   */
  const updateBadges = (topContributor) => {
    // Remove all existing badges
    document.querySelectorAll('.badge').forEach(badge => badge.remove());

    if (topContributor === '-') return;

    // Add badge to top contributor's ideas
    document.querySelectorAll('.idea-author').forEach(authorEl => {
      if (authorEl.textContent.trim() === topContributor) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-top-contributor';
        badge.textContent = '⭐ Top Contributor';
        authorEl.appendChild(badge);
      }
    });

    // Also add badge to team member card if on team tab
    document.querySelectorAll('.idea-card').forEach(card => {
      const authorEl = card.querySelector('.idea-author');
      if (authorEl && authorEl.textContent.includes(topContributor)) {
        // Already updated in renderTeamMembers
      }
    });
  };

  return {
    init,
    updateStats,
  };
})();
