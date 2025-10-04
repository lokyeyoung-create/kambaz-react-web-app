"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';

export default function KambazNavigation() {
  const pathname = usePathname();

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroupItem
        className="bg-black border-0 text-center py-3"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <Image
          src="/images/NEU.svg"
          width={75}
          height={75}
          alt="Northeastern University"
        />
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname === "/Account" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Account"
          id="wd-account-link"
          className="text-decoration-none d-block"
        >
          <FaRegCircleUser
            className={`fs-1 ${
              pathname === "/Account" ? "text-danger" : "text-white"
            }`}
          />
          <br />
          <span
            className={pathname === "/Account" ? "text-danger" : "text-white"}
          >
            Account
          </span>
        </Link>
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname === "/Dashboard" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Dashboard"
          id="wd-dashboard-link"
          className="text-decoration-none d-block"
        >
          <AiOutlineDashboard className="fs-1 text-danger" />
          <br />
          <span
            className={pathname === "/Dashboard" ? "text-danger" : "text-white"}
          >
            Dashboard
          </span>
        </Link>
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname?.startsWith("/Courses/1234/Home") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Courses/1234/Home"
          id="wd-course-link"
          className="text-decoration-none d-block"
        >
          <LiaBookSolid className="fs-1 text-danger" />
          <br />
          <span
            className={
              pathname?.startsWith("/Courses/1234/Home")
                ? "text-danger"
                : "text-white"
            }
          >
            Courses
          </span>
        </Link>
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname === "/Calendar" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Calendar"
          id="wd-calendar-link"
          className="text-decoration-none d-block"
        >
          <IoCalendarOutline className="fs-1 text-danger" />
          <br />
          <span
            className={pathname === "/Calendar" ? "text-danger" : "text-white"}
          >
            Calendar
          </span>
        </Link>
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname === "/Inbox" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Inbox"
          id="wd-inbox-link"
          className="text-decoration-none d-block"
        >
          <FaInbox className="fs-1 text-danger" />
          <br />
          <span
            className={pathname === "/Inbox" ? "text-danger" : "text-white"}
          >
            Inbox
          </span>
        </Link>
      </ListGroupItem>

      <ListGroupItem
        className={`border-0 text-center py-3 ${
          pathname === "/Labs" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Labs"
          id="wd-labs-link"
          className="text-decoration-none d-block"
        >
          <LiaCogSolid className="fs-1 text-danger" />
          <br />
          <span className={pathname === "/Labs" ? "text-danger" : "text-white"}>
            Labs
          </span>
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
