const TitleDesc = () => {
  return (
    <div className=" flex flex-col gap-6">
      <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tighter font-mono">
        Messaging for
        <br />
        <span className="bg-linear-to-br from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
          everyone
        </span>
      </h1>
      <p className="text-lg text-base-content/70 leading-relaxed max-w-md">
        Secure, blazing-fast conversations with real-time presence and instant
        delivery. Connect with anyone, anywhere.
      </p>
    </div>
  );
};

export default TitleDesc;
