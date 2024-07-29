"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { getRoleAndUserIdFromCookie } from "@/utils/roleFromCookie";
import { deleteCookie } from "@/actions/cookies";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await deleteCookie("authToken");
    setUsername(null);
    setUserRole(null);
    window.location.assign("/"); // Reload the page to update the navbar
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getRoleAndUserIdFromCookie();
      if (userData) {
        setUsername(userData.username);
        setUserRole(userData.role);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Define the menu items based on the user's role and login status
  const getNavLinks = () => {
    if (username) {
      if (userRole === 'Organizer') {
        return [
          { href: '/', key: 'home', label: 'Home' },
          { href: '/event', key: 'event', label: 'Events' },
          { href: '/management', key: 'management', label: 'Managements' },
          { href: '/', key: 'logout', label: 'Logout', onClick: handleLogout },
        ];
      } else if (userRole === 'Customer') {
        return [
          { href: '/', key: 'home', label: 'Home' },
          { href: '/event', key: 'event', label: 'Events' },
          { href: '/transaction', key: 'transaction', label: 'Transactions' },
          { href: '/ticket', key: 'ticket', label: 'Tickets' },
          { href: '/', key: 'logout', label: 'Logout', onClick: handleLogout },
        ];
      }
    }
    return [
      { href: '/', key: 'home', label: 'Home' },
      { href: '/event', key: 'event', label: 'Events' },
      { href: '/transaction', key: 'transaction', label: 'Transactions' },
      { href: '/ticket', key: 'ticket', label: 'Tickets' },
    ];
  };

  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/">
        <Image src="/hilink-logo.svg" alt="logo" width={74} height={29} />
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {getNavLinks().map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
            onClick={link.onClick} // Handle onClick for Logout link
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flexCenter hidden">
        {username ? (
          <Button 
            type="button"
            title={username}
            icon="/user.svg"
            variant="btn_dark_green"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : (
          <Link href="/login">
            <Button 
              type="button"
              title="Login"
              icon="/user.svg"
              variant="btn_dark_green"
              onClick={() => setIsMenuOpen(false)}
            />
          </Link>
        )}
      </div>

      <Image 
        src="/menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
        onClick={toggleMenu}
      />

      <div 
        ref={menuRef} 
        className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg z-40 p-5 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <ul className="flex flex-col items-start gap-5 mt-10">
          {getNavLinks().map((link) => (
            <Link 
              href={link.href} 
              key={link.key} 
              className="regular-16 text-gray-900 cursor-pointer pb-1.5 transition-all hover:font-bold"
              onClick={() => {
                if (link.onClick) link.onClick(); // Handle onClick for Logout link
                setIsMenuOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-10">
            {username ? (
              <Button 
                type="button"
                title={username}
                icon="/user.svg"
                variant="btn_dark_green"
                onClick={() => setIsMenuOpen(false)}
              />
            ) : (
              <Link href="/login">
                <Button 
                  type="button"
                  title="Login"
                  icon="/user.svg"
                  variant="btn_dark_green"
                  onClick={() => setIsMenuOpen(false)}
                />
              </Link>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}