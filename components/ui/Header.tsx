"use client";

import React from "react";
import Dropdown from "./Dropdown";

interface HeaderProps {
  title: string;
  role?: string;
  options?: { label: string; value: string }[];
  onDepartmentChange?: (value: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  actions?: React.ReactNode;
  hideSearchForRoles?: string[];
}

export default function Header({
  title,
  role,
  options = [],
  onDepartmentChange,
  search,
  onSearchChange,
  actions,
  hideSearchForRoles = ["Accountant", "Employee"],
}: Readonly<HeaderProps>) {
  const showSearch = onSearchChange && !(role && hideSearchForRoles.includes(role));

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md px-3 py-5 sm:px-6 lg:px-8">

      <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            {title}
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          {showSearch && (
            <div className="relative w-full sm:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {options.length > 0 && onDepartmentChange && (
              <Dropdown
                value={role || ""}
                options={options}
                onChange={onDepartmentChange}
                className="flex-1 sm:flex-initial"
              />
            )}
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}