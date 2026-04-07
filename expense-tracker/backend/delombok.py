import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove lombok imports
    content = re.sub(r'import lombok\..*?;\n', '', content)
    
    # Remove lombok annotations
    content = re.sub(r'@Data\n', '', content)
    content = re.sub(r'@Builder\n', '', content)
    content = re.sub(r'@NoArgsConstructor\n', '', content)
    content = re.sub(r'@AllArgsConstructor\n', '', content)
    
    # Extract class name and fields
    class_match = re.search(r'public class (\w+)\s*{', content)
    if not class_match: return
    class_name = class_match.group(1)
    
    fields = re.findall(r'private (\w+(?:<\w+>)?) (\w+);', content)
    
    # Generate getters, setters, constructors
    getters_setters = ""
    for ftype, fname in fields:
        capitalized = fname[0].upper() + fname[1:]
        getter_name = f"get{capitalized}"
        if getter_name in content:
            continue
            
        getters_setters += f"""
    public {ftype} get{capitalized}() {{ return {fname}; }}
    public void set{capitalized}({ftype} {fname}) {{ this.{fname} = {fname}; }}"""
    
    no_args = f"\n    public {class_name}() {{}}"
    
    args = ", ".join([f"{t} {n}" for t, n in fields])
    assignments = "\n        ".join([f"this.{n} = {n};" for t, n in fields])
    all_args = f"\n    public {class_name}({args}) {{\n        {assignments}\n    }}"
    
    if f"public {class_name}()" in content:
        no_args = ""
    if f"public {class_name}({args})" in content:
        all_args = ""
    
    # Insert before the last brace
    insertion = no_args + "\n" + all_args + "\n" + getters_setters + "\n"
    if insertion.strip() == "":
        return
        
    parts = content.rsplit('}', 1)
    if len(parts) == 2:
        content = parts[0] + insertion + "}\n"
    else:
        # Fallback in case no brace is found, though rindex would have failed earlier
        content = content + insertion
    
    with open(filepath, 'w') as f:
        f.write(content)

base_dir = r"c:\Users\Shasindhar Ramesh\OneDrive\Desktop\expense\expense-tracker\backend\src\main\java\com\tracker"
files = [
    r"dto\AuthRequest.java",
    r"dto\AuthResponse.java",
    r"dto\ExpenseDto.java",
    r"dto\RegisterRequest.java",
    r"model\Expense.java",
    r"model\User.java"
]

for f in files:
    process_file(os.path.join(base_dir, f))

print("Delomboked models")
