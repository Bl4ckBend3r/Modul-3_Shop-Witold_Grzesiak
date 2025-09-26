"use client";

import { useState } from "react";
import Dropdown from "@/ui/Dropdown";
import Checkbox from "@/ui/Checkbox";
import Button from "@/ui/Button";

type Props = { onSaved?: () => void };

export default function NewAddressForm({ onSaved }: Props) {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [line, setLine] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          province,
          city,
          postal,
          line,
          isDefault,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Save failed");
      }
      onSaved?.();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Save failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      {/* Grid 2×2 */}
      <div className="relative grid grid-cols-2 gap-6 w-full">
        <Dropdown
          label="Country"
          size="xl"
          border="border"
          value={country}
          onChange={setCountry}
          options={["Indonesia", "Poland", "Germany"]}
          className="w-full"
        />

        <Dropdown
          label="Province"
          size="xxl"
          border="border"
          value={province}
          onChange={setProvince}
          options={["Jakarta", "West Java", "Mazowieckie"]}
          className="w-full"
        />

        <Dropdown
          label="City"
          size="xxl"
          border="border"
          value={city}
          onChange={setCity}
          options={["Jakarta", "Bandung", "Warsaw"]}
          className="w-full"
        />

        <Dropdown
          label="Postal Code"
          size="xl"
          border="border"
          value={postal}
          onChange={setPostal}
          options={["10110", "40212", "00-001"]}
          className="w-full"
        />
      </div>

      {/* Complete Address */}
      <textarea
        placeholder="Input Complete Address"
        value={line}
        onChange={(e) => setLine(e.target.value)}
        className="h-[100px] w-full rounded-md border border-[#383B42] bg-[#262626] px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F29145]"
        required
      />

      {/* Main address checkbox */}
      <Checkbox
        checked={isDefault}
        onChange={setIsDefault}
        size="l"
        label="Make it the main address"
        className="text-white"
      />

      {err && <p className="text-red-400">{err}</p>}

      <Button size="xl" className="w-full mt-2" disabled={loading}>
        {loading ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}
