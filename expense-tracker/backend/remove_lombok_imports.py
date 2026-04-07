import os
import re

base_dir = r"c:\Users\Shasindhar Ramesh\OneDrive\Desktop\expense\expense-tracker\backend\src\main\java\com\tracker"

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.java'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r') as file:
                content = file.read()
            
            new_content = re.sub(r'import lombok\..*?;\n', '', content)
            
            if new_content != content:
                with open(filepath, 'w') as file:
                    file.write(new_content)
                print(f"Cleaned {f}")
print("Done")
