import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
export default function TOC() {
  return (
    <Nav variant="pills">
      <NavItem>
        <NavLink href="/Labs" as={Link}>
          Labs
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/Labs/Lab1" as={Link}>
          Lab 1
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/Labs/Lab2" as={Link}>
          Lab 2
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/Labs/Lab3" as={Link}>
          Lab 3
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/" as={Link}>
          Kambaz
        </NavLink>
      </NavItem>
      <a
        id="wd-github"
        href="https://github.com/lokyeyoung-create/kambaz-react-web-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub Repository
      </a>
    </Nav>
  );
}
