import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRightIcon } from "lucide-react";

const CTA = () => {
  return (
    <div className="flex items-center gap-4">
      <SignUpButton mode="modal">
        <button className="group flex items-center gap-3 px-8 py-4 bg-base-100 text-base-content font-semibold rounded-2xl hover:bg-base-200 transition">
          Start chatting
          <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </SignUpButton>

      <SignInButton mode="modal">
        <button className="px-8 py-4 text-base-content/60 font-semibold hover:text-base-content transition">
          I have an account
        </button>
      </SignInButton>
    </div>
  );
};

export default CTA;
