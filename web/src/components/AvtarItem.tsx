const AvtarItem = ({ src, ...props }: { src: string }) => {
  return (
    <div className="avatar" {...props}>
      <div className="w-10 rounded-full border-2 border-base-100">
        <img src={src} alt="User avatar" />
      </div>
    </div>
  );
};

export default AvtarItem;
