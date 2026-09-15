import re

with open('src/components/ProductStory.tsx', 'r') as f:
    content = f.read()

# Fix the tbody thing
tbody_wrong = """                  <RevealGroup className="divide-y divide-[#d4d4d4] text-[#0a0a0a]" as="tbody">
                    <RevealItem as="tr" className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 10:15</td>
                      <td className="px-6 py-4">Node Created: PERSON_01</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">FIR_C014.pdf</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </RevealItem>
                    <RevealItem as="tr" className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 11:30</td>
                      <td className="px-6 py-4">Entity Match Approved</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">User: admin</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </RevealItem>
                    <RevealItem as="tr" className="hover:bg-[#f5f5f5] bg-red-50/30">
                      <td className="px-6 py-4 whitespace-nowrap text-[#ff3d00]">2026-09-15 09:42</td>
                      <td className="px-6 py-4 text-[#ff3d00] font-bold">Bridge Identified</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">System Output</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </RevealItem>
                  </RevealGroup>"""

tbody_right = """                  <motion.tbody 
                    initial="hidden" 
                    whileInView="show" 
                    viewport={{ once: true }} 
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} 
                    className="divide-y divide-[#d4d4d4] text-[#0a0a0a]"
                  >
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 10:15</td>
                      <td className="px-6 py-4">Node Created: PERSON_01</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">FIR_C014.pdf</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 11:30</td>
                      <td className="px-6 py-4">Entity Match Approved</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">User: admin</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="hover:bg-[#f5f5f5] bg-red-50/30">
                      <td className="px-6 py-4 whitespace-nowrap text-[#ff3d00]">2026-09-15 09:42</td>
                      <td className="px-6 py-4 text-[#ff3d00] font-bold">Bridge Identified</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">System Output</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </motion.tr>
                  </motion.tbody>"""

content = content.replace(tbody_wrong, tbody_right)

with open('src/components/ProductStory.tsx', 'w') as f:
    f.write(content)
