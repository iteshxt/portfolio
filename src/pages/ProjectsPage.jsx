import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/portfolioData';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/ProjectsPage.css';

const ProjectsPage = () => {
    return (
        <main className="projects-main">
            {/* Simple Header Section */}
            <section className="projects-header">
                <div className="projects-container">
                    <h1 className="section-title">Projects</h1>
                    <p className="section-subtitle">
                        A collection of my work across Machine Learning, Web Development and more.
                    </p>
                </div>
            </section>            {/* Projects Grid Section */}
            <section className="projects-showcase">
                <div className="projects-container">
                    <div className="projects-grid">
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="project-card-modern"
                            >
                                <div className="project-content">
                                    <div className="project-header">
                                        <h3 className="project-title">{project.title}</h3>
                                    </div>

                                    <p className="project-description">
                                        {project.description}
                                    </p>

                                    <div className="tech-stack">
                                        <div className="tech-tags-modern">
                                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                                <span key={techIndex} className="tech-tag-modern">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="tech-tag-modern more">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="project-actions">
                                        {project.demo && (
                                            <a
                                                href={project.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action-button primary"
                                                onClick={(e) => e.stopPropagation()}
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
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaGithub className="button-icon" />
                                                Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProjectsPage;