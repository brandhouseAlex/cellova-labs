import Image from "next/image";

type CellovaLogoProps = { className?: string; priority?: boolean; variant?: "dark" | "light" };

export function CellovaLogo({ className = "", priority = false, variant = "dark" }: CellovaLogoProps) {
  return (
    <Image
      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/EfMwwqMwRoutzzmA.webp"
      alt="Cellova Labs"
      width={512}
      height={177}
      priority={priority}
      className={`h-auto w-full object-contain ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
