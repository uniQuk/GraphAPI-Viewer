# Microsoft Graph API Viewer

A static site generator for viewing Microsoft Graph API's OpenAPI specifications in a structured and interactive format.

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Setup

1. Install Python dependencies:
```bash
pip install pyyaml requests
```

2. Make scripts executable:
```bash
chmod +x scripts/*.py
```

## Usage

### 1. Download OpenAPI Specifications

This will fetch the latest OpenAPI specifications from Microsoft's repository:

```bash
./scripts/update_openapi.py
```

The specifications will be downloaded to the `openapi` directory, organized in `v1.0` and `beta` folders.

### 2. Convert YAML to JSON

Convert the OpenAPI YAML files to optimized JSON format:

```bash
./scripts/convert_yaml.py
```

This creates processed JSON files in the `build` directory.

### 3. Generate Static Site

Build the static site with all assets:

```bash
./scripts/generate_site.py
```

This will:
- Generate category indexes
- Copy all static assets
- Create the final site structure in the `build` directory

### 4. Serve the Site

You can serve the site locally using Python's built-in HTTP server:

```bash
cd build && python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser.

## Site Features

- 📱 Responsive, compact layout design
- 🎯 High information density endpoint listing
- 🎨 Color-coded HTTP method indicators
- 🔄 Switch between v1.0 and beta API versions
- 📁 Collapsible category sidebar
- ⚡ Lazy loading of endpoint details
- 📊 Row-based endpoint visualization

## Directory Structure

```
.
├── build/                  # Generated static site
├── openapi/               # Downloaded OpenAPI specs
│   ├── v1.0/             # v1.0 API specs
│   └── beta/             # Beta API specs
├── scripts/              # Build scripts
└── src/                  # Source files
    ├── templates/        # HTML templates
    ├── styles/          # CSS files
    └── scripts/         # JavaScript files
```

## Deployment

The `build` directory contains the complete static site that can be deployed to:
- GitHub Pages
- Netlify
- Any static file hosting service
- Local web server (Apache, Nginx, etc.)
