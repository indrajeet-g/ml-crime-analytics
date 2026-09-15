import re

with open('src/components/ProductStory.tsx', 'r') as f:
    content = f.read()

# Step 1: Add staggered RevealItems in Step 1 (Extraction)
extraction_old = """                <div className="mt-4 space-y-3">
                  <div className="border border-blue-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-blue-700">PERSON</span>
                    <span className="text-[#0a0a0a]">Rahul Sharma</span>
                  </div>
                  <div className="border border-teal-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-teal-700">VEHICLE</span>
                    <span className="text-[#0a0a0a]">DL-8C-xxxx</span>
                  </div>
                  <div className="border border-amber-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-amber-700">PHONE</span>
                    <span className="text-[#0a0a0a]">9876543210</span>
                  </div>
                </div>"""

extraction_new = """                <RevealGroup className="mt-4 space-y-3">
                  <RevealItem className="border border-blue-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-blue-700">PERSON</span>
                    <span className="text-[#0a0a0a]">Rahul Sharma</span>
                  </RevealItem>
                  <RevealItem className="border border-teal-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-teal-700">VEHICLE</span>
                    <span className="text-[#0a0a0a]">DL-8C-xxxx</span>
                  </RevealItem>
                  <RevealItem className="border border-amber-200 bg-white p-2 text-xs font-[family-name:var(--font-mono)] flex justify-between">
                    <span className="text-amber-700">PHONE</span>
                    <span className="text-[#0a0a0a]">9876543210</span>
                  </RevealItem>
                </RevealGroup>"""
content = content.replace(extraction_old, extraction_new)


# Step 2: Entity Resolution Animations
resolution_old = """                {/* Connecting lines */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-48 h-16 border-b-2 border-l-2 border-r-2 border-[#ff3d00]/30 rounded-b-xl z-0" />
                <div className="absolute top-[144px] left-1/2 -translate-x-1/2 w-px h-8 bg-[#ff3d00]/30 z-0" />

                <div className="bg-white border-2 border-green-500 p-5 text-center relative z-10 mt-16 shadow-lg">"""

resolution_new = """                {/* Connecting lines animated */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-48 h-16 border-b-2 border-l-2 border-r-2 border-[#ff3d00]/30 rounded-b-xl z-0 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "200%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-r from-transparent via-[#ff3d00]/40 to-transparent absolute top-0"
                  />
                </div>
                <div className="absolute top-[144px] left-1/2 -translate-x-1/2 w-px h-8 bg-[#ff3d00]/30 z-0 overflow-hidden">
                  <motion.div 
                    initial={{ y: "-100%" }}
                    whileInView={{ y: "100%" }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-b from-transparent via-[#ff3d00] to-transparent"
                  />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-green-500 p-5 text-center relative z-10 mt-16 shadow-lg"
                >"""
content = content.replace(resolution_old, resolution_new)

# Add closing tag for motion.div in step 2
content = content.replace("                </div>\n              </div>\n            </div>", "                </motion.div>\n              </div>\n            </div>")

# Step 3: Network Diagram animations
network_old = """    ├──── [PRIMARY] PERSON_02  │
    │       │                  │
    │       └──── VEHICLE_DL8C ┘  <-- BRIDGE DETECTED"""

network_new = """    ├──── <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-red-400 font-bold">[PRIMARY]</motion.span> PERSON_02  │
    │       │                  │
    │       └──── VEHICLE_DL8C ┘  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-[#ff3d00] font-bold">&lt;-- BRIDGE DETECTED</motion.span>"""
content = content.replace(network_old, network_new)

# Since we put motion.span inside <pre>, we need to make sure JSX parsing works. Actually, <pre> might not play well with nested components directly if we output raw text.
# Wait, inside <pre> block with string literals, we can't easily embed React components. 
# Let's fix the pre block to be a mix of strings and components.
pre_block_old = """                <pre className="text-sm leading-[1.8]">
{`CASE_C014
    │
    ├──── [PRIMARY] PERSON_01
    │       │
    │       └──── PHONE_987
    │
    ├──── VEHICLE_DL8C ────────┐
    │                          │
    └──── LOCATION_MAIN        │
                               │
CASE_C099                      │
    │                          │
    ├──── [PRIMARY] PERSON_02  │
    │       │                  │
    │       └──── VEHICLE_DL8C ┘  <-- BRIDGE DETECTED
    │
    └──── PHONE_332`}
                </pre>"""

