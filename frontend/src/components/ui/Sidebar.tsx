import React, { useState } from "react";
import { Menu, X, Stethoscope } from "lucide-react";

// Define the structure for sidebar menu options
interface SidebarOption {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// Props for the Sidebar component
interface SidebarProps {
  options: SidebarOption[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  options,
  currentPath = "/",
  onNavigate,
}) => {
  // State to control sidebar open/close
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle menu option clicks
  const handleOptionClick = (path: string) => {
    // Call the navigation callback if provided
    if (onNavigate) {
      onNavigate(path);
    }
    // Close sidebar after navigation
    setIsOpen(false);
  };

  // Close sidebar when clicking outside (on overlay)
  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Always visible */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-2 z-50 p-3 cursor-pointer rounded-xl bg-black/90 border border-gray-700/50 hover:bg-gray-900 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm"
          aria-label="Toggle navigation menu"
        >
          <Menu
            className="text-white transition-all duration-300 hover:text-blue-400"
            size={15}
          />
        </button>
      )}

      {/* Dark Overlay - Only visible when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black border-r border-gray-800 z-40 transform transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 shadow-2xl shadow-black/50"
            : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header - Brand and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-black">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
              <Stethoscope className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                book4myhealth
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Clinic Management
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg cursor-pointer bg-gray-800/50 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 group"
            aria-label="Close navigation menu"
          >
            <X
              className="text-gray-300 group-hover:text-white transition-colors duration-200"
              size={18}
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {options.map((option, index) => {
            // Check if this option is currently active
            const isActive = currentPath === option.path;

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option.path)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50"
                    : "text-gray-300 hover:bg-gray-800/70 hover:text-white border border-transparent hover:border-gray-700/50"
                }`}
              >
                {/* Option Icon */}
                <div
                  className={`flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-blue-400"
                  }`}
                >
                  {option.icon}
                </div>

                {/* Option Label */}
                <span className="font-medium text-left flex-1 text-sm">
                  {option.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white shadow-lg"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900/30 to-black">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">
              © 2025 book4myhealth
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Healthcare Management System
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
