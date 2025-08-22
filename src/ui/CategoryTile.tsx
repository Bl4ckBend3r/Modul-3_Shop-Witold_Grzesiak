"use client";
import { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { JSX } from "react";
import Head from "next/head";

const CategoryIcons: Record<string, JSX.Element> = {
  Monitor: (
    <div className="relative w-[80px] h-[80px]">
      <div className="absolute left-[12px] top-[10px] w-[56px] h-[31px] bg-[#E05816] rounded-t-md" />
      <div className="absolute left-[12px] top-[43px] w-[56px] h-[11px] bg-[#EE701D] rounded-t-md rotate-180" />
      <div className="absolute left-[28px] top-[56px] w-[26px] h-[13px] bg-[#262626]" />
      <div className="absolute left-[28px] top-[63px] w-[26px] h-[6px] bg-[#F29145] rounded-[2.5px]" />
      <div className="absolute left-[38px] top-[56px] w-[6px] h-[8px] bg-[#F29145] rounded" />
    </div>
  ),
  Mouse: (
    <div className="relative w-[80px] h-[80px]">
      <div className="absolute left-[16px] top-[4px] w-[46px] h-[46px] rounded-full bg-[#F29145]" />
      <div className="absolute left-[18px] top-[4px] w-[46px] h-[46px] rounded-full bg-[#EE701D]" />
      <div className="absolute left-[16px] top-[29px] w-[48px] h-[47px] bg-[#E05816] rounded-b-[23.5px]" />
      <div className="absolute left-[16px] top-[27px] w-[48px] h-[4px] bg-[#262626]" />
      <div className="absolute left-[38px] top-[4px] w-[5px] h-[24px] bg-[#262626] rounded" />
    </div>
  ),

  Headphone: (
    <div className="relative w-[80px] h-[80px]">
      <div
        className="absolute left-[11px] top-[11px] w-[55px] h-[55px]
                    rounded-full border-[4px] border-[#F29145] border-b-0"
      />
      <div className="absolute left-[11px] top-[40px] w-[59px] h-[40px] bg-[#262626]" />
      <div className="absolute left-[49px] top-[40px] w-[20px] h-[4px] bg-[#262626]" />
      <div
        className="absolute left-[11px] top-[42px] w-[20px] h-[26px]
                    bg-[#E05816]
                    rounded-tl-[2px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[2px]"
      />
      <div
        className="absolute left-[49px] top-[42px] w-[20px] h-[26px]
                    bg-[#EE701D]
                    rounded-tl-[10px] rounded-tr-[2px] rounded-br-[2px] rounded-bl-[10px]"
      />
    </div>
  ),

  Keyboard: (
    <div className="relative w-[80px] h-[80px]">
      <div className="absolute left-[21px] top-[9px] w-[38px] h-[10px] border-l-2 border-t-2 border-b-2 border-[#F29145] rounded-[1px]" />
      <div className="absolute left-[21px] top-[18px] w-[38px] h-[7px] border-r-2 border-[#F29145] rounded-[1px]" />
      <div className="absolute left-[11px] top-[26px] w-[58px] h-[10px] bg-[#F29145] rounded-t-[2px]" />

      <div
        className="absolute left-[11px] top-[38px] h-[4px] flex"
        style={{ gap: 1.45 }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="w-[4px] h-[4px] bg-[#E05816]" />
        ))}
      </div>
      <div
        className="absolute left-[12px] top-[44px] h-[4px] flex"
        style={{ gap: 1.45 }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="w-[4px] h-[4px] bg-[#E05816]" />
        ))}
      </div>
      <div
        className="absolute left-[11px] top-[50px] h-[4px] flex"
        style={{ gap: 1.45 }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="w-[4px] h-[4px] bg-[#E05816]" />
        ))}
      </div>
      <div className="absolute left-[11px] top-[56px] w-[58px] h-[10px] bg-[#EE701D] rounded-b-[2px]" />
    </div>
  ),

  Webcam: (
    <div className="relative w-[80px] h-[80px]">
      <div className="absolute left-[28px] top-[12px] w-[24px] h-[9px] bg-[#EE701D] rounded-[2px]" />
      <div className="absolute left-[10px] top-[23px] w-[60px] h-[44px] bg-[#E05816] rounded-[6px]" />
      <div className="absolute left-[27px] top-[32px] w-[26px] h-[26px] rounded-full bg-[#262626]" />
      <div className="absolute left-[30px] top-[35px] w-[20px] h-[20px] rounded-full bg-[#F29145]" />
    </div>
  ),
};

export default function CategoryTile({
  title,
  image,
}: {
  title: string;
  image?: string;
}) {
  const hasImg = !!(image && image.trim().length > 0);
  const icon = CategoryIcons[title];
  const initial = title?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className="box-border flex flex-col justify-center items-center p-3 gap-6
                    w-[220px] h-[190px] rounded-[6px]
                    bg-[#262626] border border-[#616674]
                    transition-colors duration-150 group-hover:border-[#F29145]"
    >
      <div className="relative w-[80px] h-[80px]">
        {icon ? (
          icon
        ) : hasImg ? (
          <Image
            src={image!}
            alt={title}
            width={80}
            height={80}
            className="object-contain"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center rounded bg-[#1E1E1E] text-white/80 text-xl font-semibold">
            {initial}
          </div>
        )}
      </div>

      <p className="text-[20px] leading-[30px] font-medium tracking-[-0.01em] text-[#FCFCFC] text-center">
        {title}
      </p>
    </div>
  );
}
