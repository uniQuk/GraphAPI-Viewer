# Microsoft Graph API Viewer

An interactive viewer for Microsoft Graph API's OpenAPI specifications with dark mode support and intuitive navigation.

🔗 **[Live Demo](https://uniquk.github.io/graphapi-site/)**

> **Note**: This is an independent project and is not affiliated with, officially maintained, or endorsed by Microsoft. The API specifications are sourced from Microsoft's official [msgraph-sdk-powershell](https://github.com/microsoftgraph/msgraph-sdk-powershell/) repository.

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

3. Set up the environment:
```bash
python3 -m venv env
source env/bin/activate
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

## Screenshots

### Dark Mode
![Dark Mode Overview](/screenshots/dark-mode.png)

### Light Mode
![Light Mode Overview](/screenshots/light-mode.png)

### API Endpoint Details
![Endpoint Details](/screenshots/endpoint-details.png)

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

## Data Source

The OpenAPI specifications are fetched from:
- Repository: [microsoftgraph/msgraph-sdk-powershell](https://github.com/microsoftgraph/msgraph-sdk-powershell)
- Path: `/openApiDocs`
- Versions: `v1.0` and `beta`

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
