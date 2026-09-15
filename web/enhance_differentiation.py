with open('src/components/Differentiation.tsx', 'r') as f:
    content = f.read()

# Add SVG illustrations to the EDGES array
old_edges = """const EDGES: Edge[] = [
  {
    title: "Built for Indian records",
    body:
      "The system is trained to read Indian names, addresses, phone numbers, and vehicle formats correctly from the start. It understands mixed languages and different spellings of the same name.",
    note: "Reads Indian phone, vehicle, and bank account formats natively",
  },
  {
    title: "Clear evidence for every link",
    body:
      "Every connection shows exactly which record it came from. The platform is designed to produce evidence that holds up in court, not just helpful hints for analysts.",
    note: "Every connection stores its source record ID and match confidence",
  },
  {
    title: "Built-in security trail",
    body:
      "Security tracking happens the second a file is uploaded. It creates an unbroken record of who uploaded the file, what changes were made, and which matches were approved.",
    note: "Automatically logs every action to a secure, tamper-proof record",
  },
  {
    title: "Runs completely offline",
    body:
      "The software can run entirely on your own secure servers without an internet connection. It does not send your sensitive case data to outside companies.",
    note: "Can run locally on secure department hardware without internet access",
  },
];"""

new_edges = """const EDGES: (Edge & { icon: React.ReactNode })[] = [
  {
    title: "Built for Indian records",
    body: "The system is trained to read Indian names, addresses, phone numbers, and vehicle formats correctly from the start. It understands mixed languages and different spellings of the same name.",
    note: "Reads Indian phone, vehicle, and bank account formats natively",
    icon: (
      <svg className="w-full h-32 mb-6" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="160" height="60" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="40" y="40" width="30" height="30" rx="15" fill="#bae6fd" />
        <path d="M55 45a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H48z" fill="#0284c7" />
        <rect x="85" y="40" width="60" height="6" rx="3" fill="#94a3b8" />
        <rect x="85" y="52" width="40" height="6" rx="3" fill="#cbd5e1" />
        <rect x="85" y="64" width="75" height="6" rx="3" fill="#ff3d00" opacity="0.8" />
      </svg>
    )
  },
  {
    title: "Clear evidence for every link",
    body: "Every connection shows exactly which record it came from. The platform is designed to produce evidence that holds up in court, not just helpful hints for analysts.",
    note: "Every connection stores its source record ID and match confidence",
    icon: (
      <svg className="w-full h-32 mb-6" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="16" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="150" cy="30" r="12" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
        <circle cx="150" cy="70" r="12" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
        <path d="M66 50 C100 50, 100 30, 138 30" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M66 50 C100 50, 100 70, 138 70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="90" y="20" width="24" height="12" rx="2" fill="#ff3d00" />
        <text x="102" y="29" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">100%</text>
      </svg>
    )
  },
  {
    title: "Built-in security trail",
    body: "Security tracking happens the second a file is uploaded. It creates an unbroken record of who uploaded the file, what changes were made, and which matches were approved.",
    note: "Automatically logs every action to a secure, tamper-proof record",
    icon: (
      <svg className="w-full h-32 mb-6" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="40" width="40" height="40" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <rect x="80" y="40" width="40" height="40" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <rect x="130" y="40" width="40" height="40" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <path d="M70 60h10M120 60h10" stroke="#ff3d00" strokeWidth="2" />
        <path d="M40 50h20M90 50h20M140 50h20" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M40 60h10M90 60h10M140 60h10" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M40 70h15M90 70h15M140 70h15" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M45 25 L50 20 L55 25 M50 20 L50 40" stroke="#10b981" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: "Runs completely offline",
    body: "The software can run entirely on your own secure servers without an internet connection. It does not send your sensitive case data to outside companies.",
    note: "Can run locally on secure department hardware without internet access",
    icon: (
      <svg className="w-full h-32 mb-6" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="20" width="60" height="60" rx="4" fill="#334155" />
        <rect x="80" y="30" width="40" height="8" rx="2" fill="#1e293b" />
        <rect x="80" y="45" width="40" height="8" rx="2" fill="#1e293b" />
        <rect x="80" y="60" width="40" height="8" rx="2" fill="#1e293b" />
        <circle cx="85" cy="34" r="2" fill="#10b981" />
        <circle cx="85" cy="49" r="2" fill="#10b981" />
        <circle cx="85" cy="64" r="2" fill="#ef4444" />
        <path d="M40 50 Q 100 0 160 50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        <path d="M90 10 L110 10" stroke="#ef4444" strokeWidth="3" />
        <path d="M95 5 L105 15 M95 15 L105 5" stroke="#ef4444" strokeWidth="2" />
      </svg>
    )
  },
];"""
content = content.replace(old_edges, new_edges)

# Insert the icon into the component render
old_h3 = """                <h3 className={`${mono} text-xl track-tight text-[--color-foreground] md:text-2xl`}>
                  {edge.title}
                </h3>"""
new_h3 = """                {edge.icon}
                <h3 className={`${mono} text-xl track-tight text-[--color-foreground] md:text-2xl`}>
                  {edge.title}
                </h3>"""
content = content.replace(old_h3, new_h3)

with open('src/components/Differentiation.tsx', 'w') as f:
    f.write(content)
