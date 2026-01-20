import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if needs fix
    if 'React.createElement' in content and 'import React' not in content:
        # Prepend import
        new_content = "import React from 'react';\n" + content
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
    else:
        # print(f"Skipped {filepath}")
        pass

def scan_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                fix_file(os.path.join(root, file))

scan_dir('src/components')
