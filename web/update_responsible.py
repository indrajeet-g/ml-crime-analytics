with open('src/components/Responsible.tsx', 'r') as f:
    content = f.read()

import_old = 'import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";'
import_new = 'import { motion } from "motion/react";\nimport { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";'
content = content.replace(import_old, import_new)

# Add pop to Check
check_old = """                    <Check
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-4 w-4 shrink-0 text-[--color-accent]"
                    />"""
check_new = """                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <Check
                        aria-hidden="true"
                        strokeWidth={2}
                        className="mt-1 h-5 w-5 shrink-0 text-[--color-accent]"
                      />
                    </motion.div>"""
content = content.replace(check_old, check_new)

# Add pop to Ban
ban_old = """                    <Ban
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 h-4 w-4 shrink-0 text-[#737373]"
                    />"""
ban_new = """                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <Ban
                        aria-hidden="true"
                        strokeWidth={2}
                        className="mt-1 h-5 w-5 shrink-0 text-[#737373]"
                      />
                    </motion.div>"""
content = content.replace(ban_old, ban_new)

with open('src/components/Responsible.tsx', 'w') as f:
    f.write(content)
