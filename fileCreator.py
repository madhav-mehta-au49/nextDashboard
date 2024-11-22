import os

def create_file(file_path, content=""):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        file.write(content)

def main():
    base_path = "app/"

    # Folder structure
    folders = [
        "api/auth/",
        "admin/",
        "admin/dashboard/components/",
        "admin/settings/",
        "admin/components/",
        "utils/"
    ]

    # Files and optional content
    files = {
        "api/auth/login.ts": "// Example login API route",
        "api/auth/logout.ts": "// Example logout API route",
        "api/auth/session.ts": "// Example session API route",
        "admin/layout.tsx": "// Layout component",
        "admin/page.tsx": "// Admin page",
        "admin/dashboard/page.tsx": "// Dashboard page",
        "admin/dashboard/components/DashboardCard.tsx": "// DashboardCard component",
        "admin/settings/page.tsx": "// Settings page",
        "admin/components/AdminHeader.tsx": "// AdminHeader component",
        "admin/components/AdminSidebar.tsx": "// AdminSidebar component",
        "admin/components/index.ts": "// Export components",
        "middleware.ts": "// Middleware logic",
        "utils/auth.ts": "// Authentication helpers",
        "utils/index.ts": "// Utility exports",
    }

    # Create folders
    for folder in folders:
        os.makedirs(os.path.join(base_path, folder), exist_ok=True)

    # Create files
    for file, content in files.items():
        create_file(os.path.join(base_path, file), content)

if __name__ == "__main__":
    main()
    print("Folder structure and files created successfully!")
