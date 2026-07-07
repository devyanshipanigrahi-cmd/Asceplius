import os

def main():
    backend_dir = os.path.abspath('backend')
    
    for root, _, files in os.walk(backend_dir):
        if 'venv' in root:
            continue
        for file in files:
            if not file.endswith('.py'):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if 'from backend.' in content or 'import backend.' in content:
                new_content = content.replace('from backend.', 'from ').replace('import backend.', 'import ')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

if __name__ == '__main__':
    main()