pre_block_new = """                <pre className="text-sm leading-[1.8]">
CASE_C014
    │
    ├──── <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-red-400 font-bold">[PRIMARY]</motion.span> PERSON_01
    │       │
    │       └──── PHONE_987
    │
    ├──── VEHICLE_DL8C ────────┐
    │                          │
    └──── LOCATION_MAIN        │
                               │
CASE_C099                      │
    │                          │
    ├──── <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-red-400 font-bold">[PRIMARY]</motion.span> PERSON_02  │
    │       │                  │
    │       └──── VEHICLE_DL8C ┘  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-[#ff3d00] font-bold">&lt;-- BRIDGE DETECTED</motion.span>
    │
    └──── PHONE_332
                </pre>"""
content = content.replace(pre_block_old, pre_block_new)

# Step 4: SVG Drawing Animation
svg_old = """                  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    <line x1="70%" y1="30%" x2="50%" y2="50%" stroke="#ff3d00" strokeWidth="3" />
                    <line x1="50%" y1="70%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    
                    <circle cx="30%" cy="30%" r="8" fill="#4a7fb5" />
                    <circle cx="70%" cy="30%" r="10" fill="#ff0000" />
                    <circle cx="50%" cy="70%" r="8" fill="#e67e22" />
                    
                    <circle cx="50%" cy="50%" r="12" fill="#d97706" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 translate-x-3 translate-y-3 bg-white border border-[#d4d4d4] p-1.5 shadow-sm pointer-events-none">"""

svg_new = """                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} x1="30%" y1="30%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} x1="70%" y1="30%" x2="50%" y2="50%" stroke="#ff3d00" strokeWidth="3" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} x1="50%" y1="70%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }} cx="30%" cy="30%" r="8" fill="#4a7fb5" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} cx="70%" cy="30%" r="10" fill="#ff0000" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} cx="50%" cy="70%" r="8" fill="#e67e22" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="50%" cy="50%" r="12" fill="#d97706" />
                  </svg>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute top-1/2 left-1/2 translate-x-3 translate-y-3 bg-white border border-[#ff3d00] p-1.5 shadow-sm pointer-events-none"
                  >"""
content = content.replace(svg_old, svg_new)
content = content.replace('                  </div>\n                </div>\n                {/* Fake Sidebar */}', '                  </motion.div>\n                </div>\n                {/* Fake Sidebar */}')

# Stagger the table rows in Step 5
tbody_old = """                  <tbody className="divide-y divide-[#d4d4d4] text-[#0a0a0a]">
                    <tr className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 10:15</td>
                      <td className="px-6 py-4">Node Created: PERSON_01</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">FIR_C014.pdf</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </tr>
                    <tr className="hover:bg-[#f5f5f5]">
                      <td className="px-6 py-4 whitespace-nowrap">2026-09-14 11:30</td>
                      <td className="px-6 py-4">Entity Match Approved</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">User: admin</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </tr>
                    <tr className="hover:bg-[#f5f5f5] bg-red-50/30">
                      <td className="px-6 py-4 whitespace-nowrap text-[#ff3d00]">2026-09-15 09:42</td>
                      <td className="px-6 py-4 text-[#ff3d00] font-bold">Bridge Identified</td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#737373]">System Output</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">VALID</td>
                    </tr>
                  </tbody>"""

tbody_new = """                  <RevealGroup className="divide-y divide-[#d4d4d4] text-[#0a0a0a]" as="tbody">
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
content = content.replace(tbody_old, tbody_new)

with open('src/components/ProductStory.tsx', 'w') as f:
    f.write(content)
