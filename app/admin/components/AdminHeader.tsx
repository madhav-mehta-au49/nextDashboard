"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { CgProfile } from 'react-icons/cg';
import { FiBell, FiFileText, FiHome, FiLogOut, FiMenu, FiSearch, FiSettings, FiUser, FiUsers } from 'react-icons/fi';
import { useSidebar } from "../contexts/SidebarContext";

export const AdminHeader = () => {
    const router = useRouter();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    useEffect(() => {
        // Example of using router
        // console.log('Current route:', router.pathname);
    }, [router]);

    return (
        <header 
            className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 fixed top-0 right-0 left-0 z-10 transition-all duration-200 ${
                isSidebarOpen ? "ml-[240px]" : "ml-0"
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        aria-label="Toggle Sidebar"
                        className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                        onClick={() => {
                            console.log('Header: Toggling sidebar');
                            toggleSidebar();
                        }}
                    >
                        <FiMenu size={20} />
                    </button>
                    <div className="w-full max-w-[600px] relative">
                        <button
                            aria-label="Search"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-[2] p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                        >
                            <FiSearch size={20} />
                        </button>
                        <div className="relative">
                            <input
                                placeholder="Search..."
                                className="w-full rounded-full border border-gray-300 dark:border-gray-600 pl-12 py-2 text-md hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Home"
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() => router.push('/admin')}
                            title="Home"
                        >
                            <FiHome size={20} />
                        </button>
                        <button
                            aria-label="Documents"
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() => router.push('/admin/documents')}
                            title="Documents"
                        >
                            <FiFileText size={20} />
                        </button>
                        <button
                            aria-label="Users"
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() => router.push('/admin/users')}
                            title="Users"
                        >
                            <FiUsers size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <button 
                            aria-label="Notifications" 
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            <FiBell size={20} />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">No new notifications</div>
                        </div>
                    </div>

                    <div className="relative group">
                        <button 
                            aria-label="User menu" 
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            <FiUser size={20} />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                    <CgProfile size={16} />
                                    Profile
                                </div>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                    <FiSettings size={16} />
                                    Settings
                                </div>
                            </button>
                            <button 
                                onClick={() => console.log("logout")}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center gap-2">
                                    <FiLogOut size={16} />
                                    Logout
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
