"use client";
import ParticipantAccount from "@/components/shared/account/participant-account";
import { LogoType } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-row items-center border-b border-dashed justify-between px-6 py-3 sticky top-0 bg-background transition-all duration-300",
        isScrolled ? "border-border" : "border-transparent"
      )}
    >
      <LogoType href="/" />
      <div className="flex flex-row items-center gap-2">
        <ParticipantAccount />
      </div>
    </div>
  );
};

export default Navbar;
