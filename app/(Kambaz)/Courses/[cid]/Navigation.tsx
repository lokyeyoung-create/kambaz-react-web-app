// app/(Kambaz)/Courses/[cid]/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();
  
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link 
        href={`/Courses/${cid}/Home`} 
        id="wd-course-home-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Home') ? 'active' : 'text-danger'
        }`}
      >
        Home
      </Link>
      
      <Link 
        href={`/Courses/${cid}/Modules`} 
        id="wd-course-modules-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Modules') ? 'active' : 'text-danger'
        }`}
      >
        Modules
      </Link>
      
      <Link 
        href={`/Courses/${cid}/Piazza`} 
        id="wd-course-piazza-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Piazza') ? 'active' : 'text-danger'
        }`}
      >
        Piazza
      </Link>
      
      <Link 
        href={`/Courses/${cid}/Zoom`} 
        id="wd-course-zoom-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Zoom') ? 'active' : 'text-danger'
        }`}
      >
        Zoom
      </Link>
      
      <Link 
        href={`/Courses/${cid}/Assignments`} 
        id="wd-course-assignments-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Assignments') ? 'active' : 'text-danger'
        }`}
      >
        Assignments
      </Link>
      
      <Link 
        href={`/Courses/${cid}/Quizzes`} 
        id="wd-course-quizzes-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/Quizzes') ? 'active' : 'text-danger'
        }`}
      >
        Quizzes
      </Link>
      
      <Link 
        href={`/Courses/${cid}/People/Table`} 
        id="wd-course-people-link"
        className={`list-group-item border-0 ${
          pathname?.includes('/People/Table') ? 'active' : 'text-danger'
        }`}
      >
        People
      </Link>
    </div>
  );
}