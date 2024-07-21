import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login page next app",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}