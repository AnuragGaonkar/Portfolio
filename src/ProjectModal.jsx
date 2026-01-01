import { useEffect, useState } from "react";

const ProjectModal = ({ project, action, onClose }) => {
  const [isImageFull, setIsImageFull] = useState(false);

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
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
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

        {/* ✅ ARCHITECTURE: Image + Description with Fullscreen Fix */}
        {action === "architecture" && (
          <div className="modal-section">
            {project.architectureImage && (
              <>
                <img
                  src={project.architectureImage}
                  alt={`${project.title} architecture`}
                  className="project-architecture-image"
                  style={{ cursor: 'pointer' }} // Visual hint that it's clickable
                  onClick={() => setIsImageFull(true)} // 🔁 open full screen
                />
                {isImageFull && (
                  <div 
                    className="image-fullscreen-backdrop" 
                    onClick={() => setIsImageFull(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        cursor: 'zoom-out'
                    }}
                  >
                    <img
                      src={project.architectureImage}
                      alt={`${project.title} architecture full view`}
                      className="image-fullscreen-content"
                      style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </>
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