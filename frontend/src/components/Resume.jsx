import React from "react";

const Resume = () => (
  <div className="container py-5">
    <h1>My Resume</h1>
    <iframe
      src="http://localhost:8080/api/uploads/resume.pdf"
      width="100%"
      height="800px"
      title="Resume"
      style={{ border: "none" }}
    />
  </div>
);

export default Resume;
