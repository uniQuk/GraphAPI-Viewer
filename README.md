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

- 📱 Responsive design using Bootstrap
- 🔄 Switch between v1.0 and beta API versions
- 📁 Collapsible category sidebar
- 🎨 Color-coded HTTP methods
- ⚡ Lazy loading of endpoint details
- 📊 Structured display of parameters and responses

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Third-Party Licenses

This project uses the following third-party libraries:

### Bootstrap 5.3.2
- License: MIT
- Copyright: 2011-2023 The Bootstrap Authors
- Website: https://getbootstrap.com/

### Bootstrap Icons 1.11.1
- License: MIT
- Copyright: 2019-2023 The Bootstrap Authors
- Website: https://icons.getbootstrap.com/

### PyYAML
- License: MIT
- Copyright: 2017-2021 Ingy döt Net & Kirill Simonov
- Website: https://pyyaml.org/

### Requests
- License: Apache 2.0
- Copyright: 2019 Kenneth Reitz
- Website: https://requests.readthedocs.io/

For full license texts, see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)
