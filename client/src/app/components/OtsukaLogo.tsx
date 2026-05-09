type OtsukaLogoProps = {
  compact?: boolean;
  light?: boolean;
};

export function OtsukaLogo({ compact = false, light = false }: OtsukaLogoProps) {
  const textColor = light ? 'text-white' : 'text-[#0b4ea2]';
  const subTextColor = light ? 'text-white/75' : 'text-gray-500';

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 shrink-0 rounded-full bg-[#0b65c2] flex items-center justify-center shadow-sm">
        <span className="text-white text-lg font-bold leading-none">O</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className={`text-xl font-bold tracking-wide ${textColor}`}>OTSUKA</div>
          <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${subTextColor}`}>
            Pharmaceutical
          </div>
        </div>
      )}
    </div>
  );
}
