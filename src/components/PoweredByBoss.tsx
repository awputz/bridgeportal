interface PoweredByBossProps {
  className?: string;
  size?: 'sm' | 'lg';
}

export const PoweredByBoss = ({ className = '', size = 'lg' }: PoweredByBossProps) => {
  const isSmall = size === 'sm';
  
  return (
    <div className={`flex items-center justify-center gap-4 opacity-70 hover:opacity-90 transition-opacity ${className}`}>
      <span className={`${isSmall ? 'text-xs' : 'text-lg'} text-muted-foreground/60 font-light`}>
        Powered by
      </span>
      <img 
        src="/assets/boss-logo-white.png" 
        alt="Brokerage Operating System" 
        className={`${isSmall ? 'h-5' : 'h-14'} w-auto`}
      />
    </div>
  );
};
