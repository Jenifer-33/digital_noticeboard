export const Description = ({
  description,
  lineClamp = 2,
}: {
  description: string;
  lineClamp?: number;
}) => {
  return (
    <p
      className={`text-[#134686] ${
        lineClamp
          ? `line-clamp-${lineClamp} leading-loose text-md`
          : "line-clamp-2 text-sm"
      } mb-3`}
    >
      {description}
    </p>
  );
};
