import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default async function CoursesLayout({ children, params }: LayoutProps) {
  const { cid } = await params;

  return <div>{children}</div>;
}
