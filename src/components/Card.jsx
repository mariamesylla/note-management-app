import React from "react";
import ContentModal from "./ContentModal";
import Content from "./Content";

function Card({ blocks, idx, onDelete, onEdit }) {
  return (
    <div className="mx-2 mb-3">
      <div className="card">
        <div className="ms-auto z-2">
          <button className="btn btn-sm btn-outline-danger d-flex align-items-center mt-2 me-3" onClick={() => onDelete(idx)}>
            <span className="pe-1">Delete</span>
            <i className="bi bi-trash3 fs-6"></i>
          </button>
        </div>
        <div className="card-body">
          {blocks.map((block) => (
            <Content block={block} key={block.id} />
          ))}
          <a type="button" className="stretched-link" data-bs-toggle="modal" data-bs-target={"#note" + idx}></a>
        </div>
      </div>
      <ContentModal blocks={blocks} idx={idx} onEdit={onEdit} />
    </div>
  );
}

export default Card;
