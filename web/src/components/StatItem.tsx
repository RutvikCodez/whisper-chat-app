const StatItem = ({ label, value, ...props }: StatItemProps) => {
  return (
    <div {...props}>
     <div>
         <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">
        {label}
      </div>
     </div>
    </div>
  );
};

export default StatItem;
