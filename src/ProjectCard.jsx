import { useState } from "react";

const STATUS_META = {
  live: { label: "LIVE SYSTEM", color: "#c9a56a" },
  published: { label: "PUBLISHED", color: "#9fd3c7" },
  forging: { label: "IN DEVELOPMENT", color: "#e07a5f" },
  demo: { label: "CONTROLLED DEMO", color: "#7bb4a5" },
  desktop: { label: "DESKTOP SYSTEM", color: "#a8b3b0" }
};

const ProjectCard = ({ project, onOpen }) => {
  const meta = STATUS_META[project.status];

  const handleActionClick = (action) => {
    // 🚀 LIVE URL HANDLING - Open in new tab
    if (action === 'live' && project.liveUrl) {
      window.open(project.liveUrl, '_blank');
      return;
    }
    // All other actions → Open modal
    onOpen(project, action);
  };

  return (
    <article className="project-card project-card-enhanced">
      <div
        className="project-status"
        style={{ borderColor: meta.color, color: meta.color }}
      >
        {meta.label}
      </div>

      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <div className="project-actions">
        {project.actions.map(action => (
          <button
            key={action}
            className="btn ghost-btn project-btn"
            onClick={() => handleActionClick(action)}
          >
            {project.actionLabels[action]}
          </button>
        ))}
      </div>
    </article>
  );
};

export default ProjectCard;
