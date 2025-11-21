interface FeatureTitleBarProps {
  title: string;
  className?: string;
}

export function FeatureTitleBar({
  title,
  className = '',
}: FeatureTitleBarProps) {
  return (
    <div
      className={`h-10 bg-gray-200 flex items-center px-4 font-semibold ${className}`}
    >
      {title}
    </div>
  );
}
