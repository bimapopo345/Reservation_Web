type OtsukaLogoProps = {
  compact?: boolean;
  light?: boolean;
};

export function OtsukaLogo({ compact = false }: OtsukaLogoProps) {
  return (
    <img
      src="/otsuka.png"
      alt="Otsuka"
      className={`${compact ? 'h-8' : 'h-14'} w-auto max-w-full object-contain`}
    />
  );
}
