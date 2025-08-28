import { TriangleAlert } from 'lucide-react';

interface Props {
  errorMessage: string;
}

export const ChartErrorScreen: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className="flex h-[250px] flex-col justify-center items-center gap-3">
      <TriangleAlert size={70} className="text-red-400 fill-red-400/35" />
      <p className="text-lg text-red-400 mt-2">{errorMessage}</p>
    </div>
  );
};
