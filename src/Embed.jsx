import React from "react";

function Embed({ content }) {
  if (content.type === "image") {
    return <img src={content.src} alt={content.alt || "Embedded content"} style={{ width: "100%" }} />;
  }

  if (content.type === "youtube") {
    const videoId = content.src.split("v=")[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return null;
}

export default Embed;
