import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRightIcon, SparkleIcon } from "lucide-react";

const Header = () => {
  return (
    <nav className=" flex items-center justify-between relative z-10">
      <div className=" flex items-center gap-2.5">
        <div className="rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-gray-500/20  size-9">
          <SparkleIcon className="text-primary" />
        </div>
        <span className=" text-xl font-bold">Whisper</span>
      </div>
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <button className="px-5 py-2.5 font-medium text-base-content/50 hover:text-base-content transition">
            sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn gap-2 bg-linear-to-r bg-amber-500 to-orange-500 text-sm font-semibold rounded-full hover:opacity-90 shadow-lg shadow-orange-500/25 border-none">
            Get Started
            <ArrowRightIcon />
          </button>
        </SignUpButton>
      </div>
    </nav>
  );
};

export default Header;
