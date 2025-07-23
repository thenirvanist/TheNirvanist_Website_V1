import colorLogo from "@assets/Color logo - no background_1753290308706.png";
import whiteLogo from "@assets/White logo - no background_1753290308708.png";
import blackLogo from "@assets/Black logo - no background_1753290308685.png";

interface LogoProps {
  className?: string;
  variant?: "color" | "white" | "black";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", variant = "white", size = "md" }: LogoProps) {
  const logoSizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  const logoSrc = {
    color: colorLogo,
    white: whiteLogo,
    black: blackLogo
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc[variant]} 
        alt="The Nirvanist - Nourish Your Soul" 
        className={`${logoSizes[size]} w-auto`}
      />
    </div>
  );
}
