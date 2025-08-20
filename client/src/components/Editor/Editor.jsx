import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import "./editor.css";

Quill.register(Quill.import("attributors/style/direction"), true);

const Editor = ({ value, onChange }) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ direction: "rtl" }, { direction: "ltr" }],
        ["link"],
        ["clean"],
      ],
    },
  };

  return (
    <div className="rounded-lg overflow-hidden border border-light-gray focus-within:border-accent-orange focus-within:ring-2 focus-within:ring-accent-orange/40 transition-all">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Write your content here..."
        className="bg-white border-none"
      />
    </div>
  );
};

export default Editor;
