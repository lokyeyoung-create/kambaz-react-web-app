import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/file.svg" width={15} height={15} alt="React" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/globe.svg" width={15} height={15} alt="Node.js" />
            <div>
              <h5>CS5678 Node.js</h5>
              <p className="wd-dashboard-course-title">
                Backend Development with Node.js
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/file.svg" width={15} height={15} alt="MongoDB" />
            <div>
              <h5>CS9101 MongoDB</h5>
              <p className="wd-dashboard-course-title">NoSQL Database Design</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/window.svg" width={15} height={15} alt="Python" />
            <div>
              <h5>CS1121 Python</h5>
              <p className="wd-dashboard-course-title">
                Data Science with Python
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/globe.svg" width={15} height={15} alt="JavaScript" />
            <div>
              <h5>CS3141 JavaScript</h5>
              <p className="wd-dashboard-course-title">
                Modern JavaScript Development
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/globe.svg" width={15} height={15} alt="CSS" />
            <div>
              <h5>CS5161 CSS</h5>
              <p className="wd-dashboard-course-title">
                Advanced CSS and Responsive Design
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/globe.svg" width={15} height={15} alt="HTML" />
            <div>
              <h5>CS7181 HTML</h5>
              <p className="wd-dashboard-course-title">
                Web Foundations and Semantic HTML
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/globe.svg" width={15} height={15} alt="TypeScript" />
            <div>
              <h5>CS9202 TypeScript</h5>
              <p className="wd-dashboard-course-title">
                Type-Safe JavaScript Development
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
