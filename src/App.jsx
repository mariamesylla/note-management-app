import EditorModal from "./components/EditorModal";
import Card from "./components/Card";
import Masonry from "react-masonry-css";
import { useContext, useEffect, useState, useRef } from "react";
import { EditorContext } from "./components/EditorContext";
import { nanoid } from "nanoid";
function App() {
  const localNotes = JSON.parse(localStorage.getItem("notes"));
  const [notesArr, setNotesArr] = useState(localNotes ? localNotes : []);
  const updatedId = useRef(null);

  const { editorInstanceRef } = useContext(EditorContext);

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

  return (
    <>
      <div 
        style={{
          backgroundImage: `url("src/components/bg.avif")`,
          width: "auto",
          height: "1500px",
        }}>
          
        <div className="p-3 text-center ">

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
        <div className="container text-center mt-4 ">
          <Masonry
            breakpointCols={{ default: 3, 1500: 2, 900: 1 }}
            className="my-masonry-grid d-flex"
            columnClassName="my-masonry-grid_column"
          >
            {notesArr.map((note) => {
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
    </>
  );
}

export default App;
