export default function Modules() {
  return (
    <div>
      <button>Collapse All</button>
      <button>View Progress</button>
      <select defaultValue="publish-all">
        <option value="publish-all">Publish All</option>
        <option value="publish-selected">Publish Selected</option>
        <option value="unpublish-all">Unpublish All</option>
      </select>
      <button>+ Module</button>
      
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 1 - Introduction</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to Web Development</li>
                <li className="wd-content-item">Creating an HTTP server with Node.js</li>
                <li className="wd-content-item">Creating a React Application</li>
              </ul>
            </li>
          </ul>
        </li>
        
        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 2 - Formatting User Interfaces with HTML</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learn how to create user interfaces with HTML</li>
                <li className="wd-content-item">Deploy the assignment to Netlify</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to HTML and the DOM</li>
                <li className="wd-content-item">Formatting Web content with Headings and Paragraphs</li>
                <li className="wd-content-item">Formatting content with Lists and Tables</li>
              </ul>
            </li>
          </ul>
        </li>
        
        <li className="wd-module">
          <div className="wd-title">Week 2 - Cascading Style Sheets</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learn the basics of Cascading Style Sheets</li>
                <li className="wd-content-item">Styling HTML user interfaces</li>
                <li className="wd-content-item">Introduction to responsive design</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 3 - Cascading Style Sheets</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 4 - Responsive Design</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Cascading Style Sheets - CSS</li>
                <li className="wd-content-item">Configuring CSS Rules and Selectors</li>
                <li className="wd-content-item">Styling Web content with Bootstrap</li>
                <li className="wd-content-item">Icons and colors</li>
              </ul>
            </li>
          </ul>
        </li>
        
        <li className="wd-module">
          <div className="wd-title">Week 3 - JavaScript and React</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learn JavaScript fundamentals</li>
                <li className="wd-content-item">Introduction to React components</li>
                <li className="wd-content-item">State management and props</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 5 - JavaScript</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 6 - React Components</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">JavaScript Variables, Functions and Control Flow</li>
                <li className="wd-content-item">Introduction to React</li>
                <li className="wd-content-item">Creating React Components</li>
                <li className="wd-content-item">Component Props and State</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">ASSIGNMENTS</span>
              <ul className="wd-content">
                <li className="wd-content-item">A1 - Environment Setup</li>
                <li className="wd-content-item">A2 - HTML</li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="wd-module">
          <div className="wd-title">Week 4 - Advanced React and Node.js</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Advanced React concepts and hooks</li>
                <li className="wd-content-item">Introduction to Node.js and Express</li>
                <li className="wd-content-item">Building RESTful APIs</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 7 - Node and NPM</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 8 - Express and RESTful APIs</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">React Hooks and Advanced Patterns</li>
                <li className="wd-content-item">Node.js and Server-side JavaScript</li>
                <li className="wd-content-item">Express Framework</li>
                <li className="wd-content-item">RESTful Web Services</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}