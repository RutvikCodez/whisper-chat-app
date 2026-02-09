import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <LoaderIcon className="text-orange-500 animate-spin" />
    </div>
  );
};

export default PageLoader;
