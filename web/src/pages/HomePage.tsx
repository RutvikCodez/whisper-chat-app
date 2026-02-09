import Header from "../components/Header";
import TitleDesc from "../components/TitleDesc";
import CTA from "../components/CTA";
import { avatars, stats } from "../constants";
import AvtarItem from "../components/AvtarItem";
import StatItem from "../components/StatItem";

const HomePage = () => {
  return (
    <div className="h-screen bg-base-100 text-base flex">
      <div className="flex flex-1 flex-col p-8 lg:p-12 relative overflow-hidden">
        <Header />
        <div className="flex-1 flex flex-col gap-12 justify-center max-w-xl relative z-10">
          <div className="flex flex-col gap-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider w-fit">
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              Now Available
            </span>
            <div className="flex flex-col gap-10">
              <TitleDesc />
              <CTA />
            </div>
            <div className="flex items-center gap-4">
              <div className="avatar-group -space-x-6">
                <div className="avatar-group -space-x-6">
                  {avatars.map((src, i) => (
                    <AvtarItem key={i} src={src} />
                  ))}

                  <div className="avatar avatar-placeholder">
                    <div className="w-10 rounded-full border-2 border-base-100 bg-base-300 text-base-content">
                      <span className="text-xs font-mono">+5k</span>
                    </div>
                  </div>
                  <div className="w-10 rounded-full border-2 border-base-100 bg-base-300 text-base-content">
                    <span className="text-xs font-mono">+5k</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-base-content/70">
                Join{" "}
                <span className="font-mono text-base-content/80">10,000+</span>{" "}
                happy users
              </span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            {stats.map((item, i) => (
              <StatItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
