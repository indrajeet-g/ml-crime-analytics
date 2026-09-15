import re

with open('src/components/ProductStory.tsx', 'r') as f:
    content = f.read()

import_old = 'import { Network, Database, Eye, ShieldCheck, GitMerge } from "lucide-react";'
import_new = 'import { Network, Database, Eye, ShieldCheck, GitMerge, Map } from "lucide-react";'
content = content.replace(import_old, import_new)

step6_html = """
          {/* STEP 6: TIMELINE & GEOSPATIAL */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 bg-blue-50 border border-blue-100 p-8 shadow-sm relative overflow-hidden order-2 lg:order-1">
              <div className="w-full h-64 bg-white border border-blue-200 rounded flex flex-col relative overflow-hidden shadow-lg">
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                  {/* Fake Map */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M 0 50 Q 100 20 200 60 T 400 30 L 400 200 L 0 200 Z" fill="#e0f2fe" />
                    <path d="M 100 100 L 250 80 L 300 150" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="6 6" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} cx="100" cy="100" r="8" fill="#ef4444" />
                    <motion.circle animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} cx="100" cy="100" r="16" fill="none" stroke="#ef4444" strokeWidth="2" />
                    
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} cx="250" cy="80" r="8" fill="#3b82f6" />
                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} cx="300" cy="150" r="8" fill="#f59e0b" />
                  </svg>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-bold shadow-sm rounded border border-slate-200 text-slate-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>Incident Origin
                  </div>
                </div>
                <div className="h-16 bg-slate-800 border-t border-slate-700 flex items-center px-4 gap-4">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full relative">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "70%" }} transition={{ duration: 2, ease: "linear" }} className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" />
                    <div className="absolute top-1/2 left-[20%] w-3 h-3 bg-red-500 rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-blue-400 rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 left-[70%] w-3 h-3 bg-yellow-400 rounded-full -translate-y-1/2" />
                  </div>
                  <span className="text-white font-[family-name:var(--font-mono)] text-[10px]">TIME MAPPING</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <Map size={20} className="text-[#3b82f6]" />
                <h3 className="text-2xl font-bold tracking-tight">Geospatial & Time tracking.</h3>
              </div>
              <p className="text-base text-[#737373] leading-relaxed">
                Understand the "where" and "when". NEXUS automatically plots incident locations and entity movements across an interactive map and timeline, exposing hidden geographical patterns.
              </p>
            </div>
          </Reveal>
"""
content = content.replace('        </div>\n      </Container>\n    </Section>', step6_html + '\n        </div>\n      </Container>\n    </Section>')

with open('src/components/ProductStory.tsx', 'w') as f:
    f.write(content)
