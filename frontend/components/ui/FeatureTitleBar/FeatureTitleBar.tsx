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
      className={`h-10 bg-secondary text-on-secondary flex items-center px-md font-semibold ${className}`}
    >
      {title}
    </div>
  );
}
