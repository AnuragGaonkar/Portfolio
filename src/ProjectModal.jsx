import { useEffect, useState } from "react";

const ProjectModal = ({ project, action, onClose }) => {
  const [isImageFull, setIsImageFull] = useState(false);

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  // Logic to determine which video to play based on device
  const videoSrc = isMobile
    ? project.demo?.mobileVideo
    : project.demo?.desktopVideo;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h3 className="modal-title">{project.title}</h3>

        {/* ✅ VIDEO SECTION */}
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

        {/* ✅ DYNAMIC IMAGE SECTION (Architecture, Algorithm, or Paper) */}
        {(action === "architecture" || action === "algorithm" || action === "paper") && (
          <div className="modal-section">
            {project.architectureImage && (
              <>
                <img
                  src={project.architectureImage}
                  alt={`${project.title} visualization`}
                  className="project-architecture-image"
                  style={{ cursor: 'zoom-in', width: '100%', borderRadius: '8px', marginBottom: '15px' }}
                  onClick={() => setIsImageFull(true)}
                />
                
                {/* Fullscreen Overlay */}
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
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        cursor: 'zoom-out'
                    }}
                  >
                    <img
                      src={project.architectureImage}
                      alt={`${project.title} full view`}
                      className="image-fullscreen-content"
                      style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </>
            )}
            
            {/* Conditional Text Rendering based on Action */}
            {action === "architecture" && project.architecture && <p>{project.architecture}</p>}
            {action === "algorithm" && project.algorithmInfo && <p>{project.algorithmInfo}</p>}
            {action === "paper" && project.paperInfo && <p>{project.paperInfo}</p>}
          </div>
        )}

        {/* ✅ PROGRESS SECTION */}
        {action === "progress" && (
          <div className="modal-section">
            <ul className="cert-list">
              {project.progress.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;