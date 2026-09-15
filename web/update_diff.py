with open('src/components/Differentiation.tsx', 'r') as f:
    content = f.read()

import_old = 'import { Container, Section, Reveal, RevealGroup, RevealItem, Label } from "@/components/ui";'
import_new = 'import { Container, Section, Reveal, RevealGroup, RevealItem, Label, SpotlightCard } from "@/components/ui";'

content = content.replace(import_old, import_new)

article_old = """              <article className="group relative z-0 flex h-full flex-col border border-[--color-border] bg-transparent p-6 transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:z-10 hover:border-[#a3a3a3] md:p-10">"""
article_new = """              <SpotlightCard className="h-full z-0 hover:z-10 bg-white">
                <article className="group relative flex h-full flex-col border border-[--color-border] bg-transparent p-6 transition-colors duration-150 ease-[cubic-bezier(0.25,0,0,1)] hover:border-[#a3a3a3] md:p-10">"""

content = content.replace(article_old, article_new)

# Add closing SpotlightCard
content = content.replace("                </div>\n              </article>\n            </RevealItem>", "                </div>\n              </article>\n              </SpotlightCard>\n            </RevealItem>")

with open('src/components/Differentiation.tsx', 'w') as f:
    f.write(content)
