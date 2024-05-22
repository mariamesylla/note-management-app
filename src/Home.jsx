import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import EditorModal from "./components/EditorModal";
import Card from "./components/Card";
import Masonry from "react-masonry-css";
import { EditorContext } from "./components/EditorContext";
import { nanoid } from "nanoid";

function Home() {
  const localNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const [notesArr, setNotesArr] = useState(localNotes);
  const updatedId = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    }
    if (data.blocks.length) {
      setNotesArr((prev) => [data, ...prev]);
      const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
      localStorage.setItem("notes", JSON.stringify([data, ...allNotes]));
    }
  };

  const handleEdit = (id) => {
    updatedId.current = id;
    const noteToEdit = notesArr.find((note) => note.id === id);
    editorInstanceRef.current.render({
      blocks: noteToEdit.blocks,
    });
  };

  const handleDelete = (id) => {
    const filteredNotes = notesArr.filter((note) => note.id !== id);
    setNotesArr(filteredNotes);
    const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedAllNotes = allNotes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(updatedAllNotes));
  };

  useEffect(() => {
    const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
    localStorage.setItem("notes", JSON.stringify(allNotes));
  }, [notesArr]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredNotes = notesArr.filter((note) =>
    note.blocks.some((block) => block.data.text?.toLowerCase().includes(searchQuery))
  );

  return (
    <div
      style={{
        backgroundImage: `url("src/components/bg.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
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
              <i className="bi bi-house-fill"></i>
            </Link>
          </div>
          <div className="d-flex justify-content-right me-1">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
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
        <h1 className="mb-5">Note Management App</h1>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-secondary d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#editormodal"
            onClick={handleAdd}
          >
            <span className="pe-1">Add new Note</span>
            <i className="bi bi-journal-plus fs-4"></i>
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
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              blocks={note.blocks}
              idx={note.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
}

export default Home;
