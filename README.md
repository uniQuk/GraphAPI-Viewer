# Microsoft Graph API Viewer

An interactive viewer for Microsoft Graph API's OpenAPI specifications with dark mode support and intuitive navigation.

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

Fetch the latest OpenAPI specifications from Microsoft's repository:

```bash
./scripts/update_openapi.py
```

The specifications will be downloaded to the `openapi` directory.

### 2. Convert and Process

Convert the OpenAPI YAML files to optimized JSON format:

```bash
./scripts/convert_yaml.py
```

### 3. Generate Site

Build the static site:

```bash
./scripts/generate_site.py
```

### 4. Run Locally

```bash
cd build && python3 -m http.server 8000
```

Visit http://localhost:8000 in your browser.

## Features

- 🌓 Dark/Light mode with system preference support
- 📱 Responsive design using Bootstrap 5
- 🔄 Switch between v1.0 and beta API versions
- 🎨 Color-coded HTTP methods for easy identification
- ⚡ Lazy loading of endpoint details
- 📊 Structured parameter and response displays
- 🔍 Clear endpoint path organization with:
  - Logical path segmentation
  - Method grouping
  - Tag-based categorization
  - Endpoint summaries
- 💾 Persistent theme preferences
- 📱 Mobile-friendly interface

## Project Structure

```
.
├── build/                # Generated site
├── openapi/             # API specifications
├── scripts/             # Build scripts
└── src/                 # Source files
    ├── templates/       # HTML templates
    ├── styles/          # CSS files
    └── scripts/         # JavaScript files
```

## Deployment

The `build` directory can be deployed to:
- GitHub Pages
- Netlify
- Any static hosting service
- Local web servers

## Tech Stack

- **Bootstrap 5.3.2**: UI framework
- **Bootstrap Icons 1.11.1**: Icon set
- **PyYAML**: YAML processing
- **Requests**: HTTP client

## License

MIT License - see [LICENSE](LICENSE)

For third-party licenses, see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)
