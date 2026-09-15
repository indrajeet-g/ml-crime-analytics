"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Reveal, Label } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Investigator" | "Admin">("Investigator");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-6 text-[#0a0a0a]">
      <Reveal className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 font-[family-name:var(--font-mono)] text-4xl font-bold tracking-widest text-[#ff3d00]"
          >
            <Shield size={32} />
            NEXUS
          </Link>
          <p className="mt-4 text-[#737373]">
            Criminal Network Intelligence Platform
          </p>
        </div>

        <div className="border border-[#d4d4d4] bg-[#f5f5f5] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="officer-id"><Label>Officer ID</Label></label>
              <input
                id="officer-id"
                type="text"
                defaultValue="INSP_VIKRAM_DL"
                required
                className="mt-2 block w-full border border-[#d4d4d4] bg-[#e5e5e5] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:border-[#ff3d00] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="access-code"><Label>Access Code</Label></label>
              <input
                id="access-code"
                type="password"
                defaultValue="12345678"
                required
                className="mt-2 block w-full border border-[#d4d4d4] bg-[#e5e5e5] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:border-[#ff3d00] focus:outline-none"
              />
            </div>

            <div>
              <Label>Clearance Level</Label>
              <div className="mt-2 flex gap-2">
                {(["Investigator", "Admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 border px-4 py-3 font-[family-name:var(--font-mono)] text-sm transition-colors ${
                      role === r
                        ? "border-[#ff3d00] bg-[#e5e5e5] text-[#0a0a0a]"
                        : "border-[#d4d4d4] bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 border border-[#ff3d00] bg-[#ff3d00] px-6 py-4 font-bold uppercase tracking-wider text-[#fafafa] transition-opacity hover:opacity-90"
            >
              Enter NEXUS
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 border-t border-[#d4d4d4] pt-6 text-center">
            <p className="font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[#737373]">
              This is a demonstration.<br />No real authentication is performed.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[#737373] transition-colors hover:text-[#0a0a0a]"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
