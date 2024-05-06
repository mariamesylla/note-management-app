import Content from "./Content";

function ContentModal({blocks, idx, onEdit}) {
  return (  
    <div className="modal fade modal-xl" id={"note" + idx} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={"note" + idx + "Label"} aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-xl-down">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={"note" + idx + "Label"}>Notes</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {blocks.map(block => {
              return <Content block={block} key={block.id} />
            })}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              <span className="pe-2">Close</span>
              <i className="bi bi-fullscreen-exit"></i>
            </button>
            <button type="button" className="btn btn-primary" data-bs-target="#editormodal" data-bs-toggle="modal">
              <span className="pe-2" onClick={() => onEdit(idx)}>Edit</span>
              <i className="bi bi-pencil"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentModal;