interface ScreenTitleProps {
  label: string;
}

export const ScreenTitle: React.FC<ScreenTitleProps> = ({ label }) => {
  return <h1 className="text-2xl font-regular">{label}</h1>;
};
