import AccountNavigation from "./Navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex">
      <AccountNavigation />
      <div className="flex-grow-1" style={{ marginLeft: "200px" }}>
        {children}
      </div>
    </div>
  );
}