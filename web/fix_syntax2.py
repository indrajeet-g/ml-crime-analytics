with open('src/components/ProductStory.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Linked by Phone</span>" in line:
        lines[i+2] = "                </motion.div>\n"
        break

with open('src/components/ProductStory.tsx', 'w') as f:
    f.writelines(lines)
