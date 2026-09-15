with open('src/components/Pipeline.tsx', 'r') as f:
    content = f.read()

# Add a large SVG diagram to the right of the stages
stages_old = """        <div className="relative mt-16 md:mt-20">
          <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
          >
            <motion.div 
              style={{ height }} 
              className="w-full bg-[--color-accent] origin-top" 
            />
          </div>

          <RevealGroup className="relative">
            {STAGES.map(({ n, title, body, note, Icon }) => (
              <RevealItem key={n}>
                <div className="group grid grid-cols-1 gap-y-4 py-8 md:grid-cols-[6rem_1fr] md:items-start md:gap-x-8 md:py-10">
                  <div className="md:flex md:justify-center">
                    <span
                      className="inline-block bg-[--color-background] font-[family-name:var(--font-jetbrains)] text-3xl font-bold tabular-nums track-tight text-[#a3a3a3] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:text-[--color-accent] md:px-2 md:py-1 md:text-4xl"
                    >
                      {n}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 text-[--color-foreground]"
                      />
                      <h3 className="text-xl font-bold track-tight md:text-2xl">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                      {body}
                    </p>
                                        <p className="mt-3 font-[family-name:var(--font-jetbrains)] text-[13px] leading-relaxed text-[--color-muted-foreground]">
                      {note}
                    </p>
                  </div>
                </div>
                </RevealItem>
            ))}
          </RevealGroup>
        </div>"""

stages_new = """        <div className="relative mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-6 relative">
            <div
              ref={containerRef}
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
            >
              <motion.div 
                style={{ height }} 
                className="w-full bg-[--color-accent] origin-top" 
              />
            </div>

            <RevealGroup className="relative">
              {STAGES.map(({ n, title, body, note, Icon }) => (
                <RevealItem key={n}>
                  <div className="group grid grid-cols-1 gap-y-4 py-8 md:grid-cols-[6rem_1fr] md:items-start md:gap-x-8 md:py-10">
                    <div className="md:flex md:justify-center">
                      <span
                        className="inline-block bg-[--color-background] font-[family-name:var(--font-jetbrains)] text-3xl font-bold tabular-nums track-tight text-[#a3a3a3] transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] group-hover:text-[--color-accent] md:px-2 md:py-1 md:text-4xl"
                      >
                        {n}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={20}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className="shrink-0 text-[--color-foreground]"
                        />
                        <h3 className="text-xl font-bold track-tight md:text-2xl">
                          {title}
                        </h3>
                      </div>
                      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[--color-foreground]">
                        {body}
                      </p>
                      <p className="mt-3 font-[family-name:var(--font-jetbrains)] text-[13px] leading-relaxed text-[--color-muted-foreground]">
                        {note}
                      </p>
                    </div>
                  </div>
                  </RevealItem>
              ))}
            </RevealGroup>
          </div>
          
          <div className="lg:col-span-6 sticky top-24 lg:block hidden">
            <div className="w-full bg-[#fafafa] border border-[--color-border] p-8 aspect-[3/4] relative overflow-hidden flex flex-col items-center justify-center">
              {/* Animated Network Data Flow Diagram */}
              <svg className="w-full h-full" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e5e5" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Flow Lines */}
                <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "linear" }} d="M 50 50 C 50 150, 200 150, 200 250" stroke="#ff3d00" strokeWidth="3" fill="none" strokeDasharray="6 6" />
                <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "linear", delay: 0.5 }} d="M 350 50 C 350 150, 200 150, 200 250" stroke="#4a7fb5" strokeWidth="3" fill="none" />
                <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "linear", delay: 1 }} d="M 200 250 L 200 450" stroke="#16a085" strokeWidth="4" fill="none" />
                
                {/* Input Nodes */}
                <rect x="20" y="20" width="60" height="60" rx="8" fill="white" stroke="#d4d4d4" strokeWidth="2" />
                <text x="50" y="55" textAnchor="middle" fill="#0a0a0a" fontSize="12" fontWeight="bold">FIR</text>
                
                <rect x="320" y="20" width="60" height="60" rx="8" fill="white" stroke="#d4d4d4" strokeWidth="2" />
                <text x="350" y="55" textAnchor="middle" fill="#0a0a0a" fontSize="12" fontWeight="bold">CALL</text>
                
                {/* Processing Core */}
                <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 1 }} cx="200" cy="250" r="40" fill="#0a0a0a" />
                <motion.circle animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} cx="200" cy="250" r="50" fill="none" stroke="#ff3d00" strokeWidth="2" />
                <text x="200" y="255" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">NEXUS</text>
                
                {/* Output Nodes */}
                <rect x="150" y="420" width="100" height="40" rx="4" fill="#ff3d00" />
                <text x="200" y="445" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">KNOWLEDGE</text>
              </svg>
            </div>
          </div>
        </div>"""

content = content.replace(stages_old, stages_new)

with open('src/components/Pipeline.tsx', 'w') as f:
    f.write(content)
