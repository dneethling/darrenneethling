import React from 'react';
import { FaBriefcase, FaGraduationCap, FaTools, FaCertificate, FaLanguage, FaUsers, FaUser, FaRocket, FaProjectDiagram, FaEnvelope, FaLinkedin, FaPodcast } from 'react-icons/fa';
import CVData from './cvData';
import '../styles/CV.css';
import ExportButton from './ExportButton';

const SectionHeading = ({ icon, children }) => (
  <h2 className="section-heading">
    <span className="section-icon">{icon}</span>
    {children}
  </h2>
);

const CV = () => {
  return (
    <div className="site-shell" id="cv-container">
      <header className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Technology leadership · AI systems · automation</p>
            <h1>{CVData.name}</h1>
            <p className="hero-title">{CVData.title}</p>
            <p className="hero-tagline">{CVData.tagline}</p>

            <div className="hero-actions">
              <a href={`mailto:${CVData.contact.email}`} className="button primary-button">
                <FaEnvelope /> Work with me
              </a>
              <a href={CVData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="button secondary-button">
                <FaLinkedin /> LinkedIn
              </a>
              <ExportButton />
            </div>

            <div className="contact-line">
              <span>{CVData.contact.location}</span>
              <span>{CVData.contact.email}</span>
            </div>
          </div>

          <div className="hero-card">
            <img src={`${process.env.PUBLIC_URL}${CVData.photo}`} alt={CVData.name} className="cv-photo" />
            <div className="stat-grid">
              {CVData.heroStats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="cv-main">
        <section className="cv-section intro-section">
          <SectionHeading icon={<FaUser />}>Profile</SectionHeading>
          <div className="profile-grid">
            <div className="profile-card highlight-card">
              <h3>Summary</h3>
              <p>{CVData.profile.summary}</p>
            </div>
            <div className="profile-card">
              <h3>Current direction</h3>
              <p>{CVData.profile.positioning}</p>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <SectionHeading icon={<FaRocket />}>What I Do</SectionHeading>
          <div className="value-grid">
            {CVData.valueProps.map((item, index) => (
              <article className="value-card" key={index}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <SectionHeading icon={<FaProjectDiagram />}>Selected Projects</SectionHeading>
          <div className="project-grid">
            {CVData.projects.map((project, index) => (
              <article className="project-card" key={index}>
                <p className="project-type">{project.type}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <SectionHeading icon={<FaBriefcase />}>Experience</SectionHeading>
          <div className="timeline">
            {CVData.experience.map((job, index) => (
              <article key={index} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p className="period">{job.period}</p>
                  <ul>
                    {job.responsibilities.map((responsibility, idx) => (
                      <li key={idx}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <SectionHeading icon={<FaTools />}>Skills</SectionHeading>
          <div className="cv-skills">
            {CVData.skills.map((skill, index) => (
              <span key={index} className="cv-skill">{skill}</span>
            ))}
          </div>
        </section>

        <section className="cv-section two-column-section">
          <div>
            <SectionHeading icon={<FaGraduationCap />}>Education</SectionHeading>
            <div className="compact-list">
              {CVData.education.map((edu, index) => (
                <article key={index}>
                  <h3>{edu.degree}</h3>
                  <p>{edu.institution} · {edu.year}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading icon={<FaCertificate />}>Certifications</SectionHeading>
            <div className="cv-skills compact-skills">
              {CVData.certifications.map((certification, index) => (
                <span key={index} className="cv-skill">{certification}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="cv-section two-column-section">
          <div>
            <SectionHeading icon={<FaLanguage />}>Languages</SectionHeading>
            <div className="compact-list">
              {CVData.languages.map((language, index) => (
                <article key={index}>
                  <h3>{language.language}</h3>
                  <p>{language.proficiency}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading icon={<FaUsers />}>Affiliations</SectionHeading>
            <div className="affiliation-list">
              {CVData.affiliations.map((affil, index) => (
                <article key={index} className="affiliation-card">
                  <img src={`${process.env.PUBLIC_URL}${affil.icon}`} alt={`${affil.organization} logo`} />
                  <div>
                    <h3>{affil.role}</h3>
                    <p>{affil.organization}</p>
                    <a href={affil.url} target="_blank" rel="noopener noreferrer">More information</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Let’s build practical AI, automation and technology systems that actually move the work forward.</p>
        <div className="footer-links">
          <a href={`mailto:${CVData.contact.email}`}><FaEnvelope /> Email</a>
          <a href={CVData.contact.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
          <a href={CVData.contact.podcast} target="_blank" rel="noopener noreferrer"><FaPodcast /> Podcast</a>
        </div>
      </footer>
    </div>
  );
};

export default CV;
