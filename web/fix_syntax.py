with open('src/components/ProductStory.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</motion.div>" in line and "</div>" in lines[i+1] and 'lg:col-span-4' in lines[i+3]:
        # This is the broken part. The </motion.div> was for the Fake Sidebar which is wrong.
        lines[i] = "                </div>\n"
        break

# And I need to close the motion.div for the SHARED_VEHICLE
for i, line in enumerate(lines):
    if "SHARED_VEHICLE" in line:
        lines[i+1] = "                  </motion.div>\n"
        break

with open('src/components/ProductStory.tsx', 'w') as f:
    f.writelines(lines)
