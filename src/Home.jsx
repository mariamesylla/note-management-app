import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditorModal from "./components/EditorModal";
import Card from "./components/Card";
import Masonry from "react-masonry-css";
import { EditorContext } from "./components/EditorContext";
import { nanoid } from "nanoid";

function Home() {
  const localNotes = JSON.parse(localStorage.getItem("notes"));
  const [notesArr, setNotesArr] = useState(localNotes ? localNotes : []);
  const updatedId = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to keep track of the search query

  const { editorInstanceRef } = useContext(EditorContext);
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleAdd = () => {
    updatedId.current = null;
    editorInstanceRef.current.clear();
  };

  const handleSave = async () => {
    const data = await editorInstanceRef.current.save();
    console.log(data);
    if (updatedId.current) {
      handleDelete(updatedId.current);
      data.id = updatedId.current;
      updatedId.current = null;
    } else {
      data.id = nanoid(10);
    }
    data.blocks.length && setNotesArr((prev) => [data, ...prev]);
  };

  const handleEdit = (idx) => {
    updatedId.current = idx;
    notesArr.map((note) => {
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
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notesArr));
  }, [notesArr]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handlePersonalNotesClick = () => {
    navigate("/personal");
  };

  const handleWorkNotesClick = () => {
    navigate("/work");
  };

  const filteredNotes = notesArr.filter(note =>
    note.blocks.some(block =>
      block.data.text.toLowerCase().includes(searchQuery)
    )
  );

  return (
    <div
      style={{
        backgroundImage: `url("src/components/bg.avif")`,
        width: "auto",
        height: "1500px",
      }}
    >
      <div>
        <nav className="navbar navbar-light justify-content-between">
          <div className="px-2">
            <button
              type="button"
              className="btn btn-primary btn-lg me-2"
              onClick={handlePersonalNotesClick}
            >
              Personal Notes
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleWorkNotesClick}
            >
              Work Notes
            </button>
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

      <div className="position-fixed bottom-0 end-0 m-4 z-2">
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
      <EditorModal onSave={handleSave} />
      <div className="container text-center mt-4">
        <Masonry
          breakpointCols={{ default: 3, 1500: 2, 900: 1 }}
          className="my-masonry-grid d-flex"
          columnClassName="my-masonry-grid_column"
        >
          {filteredNotes.map((note) => {
            return (
              <Card
                blocks={note.blocks}
                idx={note.id}
                key={note.id}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            );
          })}
        </Masonry>
      </div>
    </div>
  );
}

export default Home;
