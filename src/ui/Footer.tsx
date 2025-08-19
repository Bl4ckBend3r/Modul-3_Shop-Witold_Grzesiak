import Link from "next/link";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Partner", href: "/partner" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { label: "Account", href: "/account" },
      { label: "Deliveries", href: "/deliveries" },
      { label: "Orders", href: "/orders" },
      { label: "Payments", href: "/payments" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "E-books", href: "/ebooks" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Course", href: "/courses" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-50 border-t border-neutral-200">
      <div
        className="
      mx-auto w-full max-w-[1440px]
      px-6 sm:px-8 lg:px-[60px]
      py-[clamp(48px,8vw,140px)]
      pb-[clamp(48px,8vw,140px)] lg:pb-[clamp(64px,8vw,160px)] lg:pt-[clamp(64px,8vw,160px)] lg:py-[clamp(64px,8vw,160px)] lg:gap-6
      
    "
      >
        <div className="flex flex-col-2  lg:flex-row lg:items-start lg:justify-between">
          {/* LEWY BLOK: 531.75 x 214 */}
          <div className="w-full  max-w-[531.75px] lg:basis-[531.75px] lg:shrink-0 ">
            <div className="mb-3 text-2xl font-semibold tracking-[-0.01em] pb-[24px] text-[36px]">
              <span className="text-[#EE701D]">Nexus</span>
              <span className="text-neutral-900">Hub</span>
            </div>

            <p className="text-sm leading-6 text-[#5D5D5D] text-[16px] pb-[24px]">
              © 2023 NexusHub. All rights reserved.
            </p>

            {/* „Pigułki” płatności jak w makiecie */}
            <div className="mt-4 flex flex-wrap items-center gap-[12px] h-[30px]">
              {["VISA", "Mastercard", "PayPal", "GPay", "Apple Pay"].map(
                (p) => (
                  <span
                    key={p}
                    className="h-[30px] rounded-md border border-neutral-200 bg-white px-2.5 text-xs leading-[28px] text-neutral-700 shadow-sm"
                  >
                    {p}
                  </span>
                )
              )}
            </div>
            <div className="h-[214px] hidden lg:block" aria-hidden />
          </div>

          {/* PRAWA CZĘŚĆ: 4 kolumny linków */}
          <div className="w-full h-auto lg:h-[214px] lg:max-w-[848.25px]">
  <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4
                  gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-8 lg:gap-x-[48px] lg:gap-y-[32px]">
    {columns.map((col) => (
      <div key={col.title} className="min-w-[160px]">
        {/* tytuł */}
        <h4 className="text-[18px] pb-[24px] leading-[24px] md:text-[20px] md:leading-[26px]
                       font-semibold text-neutral-900 mb-4 md:mb-[32px]">
          {col.title}
        </h4>

        {/* linki */}
        <ul className="list-none m-0 p-0 space-y-3 sm:space-y-4 lg:space-y-[32px]">
          {col.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="block text-[14px] leading-[24px] sm:text-[16px] sm:leading-[26px]
                           text-[#5D5D5D] hover:text-neutral-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>
        </div>

        {/* delikatny separator jak w projekcie */}
        <div className="mt-8 h-px w-full bg-neutral-200" />
      </div>
    </footer>
  );
}
