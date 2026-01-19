import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/portfolioData';
import { FaGithub, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/ProjectDetailPage.css';

const ProjectDetailPage = () => {
    const { id } = useParams();
    // Initialize with project data instead of null to prevent jitter
    const [project, setProject] = useState(() => {
        // Get project data synchronously on initial render
        return projects.find(p => p.id.toString() === id) || null;
    });
    // Only show loading state if project is truly not found (unlikely case)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // This effect now only runs if we need to update due to id change
        const projectData = projects.find(p => p.id.toString() === id);

        if (!projectData) {
            // Only show loading if we can't find the project
            setLoading(true);
        } else {
            setProject(projectData);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <main className="project-detail">
                <div className="container">
                    <div className="loading-spinner">Loading...</div>
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="project-detail">
                <div className="container not-found">
                    <h2 className="not-found-title">Project not found</h2>
                    <Link to="/projects" className="back-button">
                        <FaArrowLeft className="back-icon" /> Back to Projects
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="project-detail">
            <div className="container">
                <div className="navigation-bar">
                    <Link to="/projects" className="back-button">
                        <FaArrowLeft className="back-icon" /> Back to Projects
                    </Link>
                </div>

                <div className="project-header">
                    <h1 className="project-title">{project.title}</h1>
                    <p className="project-date"> </p>
                    <p className="project-description">{project.description}</p>

                    <div className="technologies-section">
                        <h3 className="technologies-title">Technologies Used</h3>
                        <div className="tech-tags">
                            {project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="project-actions">
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-button primary"
                            >
                                <FaExternalLinkAlt className="button-icon" />
                                Live Demo
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-button secondary"
                            >
                                <FaGithub className="button-icon" />
                                Source Code
                            </a>
                        )}
                    </div>
                </div>

                {project.details && project.details.length > 0 && (
                    <div className="project-section">
                        <ul className="project-details-list">
                            {project.details.map((detail, index) => (
                                <li key={index} className="project-detail-item">
                                    <span className="detail-bullet">▹</span>
                                    <span className="detail-text">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProjectDetailPage;