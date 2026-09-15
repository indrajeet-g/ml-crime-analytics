with open('src/components/Pipeline.tsx', 'r') as f:
    content = f.read()

import_old = 'import { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";'
import_new = 'import { motion, useScroll, useTransform } from "motion/react";\nimport { useRef } from "react";\nimport { Container, Section, Reveal, RevealGroup, RevealItem } from "@/components/ui";'

content = content.replace(import_old, import_new)

# Add ref and scroll hook
function_def = 'export default function Pipeline() {'
hook = """export default function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);"""

content = content.replace(function_def, hook)

# Add the animated line
line_old = """          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
          />"""

line_new = """          <div
            ref={containerRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-12 hidden w-px bg-[--color-border] md:block"
          >
            <motion.div 
              style={{ height }} 
              className="w-full bg-[--color-accent] origin-top" 
            />
          </div>"""

content = content.replace(line_old, line_new)

with open('src/components/Pipeline.tsx', 'w') as f:
    f.write(content)
