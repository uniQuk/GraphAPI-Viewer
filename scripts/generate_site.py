#!/usr/bin/env python3
import os
import json
import shutil
from pathlib import Path

def generate_category_index(version_dir):
    """Generate index of all categories in a version"""
    categories = []
    for category_dir in version_dir.glob('*'):
        if category_dir.is_dir() and not category_dir.name.startswith('_'):
            metadata_file = category_dir / '_metadata.json'
            if metadata_file.exists():
                with open(metadata_file) as f:
                    metadata = json.load(f)
                categories.append({
                    'name': category_dir.name,
                    'info': metadata.get('info', {})
                })
    
    with open(version_dir / 'index.json', 'w') as f:
        json.dump(categories, f, indent=2)

def copy_static_assets():
    """Copy static assets to build directory"""
    base_dir = Path(__file__).parent.parent
    
    # Copy CSS
    shutil.copy2(
        base_dir / 'src/styles/style.css',
        base_dir / 'build/assets/css/style.css'
    )
    
    # Copy JS
    shutil.copy2(
        base_dir / 'src/scripts/main.js',
        base_dir / 'build/assets/js/main.js'
    )
    
    # Copy main HTML
    shutil.copy2(
        base_dir / 'src/templates/index.html',
        base_dir / 'build/index.html'
    )

def main():
    base_dir = Path(__file__).parent.parent
    build_dir = base_dir / 'build'

    # Generate category indexes
    for version in ['v1.0', 'beta']:
        version_dir = build_dir / version
        if version_dir.exists():
            generate_category_index(version_dir)
    
    copy_static_assets()
    print("Static site generated successfully!")

if __name__ == '__main__':
    main()