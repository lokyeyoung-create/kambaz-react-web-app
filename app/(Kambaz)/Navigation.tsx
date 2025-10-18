"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { AiFillHome } from "react-icons/ai";
import { IoCalendar } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";

export default function KambazNavigation() {
  const pathname = usePathname();

  const links = [
    {
      id: "account",
      label: "Account",
      path: "/Account",
      icon: FaRegCircleUser,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/Dashboard",
      icon: AiFillHome,
    },
    { id: "courses", label: "Courses", path: "/Dashboard", icon: LiaBookSolid },
    { id: "calendar", label: "Calendar", path: "/Calendar", icon: IoCalendar },
    { id: "inbox", label: "Inbox", path: "/Inbox", icon: FaInbox },
    { id: "labs", label: "Labs", path: "/Labs", icon: LiaCogSolid },
  ];

  return (
    <div 
      id="wd-kambaz-navigation" 
      className="bg-black"
      style={{ 
        width: 120, 
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        zIndex: 1000
      }}
    >
      <ListGroup className="bg-black">
        <ListGroupItem
          as={Link}
          href="https://www.northeastern.edu/"
          className="bg-black text-center border-0 py-3"
        >
          <img src="/images/NEU.svg" width="60px" height="60px" alt="Northeastern" />
        </ListGroupItem>

        {links.map((link) => (
          <ListGroupItem
            key={link.id}
            as={Link}
            href={link.path}
            className={`text-center border-0 py-3
              ${
                pathname.includes(link.label)
                  ? "text-danger bg-white"
                  : "text-white bg-black"
              }`}
          >
            {link.icon({ className: "fs-1 text-danger" })}
            <br />
            <span className="small">{link.label}</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}