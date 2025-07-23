import { Leaf } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ className = "", showText = true, textColor = "text-white" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-10 h-10 brand-primary rounded-full flex items-center justify-center">
        <Leaf className="text-white text-lg" />
      </div>
      {showText && (
        <span className={`text-xl font-semibold ${textColor}`}>
          The Nirvanist
        </span>
      )}
    </div>
  );
}
