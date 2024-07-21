import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Page",
  description: "Register page next app",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}