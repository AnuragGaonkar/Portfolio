import { useEffect } from "react";

const ProjectModal = ({ project, action, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const videoSrc = isMobile
    ? project.demo?.desktopVideo
    : project.demo?.mobileVideo;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h3 className="modal-title">{project.title}</h3>

        {/* ✅ VIDEO */}
        {action === "demo" && project.demo?.enabled && (
          <video
            src={videoSrc}
            controls
            autoPlay
            muted
            playsInline
            className="project-video"
          />
        )}

        {/* ✅ ARCHITECTURE: Image + Description */}
        {action === "architecture" && (
          <div className="modal-section">
            {project.architectureImage && (
              <img 
                src={project.architectureImage} 
                alt={`${project.title} Architecture`}
                className="architecture-img"
              />
            )}
            {project.architecture && <p>{project.architecture}</p>}
          </div>
        )}

        {/* ✅ PROGRESS */}
        {action === "progress" && (
          <div className="modal-section">
            <ul>
              {project.progress.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ PAPER */}
        {action === "paper" && (
          <div className="modal-section">
            <p>{project.paperInfo}</p>
          </div>
        )}

        {/* ✅ ALGORITHM */}
        {action === "algorithm" && (
          <div className="modal-section">
            <p>{project.algorithmInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
