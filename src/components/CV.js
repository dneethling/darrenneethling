import React from 'react';
import { FaBriefcase, FaGraduationCap, FaTools, FaCertificate, FaLanguage, FaUsers, FaUser } from 'react-icons/fa';
import CVData from './cvData';
import '../styles/CV.css';
import ExportButton from './ExportButton';

const CV = () => {
  return (
    <div className="cv-container" id="cv-container">
      <header className="cv-header">
        <img src={`${process.env.PUBLIC_URL}${CVData.photo}`} alt={CVData.name} className="cv-photo" />
        <h1 className="cv-name">{CVData.name}</h1>
        <p className="cv-title">{CVData.title}</p>
        <div className="cv-contact">
          <p>
            <a href={`mailto:${CVData.contact.email}`} className="cv-contact-link">
              {CVData.contact.email}
            </a>
            &nbsp;|&nbsp;
            <a href={`tel:${CVData.contact.phone.replace(/[^+\d]/g, '')}`} className="cv-contact-link">
              {CVData.contact.phone}
            </a>
          </p>
          <p>
            {CVData.contact.location} |
            <a href={CVData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              &nbsp;LinkedIn
            </a>
          </p>
          <p>
            <a href="https://open.spotify.com/show/7F5GOZFAHXF93VZbqV6Bzg?si=46d50eed65ee4b20&nd=1&dlsi=ca4863bee51a46a3" target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              | The Learning Curve Podcast |
            </a>
          </p>
        </div>
      </header>

      <main className="cv-main">
        <section className="cv-section">
          <h2><FaUser className="cv-icon" /> Profile</h2>
          <div className="cv-profile">
            <h3>Summary</h3>
            <p>{CVData.profile.summary}</p>
            <h3>My Journey</h3>
            <p>{CVData.profile.professional_experience}</p>
          </div>
        </section>

        <section className="cv-section">
          <h2><FaBriefcase className="cv-icon" /> Professional Experience</h2>
          <div className="cv-experience">
            {CVData.experience.map((job, index) => (
              <div key={index} className="cv-experience-item">
                <h3 className="cv-experience-title">{job.title}</h3>
                <p className="cv-experience-company">{job.company}</p>
                <p className="cv-experience-period">{job.period}</p>
                <ul className="cv-experience-responsibilities">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2><FaTools className="cv-icon" /> Skills</h2>
          <div className="cv-skills">
            {CVData.skills.map((skill, index) => (
              <span key={index} className="cv-skill">{skill}</span>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2><FaGraduationCap className="cv-icon" /> Education</h2>
          <div className="cv-education">
            {CVData.education.map((edu, index) => (
              <div key={index} className="cv-education-item">
                <h3 className="cv-education-degree">{edu.degree}</h3>
                <p className="cv-education-institution">{edu.institution}</p>
                <p className="cv-education-year">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2><FaCertificate className="cv-icon" /> Certifications</h2>
          <div className="cv-certifications">
            <ul>
              {CVData.certifications.map((certification, index) => (
                <li key={index} className="cv-certification-item">{certification}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cv-section">
          <h2><FaLanguage className="cv-icon" /> Languages</h2>
          <div className="cv-languages">
            <ul>
              {CVData.languages.map((language, index) => (
                <li key={index} className="cv-language-item">
                  <strong>{language.language}:</strong> {language.proficiency}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cv-section">
          <h2><FaUsers className="cv-icon" /> Professional Affiliations</h2>
          <div className="cv-affiliations">
            {CVData.affiliations.map((affil, index) => (
              <div key={index} className="cv-affiliation">
                <img src={`${process.env.PUBLIC_URL}${affil.icon}`} alt={`${affil.organization} logo`} className="cv-affiliation-icon" />
                <div className="cv-affiliation-details">
                  <h3 className="cv-affiliation-role">{affil.role}</h3>
                  <p className="cv-affiliation-organization">{affil.organization}</p>
                  <p className="cv-affiliation-period">{affil.period}</p>
                  <p className="cv-affiliation-url">
                    <a href={affil.url} target="_blank" rel="noopener noreferrer">
                      Click here for more information
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="cv-footer">
        <ExportButton />
      </footer>
    </div>
  );
};

export default CV;