with open('src/components/Problem.tsx', 'r') as f:
    content = f.read()

# Make the fragments more colorful
frag_old = """                  <div className="md:col-span-5">
                    <span
                      className={`inline-block text-2xl track-tight md:text-3xl ${
                        f.rawIsMono ? "font-[family-name:var(--font-jetbrains)]" : ""
                      } ${
                        isResolved
                          ? "border-b-2 border-[--color-accent] pb-1 text-[--color-accent]"
                          : "text-[--color-foreground]"
                      }`}
                    >
                      {f.raw}
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                      {f.kind}
                    </span>
                  </div>"""

frag_new = """                  <div className="md:col-span-5">
                    <span
                      className={`inline-block text-2xl track-tight md:text-3xl px-3 py-1 rounded bg-[#f5f5f5] border border-[#e5e5e5] ${
                        f.rawIsMono ? "font-[family-name:var(--font-jetbrains)] text-blue-700" : "text-amber-700"
                      } ${
                        isResolved
                          ? "border-b-2 border-[--color-accent] pb-1 text-[--color-accent]"
                          : ""
                      }`}
                    >
                      {f.raw}
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-jetbrains)] text-[11px] uppercase track-wider text-[#737373]">
                      {f.kind}
                    </span>
                  </div>"""
content = content.replace(frag_old, frag_new)

with open('src/components/Problem.tsx', 'w') as f:
    f.write(content)
