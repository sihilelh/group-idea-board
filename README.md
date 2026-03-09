# Group Idea Board

A modern, collaborative idea management application built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Team Member Management**: Add and manage team members in a dedicated section
- **Rich Text Editor**: Use Quill to format your ideas with bold, italic, lists, and more
- **Idea Submission**: Submit ideas with automatic timestamps showing "time ago" format
- **Sorting**: Sort ideas by newest, oldest, or by author name
- **Pagination**: Navigate through ideas with numbered pagination controls
- **Local Storage**: All data persists in browser's localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, dark-themed interface with gradients and smooth animations

## 📁 Project Structure

```
groupideaboardnew/
├── index.html                 # Main HTML file with both screens
├── assets/
│   ├── css/
│   │   └── styles.css        # All styling (variables, components, responsive)
│   ├── js/
│   │   ├── storage.js        # Storage utility (localStorage operations)
│   │   ├── ui-utils.js       # UI utilities (reusable DOM operations)
│   │   ├── team-members.js   # Team members management module
│   │   └── idea-board.js     # Idea board management module
│   └── libs/                 # External libraries (if needed)
└── README.md                 # This file
```

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Start by adding team members in the "Team Members" tab
3. Switch to "Idea Board" tab to submit ideas
4. Enjoy collaborating!

## 🎯 Usage

### Adding Team Members

1. Click on "👥 Team Members" tab
2. Enter a team member's name in the input field
3. Click "➕ Add Member" button
4. Team members will appear in the list below

### Submitting Ideas

1. Click on "📋 Idea Board" tab
2. Select your name from the dropdown (must add team member first)
3. Type or paste your idea in the rich text editor
4. Format your text as needed (bold, italic, lists, etc.)
5. Click "✨ Add Idea" button
6. Your idea will appear at the top of the list with your name and timestamp

### Managing Ideas

- **View Ideas**: Browse all submitted ideas in card format
- **Sort Ideas**: Use the dropdown menu to sort by:
  - Newest First (default)
  - Oldest First
  - Author A-Z
- **Paginate**: Navigate through ideas using the pagination controls
- **Delete**: Remove ideas using the delete button on each card

## 💾 Data Storage

All data is stored in browser's localStorage:
- Team members are stored under key: `ideaBoard_teamMembers`
- Ideas are stored under key: `ideaBoard_ideas`

Data persists between sessions. To clear all data, open browser DevTools and run:
```javascript
StorageManager.clearAll();
```

## 🛠️ Modules & Reusable Functions

### StorageManager
```javascript
- getTeamMembers()           // Get all team members array
- addTeamMember(name)        // Add a new team member
- removeTeamMember(name)     // Remove a team member
- getIdeas()                 // Get all ideas array
- addIdea(idea)              // Add a new idea
- removeIdea(ideaId)         // Remove an idea
- clearAll()                 // Clear all data
```

### UIUtils
```javascript
- showSuccessMessage(msg, container, duration)  // Show success notification
- formatDate(dateString)                        // Format timestamp to readable format
- populateSelect(selector, options, default)   // Populate dropdown options
- toggleVisibility(selector, show)             // Show/hide elements
- getFormData(formSelector)                    // Get form data as object
- clearForm(formSelector)                      // Clear form inputs
- createPagination(page, total, callback)     // Create pagination controls
- debounce(func, wait)                         // Debounce function calls
- escapeHtml(text)                             // Escape HTML for safe display
```

### IdeaBoardManager
```javascript
- init()                     // Initialize idea board
- deleteIdea(ideaId)        // Delete an idea
```

### TeamMembersManager
```javascript
- init()                     // Initialize team members
- removeMember(name)         // Remove a team member
- updateAuthorDropdown()     // Update dropdown after changes
```

## 🎨 Customization

### Colors & Theme

Edit the CSS variables in `assets/css/styles.css`:
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #ec4899;
  /* ... more variables ... */
}
```

### Pagination

Change items per page in `assets/js/idea-board.js`:
```javascript
const state = {
  itemsPerPage: 5,  // Change this value
};
```

### Rich Text Editor

Modify Quill toolbar in `assets/js/idea-board.js`:
```javascript
modules: {
  toolbar: [
    ['bold', 'italic', 'underline'],
    // Add or remove toolbar options
  ],
}
```

## 🌐 Browser Compatibility

- Chrome/Edge: ✅ (v90+)
- Firefox: ✅ (v88+)
- Safari: ✅ (v14+)
- IE11: ❌ (Not supported - uses modern JS)

## 📝 Notes

- Team member names must be unique (case-insensitive)
- Ideas are stored with unique IDs generated from timestamps
- Timestamps automatically format to "time ago" style (e.g., "2h ago")
- All data is local to the browser only (no server required)

## 🔓 Future Enhancements

Potential features to add:
- Export ideas to PDF/CSV
- User authentication
- Server-side storage
- Idea categories/tags
- Voting/rating system
- Search and filtering
- Dark/Light theme toggle
- Animations and transitions

## 📄 License

This project is open source and available for personal and commercial use.

---

**Created with ❤️ for collaborative idea sharing**
