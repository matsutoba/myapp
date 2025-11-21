interface MenuLinkButtonProps {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}

export const MenuLinkButton = ({
  title,
  description,
  href,
  disabled,
}: MenuLinkButtonProps) => {
  if (disabled) {
    return (
      <div
        className="block bg-white p-6 rounded-lg shadow opacity-60 cursor-not-allowed"
        aria-disabled="true"
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }

  return (
    <a
      href={href}
      className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </a>
  );
};
