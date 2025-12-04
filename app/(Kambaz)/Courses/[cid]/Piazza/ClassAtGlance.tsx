"use client";
import { FaCheckCircle } from "react-icons/fa";

export default function ClassAtGlance({ stats }: { stats: { totalPosts: number; unansweredQuestions: number; instructorResponses: number; studentResponses: number } }) {
  return (
    <div className="p-4">
      <h2 className="mb-4">
        <FaCheckCircle className="text-success me-2" />
        Class at a Glance
      </h2>

      <div className="row">
        <div className="col-md-6">
          <ul className="list-unstyled">
            <li className="mb-2">
              <FaCheckCircle className="text-success me-2" />
              {stats.unansweredQuestions === 0 ? "no unanswered questions" : `${stats.unansweredQuestions} unanswered questions`}
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="text-end pe-3">{stats.totalPosts}</td>
                <td>total posts</td>
              </tr>
              <tr>
                <td className="text-end pe-3">{stats.instructorResponses}</td>
                <td>instructors' responses</td>
              </tr>
              <tr>
                <td className="text-end pe-3">{stats.studentResponses}</td>
                <td>students' responses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}