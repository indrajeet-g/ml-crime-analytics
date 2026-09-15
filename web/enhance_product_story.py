with open('src/components/ProductStory.tsx', 'r') as f:
    content = f.read()

# Make the step 2 Entity Resolution more colorful
res_old = '<div className="lg:col-span-8 order-2 lg:order-1 bg-[#f5f5f5] border border-[#d4d4d4] p-8 lg:p-12 shadow-sm relative overflow-hidden">'
res_new = '<div className="lg:col-span-8 order-2 lg:order-1 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-8 lg:p-12 shadow-sm relative overflow-hidden">'
content = content.replace(res_old, res_new)

# Make step 4 Network Explorer Dashboard more colorful
dash_old = '<div className="lg:col-span-8 bg-[#f5f5f5] border border-[#d4d4d4] shadow-sm">'
dash_new = '<div className="lg:col-span-8 bg-white border border-[#d4d4d4] shadow-2xl rounded-lg overflow-hidden">'
content = content.replace(dash_old, dash_new)

# Update the abstract SVG network in step 4 to have more vibrant colors
svg_net_old = """                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} x1="30%" y1="30%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} x1="70%" y1="30%" x2="50%" y2="50%" stroke="#ff3d00" strokeWidth="3" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} x1="50%" y1="70%" x2="50%" y2="50%" stroke="#d4d4d4" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }} cx="30%" cy="30%" r="8" fill="#4a7fb5" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} cx="70%" cy="30%" r="10" fill="#ff0000" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} cx="50%" cy="70%" r="8" fill="#e67e22" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="50%" cy="50%" r="12" fill="#d97706" />
                  </svg>"""

svg_net_new = """                  <svg className="absolute inset-0 w-full h-full bg-slate-900" xmlns="http://www.w3.org/2000/svg">
                    {/* Glowing effect definitions */}
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} x1="30%" y1="30%" x2="50%" y2="50%" stroke="#475569" strokeWidth="2" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} x1="70%" y1="30%" x2="50%" y2="50%" stroke="#ff3d00" strokeWidth="4" filter="url(#glow)" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} x1="50%" y1="70%" x2="50%" y2="50%" stroke="#475569" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }} cx="30%" cy="30%" r="12" fill="#38bdf8" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} cx="70%" cy="30%" r="16" fill="#f87171" filter="url(#glow)" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} cx="50%" cy="70%" r="12" fill="#fbbf24" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="50%" cy="50%" r="18" fill="#fb923c" filter="url(#glow)" />
                  </svg>"""
content = content.replace(svg_net_old, svg_net_new)

with open('src/components/ProductStory.tsx', 'w') as f:
    f.write(content)
