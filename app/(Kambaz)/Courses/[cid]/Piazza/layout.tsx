export default function PiazzaLayout({ children }: { children: React.ReactNode }) {
  return <div className="d-flex flex-column" style={{ height: "calc(100vh - 100px)" }}>{children}</div>;
}