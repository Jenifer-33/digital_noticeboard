export const SubTitle = ({ subTitle }: { subTitle: string }) => {
  return (
    <p className="mt-1 text-xl font-bold bg-gradient-to-r from-red-500 to-[#e66030] text-transparent bg-clip-text">
      {subTitle}
    </p>
  );
};
