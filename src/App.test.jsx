// App.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import WrappedApp from './App'; // Ensure you're importing the wrapped version for Router context
import { EditorContext } from './components/EditorContext';
import { nanoid } from 'nanoid';

jest.mock('nanoid', () => {
  return {
    nanoid: jest.fn(() => '1234567890'),
  };
});

const editorInstanceMock = {
  clear: jest.fn(),
  save: jest.fn(() => Promise.resolve({ blocks: [{ data: { text: 'New Note' } }], id: '1234567890' })),
  render: jest.fn(),
};

const editorContextValue = {
  editorInstanceRef: { current: editorInstanceMock },
};

describe('App Component', () => {
  test('renders Note Management App header', () => {
    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );
    expect(screen.getByText('Note Management App')).toBeInTheDocument();
  });

  test('renders Personal Notes button and navigates on click', () => {
    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const personalNotesButton = screen.getByText('Personal Notes');
    expect(personalNotesButton).toBeInTheDocument();

    fireEvent.click(personalNotesButton);
    expect(screen.getByText('Personal Notes')).toBeInTheDocument(); // Ensure the Personal component renders correctly
  });

  test('renders Work Notes button and navigates on click', () => {
    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const workNotesButton = screen.getByText('Work Notes');
    expect(workNotesButton).toBeInTheDocument();

    fireEvent.click(workNotesButton);
    expect(screen.getByText('Work Notes')).toBeInTheDocument(); // Ensure the Work component renders correctly
  });

  test('adds a new note', async () => {
    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const addButton = screen.getAllByText('Add new Note')[0]; // There are two "Add new Note" buttons, we select the first one
    fireEvent.click(addButton);

    const saveButton = screen.getByText('Save'); // Assuming there's a save button in your modal
    fireEvent.click(saveButton);

    await screen.findByText('New Note'); // Wait for the note to be added
    expect(screen.getByText('New Note')).toBeInTheDocument();
  });

  test('edits an existing note', async () => {
    const initialNotes = [
      { id: '1', blocks: [{ data: { text: 'Note to edit' } }] },
    ];
    localStorage.setItem('notes', JSON.stringify(initialNotes));

    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const editButton = screen.getByLabelText('Edit Note to edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await screen.findByText('New Note'); // Wait for the note to be updated
    expect(screen.getByText('New Note')).toBeInTheDocument();
  });

  test('deletes a note', () => {
    const initialNotes = [
      { id: '1', blocks: [{ data: { text: 'Note to delete' } }] },
    ];
    localStorage.setItem('notes', JSON.stringify(initialNotes));

    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const deleteButton = screen.getByLabelText('Delete Note to delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Note to delete')).not.toBeInTheDocument();
  });

  test('search functionality works', () => {
    const initialNotes = [
      { id: '1', blocks: [{ data: { text: 'Test Note' } }] },
      { id: '2', blocks: [{ data: { text: 'Another Note' } }] },
    ];
    localStorage.setItem('notes', JSON.stringify(initialNotes));

    render(
      <Router>
        <EditorContext.Provider value={editorContextValue}>
          <WrappedApp />
        </EditorContext.Provider>
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.queryByText('Another Note')).not.toBeInTheDocument();
  });
});
