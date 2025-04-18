"use client"
import { useState } from "react";
import NextLink from "next/link";
import { FiBox, FiChevronDown, FiChevronUp, FiFileText, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { useSidebar } from "../contexts/SidebarContext";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: MenuItem[];
}

const AdminSidebar = () => {
  const { isSidebarOpen } = useSidebar();
  console.log('Sidebar: Current state:', isSidebarOpen);
  const [menuItems] = useState<MenuItem[]>([
    { name: "Dashboard", icon: FiHome, path: "/admin" },
    { 
      name: "Users", 
      icon: FiUsers, 
      path: "/admin/users",
      subItems: [
        { name: "All Users", icon: FiUsers, path: "/admin/users/all" },
        { name: "Add User", icon: FiUsers, path: "/admin/users/add" }
      ]
    },
    { 
      name: "Products", 
      icon: FiBox, 
      path: "/admin/products",
      subItems: [
        { name: "All Products", icon: FiBox, path: "/admin/products/all" },
        { name: "Add Product", icon: FiBox, path: "/admin/products/add" }
      ]
    },
    { name: "Orders", icon: FiFileText, path: "/admin/orders" },
    { name: "Settings", icon: FiSettings, path: "/admin/settings" },
  ]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <nav
      className={`fixed left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-8 top-0 transition-all duration-200 overflow-hidden ${
        isSidebarOpen ? "w-[240px]" : "w-0"
      }`}
    >
      <div className="flex flex-col gap-4 items-stretch">
        <div className="px-4">
          <div className="mx-auto text-gray-600 dark:text-gray-400">
            <FiSettings className="w-8 h-8 mx-auto" />
          </div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        {menuItems.map((item: MenuItem) => (
          <div key={item.path}>
            <div
              onClick={() => item.subItems && toggleSubmenu(item.name)}
              className={`flex items-center p-3 cursor-${item.subItems ? 'pointer' : 'default'} transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md`}
            >
              <NextLink
                href={item.path}
                className="flex items-center text-current no-underline flex-1"
              >
                <item.icon className="mr-2" />
                <div>
                  <p className="font-bold">{item.name}</p>
                </div>
              </NextLink>
              {item.subItems && (
                expandedItems.includes(item.name) ? 
                <FiChevronUp className="ml-2" /> : 
                <FiChevronDown className="ml-2" />
              )}
            </div>
            
            {item.subItems && expandedItems.includes(item.name) && (
              <div className="pl-6">
                {item.subItems.map((subItem) => (
                  <NextLink
                    key={subItem.path}
                    href={subItem.path}
                    className="flex items-center p-2 text-current no-underline transition-colors"
                  >
                    <div 
                      className="flex items-center w-full hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                    >
                      <subItem.icon className="mr-2" />
                      <div>
                        <p className="text-sm">{subItem.name}</p>
                      </div>
                    </div>
                  </NextLink>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;
