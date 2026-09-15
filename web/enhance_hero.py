with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Change the background and text colors to dark theme
content = content.replace('className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20"',
                          'className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20 bg-[#0a0a0a] text-white"')

# Add a subtle grid/radial pattern
pattern = """    <section
      id="top"
      className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20 bg-[#0a0a0a] text-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />"""
content = content.replace('    <section\n      id="top"\n      className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16 md:pb-20 bg-[#0a0a0a] text-white"\n    >', pattern)

# Update text colors in Hero
content = content.replace('text-[#0a0a0a]', 'text-white')
content = content.replace('text-[#d4d4d4]', 'text-[#333333]') # Darker divider
content = content.replace('text-[#737373]', 'text-[#a3a3a3]') # Lighter gray for subtext
content = content.replace('bg-[#d4d4d4]', 'bg-[#333333]') # Darker divider line

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
