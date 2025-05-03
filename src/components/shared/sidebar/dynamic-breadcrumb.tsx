"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folders } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import React from "react";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbSegments = useMemo(() => {
    // Skip empty segments and remove trailing slashes
    const segments = pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index, array) => {
        // Create the href by joining all segments up to the current one
        const href = "/" + array.slice(0, index + 1).join("/");

        // Format the label to be more readable (capitalize, replace hyphens with spaces)
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return { label, href };
      });

    // No longer adding Home as the first segment
    return segments;
  }, [pathname]);

  // Determine if we need to use the dropdown (more than 4 segments)
  const needsDropdown = breadcrumbSegments.length > 4;

  // If we need a dropdown, we'll show: First > [Dropdown] > Second-to-last > Current
  // Otherwise, show all segments
  const visibleSegments = needsDropdown
    ? [
        breadcrumbSegments[0], // First segment
        ...breadcrumbSegments.slice(-2), // Last two segments
      ]
    : breadcrumbSegments;

  // Middle segments to be shown in dropdown
  const dropdownSegments = needsDropdown ? breadcrumbSegments.slice(1, -2) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visibleSegments.map((segment, index) => {
          const isLast = index === visibleSegments.length - 1;
          const isDropdownPosition = needsDropdown && index === 1;

          return (
            <React.Fragment key={segment.href}>
              {index > 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem>
                {isDropdownPosition ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:text-foreground">
                      <span
                        role="presentation"
                        aria-hidden="true"
                        className="flex size-5 items-center justify-center"
                      >
                        <Folders size={16} />
                      </span>
                      <span className="sr-only">More breadcrumb items</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {dropdownSegments.map((dropdownSegment) => (
                        <DropdownMenuItem key={dropdownSegment.href} asChild>
                          <Link href={dropdownSegment.href}>
                            {dropdownSegment.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isLast ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segment.href}>
                    {segment.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
