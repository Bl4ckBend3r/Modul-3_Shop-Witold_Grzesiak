import * as React from "react";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Domyślny rozmiar w px, jeśli nie podasz width/height */
  size?: number;
};

function Avatar({ size = 40, className = "", ...imgProps }: AvatarProps) {
  const w = imgProps.width ?? size;
  const h = imgProps.height ?? size;

  return (
    <img
      {...imgProps}
      width={w}
      height={h}
      alt={imgProps.alt ?? "Avatar"}
      className={`rounded-full object-cover ${className}`}
      src={imgProps.src ?? "/placeholder-avatar.png"}
    />
  );
}

export default Avatar;
