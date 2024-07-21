$(document).ready(function () {
    // Load notes on page load
    loadNotes();
  
    // Handle new note creation
    $('#new-note').on('click', function () {
      const title = prompt("Enter note title:");
      const content = prompt("Enter note content:");
      const tags = prompt("Enter tags (comma separated):").split(',');
      const color = prompt("Enter background color (hex or color name):");
  
      if (title && content) {
        $.ajax({
          url: '/api/notes',
          method: 'POST',
          headers: {
            'Authorization': Bearer ${localStorage.getItem('token')}
          },
          contentType: 'application/json',
          data: JSON.stringify({ title, content, tags, color }),
          success: function () {
            alert('Note created');
            loadNotes();
          },
          error: function () {
            alert('Error creating note');
          }
        });
      }
    });
  
    // Handle search notes
    $('#search-notes').on('click', function () {
      const query = prompt("Enter search query:");
      if (query) {
        $.ajax({
          url: /api/notes/search?query=${query},
          method: 'GET',
          headers: {
            'Authorization': Bearer ${localStorage.getItem('token')}
          },
          success: function (notes) {
            displayNotes(notes);
          },
          error: function () {
            alert('Error searching notes');
          }
        });
      }
    });
  
    // Handle view by labels
    $('#view-labels').on('click', function () {
      const label = prompt("Enter label:");
      if (label) {
        $.ajax({
          url: /api/notes/label/${label},
          method: 'GET',
          headers: {
            'Authorization': Bearer ${localStorage.getItem('token')}
          },
          success: function (notes) {
            displayNotes(notes);
          },
          error: function () {
            alert('Error fetching notes by label');
          }
        });
      }
    });
  
    // Handle view archived notes
    $('#view-archived').on('click', function () {
      $.ajax({
        url: '/api/notes?archived=true',
        method: 'GET',
        headers: {
          'Authorization': Bearer ${localStorage.getItem('token')}
        },
        success: function (notes) {
          displayNotes(notes);
        },
        error: function () {
          alert('Error fetching archived notes');
        }
      });
    });
  });
  
  function displayNotes(notes) {
    const notesContainer = $('#notes-container');
    notesContainer.empty();
    notes.forEach(note => {
      notesContainer.append(`
        <div class="note" style="background-color: ${note.color}">
          <h2>${note.title}</h2>
          <p>${note.content}</p>
          <p>Tags: ${note.tags.join(', ')}</p>
          <button onclick="archiveNote('${note._id}')">Archive</button>
          <button onclick="unarchiveNote('${note._id}')">Unarchive</button>
          <button onclick="deleteNote('${note._id}')">Delete</button>
          <button onclick="restoreNote('${note._id}')">Restore</button>
        </div>
      `);
    });
  }
  
  function loadNotes() {
    $.ajax({
      url: '/api/notes',
      method: 'GET',
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      },
      success: function (notes) {
        displayNotes(notes);
      },
      error: function () {
        alert('Error loading notes');
      }
    });
  }
  
  function archiveNote(id) {
    $.ajax({
      url: /api/notes/${id}/archive,
      method: 'PUT',
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      },
      success: function () {
        alert('Note archived');
        loadNotes();
      },
      error: function () {
        alert('Error archiving note');
      }
    });
  }
  
  function unarchiveNote(id) {
    $.ajax({
      url: /api/notes/${id}/unarchive,
      method: 'PUT',
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      },
      success: function () {
        alert('Note unarchived');
        loadNotes();
      },
      error: function () {
        alert('Error unarchiving note');
      }
    });
  }
  
  function deleteNote(id) {
    $.ajax({
      url: /api/notes/${id},
      method: 'DELETE',
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      },
      success: function () {
        alert('Note deleted');
        loadNotes();
      },
      error: function () {
        alert('Error deleting note');
      }
    });
  }
  
  function restoreNote(id) {
    $.ajax({
      url: /api/notes/${id}/restore,
      method: 'PUT',
      headers: {
        'Authorization': Bearer ${localStorage.getItem('token')}
      },
      success: function () {
        alert('Note restored');
        loadNotes();
      },
      error: function () {
        alert('Error restoring note');
      }
    });
  }