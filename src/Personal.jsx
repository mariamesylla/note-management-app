import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import EditorModal from "./components/EditorModal";
import Card from "./components/Card";
import Masonry from "react-masonry-css";
import { EditorContext } from "./components/EditorContext";
import { nanoid } from "nanoid";

function Personal() {
  const localNotes = JSON.parse(localStorage.getItem("notes"));
  const [notesArr, setNotesArr] = useState(
    localNotes ? localNotes.filter((note) => note.type === "personal") : []
  );
  const updatedId = useRef(null);

  const { editorInstanceRef } = useContext(EditorContext);

  const handleAdd = () => {
    updatedId.current = null;
    editorInstanceRef.current.clear();
  };

  const handleSave = async () => {
    const data = await editorInstanceRef.current.save();
    if (updatedId.current) {
      handleDelete(updatedId.current);
      data.id = updatedId.current;
      updatedId.current = null;
    } else {
      data.id = nanoid(10);
      data.type = "personal";
    }
    if (data.blocks.length) {
      setNotesArr((prev) => [data, ...prev]);
      const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
      localStorage.setItem(
        "notes",
        JSON.stringify([
          data,
          ...allNotes.filter((note) => note.type !== "personal"),
        ])
      );
    }
  };

  const handleEdit = (idx) => {
    updatedId.current = idx;
    notesArr.forEach((note) => {
      if (note.id === idx) {
        editorInstanceRef.current.render({
          blocks: note.blocks,
        });
      }
    });
  };

  const handleDelete = (idx) => {
    const filteredNotes = notesArr.filter((note) => note.id !== idx);
    setNotesArr(filteredNotes);
    const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedAllNotes = allNotes.filter((note) => note.id !== idx);
    localStorage.setItem("notes", JSON.stringify(updatedAllNotes));
  };

  useEffect(() => {
    const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
    localStorage.setItem("notes", JSON.stringify(allNotes));
  }, [notesArr]);

  return (
    <>
      <div
       style={{
        backgroundImage: `url("src/components/bg.avif")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
      }}
      >
        <div>
          <nav className="navbar navbar-light justify-content-between">
            <div className="px-2">
              <Link to="/personal" className="btn btn-primary btn-lg me-2">
                Personal Notes
              </Link>
              <Link to="/work" className="btn btn-primary btn-lg me-2">
                Work Notes
              </Link>
              <Link to="/" className="btn btn-primary btn-lg">
              <i class="bi bi-house-fill"></i>
              </Link>
            </div>
            <div className="d-flex justify-content-right me-1">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn btn-primary btn-lg disabled my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </div>
          </nav>
        </div>
        <div className="p-3 text-center">
          <h1 className="mb-5">My Personal Notes</h1>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#editormodal"
              onClick={handleAdd}
            >
              <span className="pe-2">Add new Note</span>
              <i className="bi bi-journal-plus fs-3"></i>
            </button>
          </div>
        </div>

        <EditorModal onSave={handleSave} />
        <div className="container text-center mt-4">
          <Masonry
            breakpointCols={{ default: 3, 1500: 2, 900: 1 }}
            className="my-masonry-grid d-flex"
            columnClassName="my-masonry-grid_column"
          >
            {notesArr.map((note) => (
              <Card
                blocks={note.blocks}
                idx={note.id}
                key={note.id}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </Masonry>
        </div>
      </div>
    </>
  );
}

export default Personal;
