#!/usr/bin/env python3
import os
import json
import yaml
import hashlib
from pathlib import Path

def hash_path(path):
    """Create a short, unique filename from a path"""
    return hashlib.md5(path.encode('utf-8')).hexdigest()[:12]

def resolve_ref(ref_path, data):
    """Resolve a $ref pointer in the OpenAPI spec"""
    if not ref_path.startswith('#/'):
        return None
    
    parts = ref_path[2:].split('/')
    current = data
    for part in parts:
        if part in current:
            current = current[part]
        else:
            return None
    return current

def process_parameters(parameters, full_data):
    """Process parameters and resolve any references"""
    processed = []
    for param in parameters:
        if '$ref' in param:
            resolved = resolve_ref(param['$ref'], full_data)
            if resolved:
                processed.append(resolved)
        else:
            processed.append(param)
    return processed

def convert_yaml_to_json(yaml_path, json_dir):
    """Convert YAML file to JSON and split into manageable chunks"""
    with open(yaml_path, 'r') as f:
        data = yaml.safe_load(f)
    
    category_name = Path(yaml_path).stem
    category_dir = Path(json_dir) / category_name
    category_dir.mkdir(parents=True, exist_ok=True)
    
    path_index = {}
    paths_data = data.get('paths', {})
    
    # Save components for reference resolution
    components = data.get('components', {})
    with open(category_dir / '_components.json', 'w') as f:
        json.dump(components, f, indent=2)
    
    for path, path_data in paths_data.items():
        hashed_name = hash_path(path)
        path_file = category_dir / f"{hashed_name}.json"
        
        # Process methods
        processed_path_data = {}
        for method, method_data in path_data.items():
            processed_method = method_data.copy()
            if 'parameters' in processed_method:
                processed_method['parameters'] = process_parameters(
                    processed_method['parameters'], data)
            processed_path_data[method] = processed_method
        
        path_index[hashed_name] = path
        
        with open(path_file, 'w') as f:
            json.dump({path: processed_path_data}, f, indent=2)
    
    with open(category_dir / '_path_index.json', 'w') as f:
        json.dump(path_index, f, indent=2)
    
    data_without_paths = {k:v for k,v in data.items() if k != 'paths'}
    with open(category_dir / '_metadata.json', 'w') as f:
        json.dump(data_without_paths, f, indent=2)

def main():
    base_dir = Path(__file__).parent.parent
    for version in ['v1.0', 'beta']:
        yaml_dir = base_dir / 'openapi' / version
        json_dir = base_dir / 'build' / version
        
        if not yaml_dir.exists():
            print(f"Directory not found: {yaml_dir}")
            continue
            
        for yaml_file in yaml_dir.glob('*.yml'):
            print(f"Converting {yaml_file.name}...")
            convert_yaml_to_json(yaml_file, json_dir)

if __name__ == '__main__':
    main()
