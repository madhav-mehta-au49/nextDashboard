import React from 'react';

interface PlaceholderLogoProps {
  name?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const PlaceholderLogo: React.FC<PlaceholderLogoProps> = ({
  name = '',
  className = '',
  width = 100,
  height = 100
}) => {
  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      '#0ea5e9', // sky
      '#06b6d4', // cyan
      '#14b8a6', // teal
      '#10b981', // emerald
      '#22c55e', // green
      '#84cc16', // lime
      '#eab308', // yellow
      '#f59e0b', // amber
      '#f97316', // orange
      '#ef4444', // red
      '#ec4899', // pink
      '#d946ef', // fuchsia
      '#a855f7', // purple
      '#6366f1', // indigo
      '#3b82f6', // blue
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColorFromName(name);
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || '?';

  return (
    <div 
      className={`flex items-center justify-center text-white font-bold ${className}`}
      style={{ 
        backgroundColor: bgColor,
        width: width,
        height: height,
        borderRadius: '0.5rem'
      }}
    >
      {initials}
    </div>
  );
};
