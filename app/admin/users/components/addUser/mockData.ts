export const rightsData = {
    users: {
      id: 'users',
      name: 'User Management',
      description: 'Manage system users and their permissions',
      subrights: [
        {
          id: 'users.view',
          name: 'View Users',
          description: 'View user profiles and details'
        },
        {
          id: 'users.create',
          name: 'Create Users',
          description: 'Create new user accounts'
        },
        {
          id: 'users.edit',
          name: 'Edit Users',
          description: 'Modify existing user profiles'
        },
        {
          id: 'users.delete',
          name: 'Delete Users',
          description: 'Remove user accounts from the system'
        }
      ]
    },
    roles: {
      id: 'roles',
      name: 'Role Management',
      description: 'Manage role definitions and assignments',
      subrights: [
        {
          id: 'roles.view',
          name: 'View Roles',
          description: 'View role configurations'
        },
        {
          id: 'roles.create',
          name: 'Create Roles',
          description: 'Create new role definitions'
        },
        {
          id: 'roles.edit',
          name: 'Edit Roles',
          description: 'Modify existing role configurations'
        },
        {
          id: 'roles.delete',
          name: 'Delete Roles',
          description: 'Remove role definitions'
        }
      ]
    },
    content: {
      id: 'content',
      name: 'Content Management',
      description: 'Manage website content and assets',
      subrights: [
        {
          id: 'content.view',
          name: 'View Content',
          description: 'View all content items'
        },
        {
          id: 'content.create',
          name: 'Create Content',
          description: 'Create new content items'
        },
        {
          id: 'content.edit',
          name: 'Edit Content',
          description: 'Modify existing content'
        },
        {
          id: 'content.publish',
          name: 'Publish Content',
          description: 'Publish or unpublish content'
        }
      ]
    },
    settings: {
      id: 'settings',
      name: 'System Settings',
      description: 'Manage system configuration and settings',
      subrights: [
        {
          id: 'settings.view',
          name: 'View Settings',
          description: 'View system settings'
        },
        {
          id: 'settings.edit',
          name: 'Edit Settings',
          description: 'Modify system settings'
        },
        {
          id: 'settings.security',
          name: 'Security Settings',
          description: 'Manage security configurations'
        }
      ]
    },
    analytics: {
      id: 'analytics',
      name: 'Analytics',
      description: 'Access to analytics and reporting',
      subrights: [
        {
          id: 'analytics.view',
          name: 'View Reports',
          description: 'View analytics reports'
        },
        {
          id: 'analytics.export',
          name: 'Export Data',
          description: 'Export analytics data'
        },
        {
          id: 'analytics.configure',
          name: 'Configure Analytics',
          description: 'Configure analytics settings'
        }
      ]
    }
  };
  