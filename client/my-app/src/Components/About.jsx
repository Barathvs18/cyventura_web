import React from 'react';
import './About.css';
import { div } from 'three/src/nodes/math/OperatorNode.js';

const features = [
  {
    title: 'CYVENTURA ASIA',
    subtitle: 'Apr. 28-30, 2026 at the Innovation Center',
    links: ['GET TICKETS!', 'GET TRAINING!', 'Website, Open Calls and News!'],
    content: null,
    watermark: null
  },
  {
    title: 'START HERE.',
    subtitle: 'New to Cyventura? Find out what it\'s all about!',
    content: 'Cyventura has been a part of the hacker community for over three decades. Pick up a bit of history and origin by watching Cyventura - The Documentary, and by checking out the About Page. The Cyventura FAQ has the answers to most of the common questions you might have.',
    watermark: 'skull'
  },
  {
    title: 'GET EDUCATED.',
    subtitle: 'A treasure trove of hacking knowledge awaits in our past media!',
    content: 'Cyventura Media Server. Speeches, music, art, and more!\n\nInfocon, the hacking con archive! Con video, podcasts, rainbow tables, and more!',
    watermark: 'media'
  },
  {
    title: 'GET INVOLVED.',
    subtitle: 'Want to participate? There are a myriad of ways!',
    content: 'Cyventura is what you make it. If you\'d like to do more than just attend, have a look at our Get Involved page for ideas!\n\nYear round, consider joining a local Cyventura Group, or get active on the Cyventura Forums!',
    watermark: 'dial'
  }
];

export const AboutFeatures = () => {
  return (
    <div className="about-container">
    <hr
  style={{
    width: "100%",
    height: "2px",
    backgroundColor: "#f8f3f3ff",
    border: "none",
    marginBottom: "30px",
    opacity:"0.1"
  }}
/>
      <div className="dossier-header text-center">
    <span className="dossier-eyebrow">C L U B &nbsp; O V E R V I E W</span>
    <h2 className="dossier-main-title">About Our <span className="text-red">Organization </span></h2>
</div>
      {/* Top 4-panel row */}
      <div className="defcon-row">
        {features.map((item, index) => (
          <div key={index} className="defcon-box">
             <div className="defcon-inner">
                 <h3 className="defcon-title">{item.title}</h3>
                 <p className="defcon-subtitle">{item.subtitle}</p>
                 {item.links && (
                   <div className="defcon-links">
                        {item.links.map((link, i) => <a key={i} href="#">{link}</a>)}
                     </div>
                 )}
                 {item.content && (
                     <div className="defcon-content">
                         {item.content.split('\n\n').map((paragraph, i) => (
                           <p key={i}>{paragraph}</p>
                         ))}
                     </div>
                 )}
             </div>
          </div>
        ))}
      </div>

      {/* Main 3-column layout section */}
      <div className="defcon-main-grid">
        
        {/* Left Column */}
        <div className="defcon-col-left">
          <div className="defcon-widget">
            <h4 className="widget-title">Future Dates</h4>
            <div className="widget-item">
              <strong>Cyventura Singapore</strong>
              <p>Apr. 28-30, 2026</p>
              <p>Training April 26-27, 2026</p>
            </div>
            <div className="widget-item">
              <strong>Cyventura 34</strong>
              <p>Aug. 6-9, 2026</p>
              <a href="#">Open Calls & Accepted Content</a>
              <br/><a href="#">BUY A TICKET!</a>
            </div>
            <div className="widget-item borderless">
              <strong>Cyventura Middle East</strong>
              <p>Nov. 11-12, 2026</p>
              <p>Training Nov. 8-10, 2026</p>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="defcon-col-center">
          <div className="defcon-post">
            <h2 className="post-title">Cyventura Training Las Vegas Course Lineup is Live!</h2>
            <div className="post-meta">Posted 2026-04-04</div>
            <div className="post-body">
               <p>Cyventura Training 2026 Course Lineup is now live!</p>
               <p>We're thrilled to share the full slate of courses for Cyventura Training in Las Vegas! Join us in August for hands-on courses led by top practitioners from across the community.</p>
               <p>For the first time ever, we will offer 1-day, 2-day, and 4-day classes! Whatever your needs, whether you're sharpening fundamentals or diving deep into advanced techniques, there's something here for you!</p>
               <p>Explore the full lineup and course details here: <a href="#">https://training.cyventura.org/</a></p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="defcon-col-right">
          <div className="defcon-widget paddingless">
            <h4 className="widget-title text-center">Coming Up</h4>
            
            <div className="agenda-item">
              <div className="agenda-date">
                 <div className="agenda-day">28</div>
                 <div className="agenda-month">APR</div>
              </div>
              <div className="agenda-info">
                 <a href="#">CYVENTURA SINGAPORE!</a>
                 <p>4.28.26 &rarr; 4.30.26</p>
              </div>
            </div>

            <div className="agenda-item">
              <div className="agenda-date">
                 <div className="agenda-day">22</div>
                 <div className="agenda-month">MAY</div>
              </div>
              <div className="agenda-info">
                 <a href="#">Cyventura 34 Early Bird Pricing Ends</a>
                 <p>5.22.26 (All Day)</p>
              </div>
            </div>

            <div className="agenda-item borderless">
              <div className="agenda-date">
                 <div className="agenda-day">22</div>
                 <div className="agenda-month" style={{background: '#c04be2'}}>MAY</div>
              </div>
              <div className="agenda-info">
                 <a href="#">Cyventura 34 CTF Qualifiers - Welcome Benevolent Bureau of Birds!</a>
                 <p>5.22.26 &rarr; 5.24.26</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};


export default AboutFeatures;