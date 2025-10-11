export const Title = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h3
      className={`text-lg min-h-20 cursor-pointer font-semibold text-[#134686] line-clamp-2 mb-2 ${className}`}
    >
      {title}
    </h3>
  );
};
