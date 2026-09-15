with open('src/components/ProductStory.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "This vehicle connects two separate cases and is directly linked to a primary target." in line:
        lines[i+2] = "                </div>\n"
        break

with open('src/components/ProductStory.tsx', 'w') as f:
    f.writelines(lines)
