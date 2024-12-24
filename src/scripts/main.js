class APIViewer {
    constructor() {
        this.currentVersion = 'v1.0';
        this.versionSelect = document.getElementById('version-select');
        this.categoriesList = document.getElementById('categories-list');
        this.apiContent = document.getElementById('api-content');
        
        this.initEventListeners();
        this.loadCategories();
        this.pathIndex = {}; // Store path mappings
    }

    initEventListeners() {
        this.versionSelect.addEventListener('change', (e) => {
            this.currentVersion = e.target.value;
            this.loadCategories();
        });
    }

    async loadCategories() {
        try {
            const response = await fetch(`${this.currentVersion}/index.json`);
            const categories = await response.json();
            this.renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategories(categories) {
        // Sort categories alphabetically
        const sortedCategories = categories.sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        this.categoriesList.innerHTML = sortedCategories.map(category => `
            <div class="nav-item mb-1" data-name="${category.name}">
                <button class="btn btn-outline-secondary w-100 text-start" data-category="${category.name}">
                    <i class="bi bi-folder me-2"></i>${category.name}
                </button>
            </div>
        `).join('');

        document.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.loadEndpoints(category);
            });
        });
    }

    async loadEndpoints(category) {
        try {
            // Load path index first
            const indexResponse = await fetch(`${this.currentVersion}/${category}/_path_index.json`);
            this.pathIndex = await indexResponse.json();
            
            const response = await fetch(`${this.currentVersion}/${category}/_metadata.json`);
            const data = await response.json();
            this.renderEndpoints(category, data);
        } catch (error) {
            console.error('Error loading endpoints:', error);
        }
    }

    async loadEndpointData(category, hashedPath) {
        try {
            const response = await fetch(`${this.currentVersion}/${category}/${hashedPath}.json`);
            return await response.json();
        } catch (error) {
            console.error('Error loading endpoint data:', error);
            return null;
        }
    }

    renderEndpoints(category, data) {
        const endpoints = Object.entries(this.pathIndex).map(([hash, path]) => ({
            hash,
            path
        }));

        // Update the main content area
        this.apiContent.innerHTML = `
            <div class="category-header mb-4">
                <h2>${category}</h2>
                <p class="text-muted">${data.info?.description || ''}</p>
            </div>
            <div class="endpoints-container">
                ${endpoints.map(endpoint => `
                    <div class="endpoint-row card mb-3" data-hash="${endpoint.hash}">
                        <div class="card-header p-3 d-flex align-items-center justify-content-between endpoint-header" role="button">
                            <div class="d-flex align-items-center flex-grow-1">
                                <div class="endpoint-methods me-3">
                                    <!-- Methods will be dynamically added -->
                                </div>
                                <div class="endpoint-path text-truncate">
                                    ${endpoint.path}
                                </div>
                            </div>
                            <button class="btn btn-sm btn-link text-decoration-none expand-btn">
                                <i class="bi bi-chevron-down"></i>
                            </button>
                        </div>
                        <div class="card-body p-0 endpoint-details collapse">
                            <div class="p-3">
                                Loading...
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Handle endpoint expansion
        document.querySelectorAll('.endpoint-header').forEach(header => {
            header.addEventListener('click', async (e) => {
                const endpointRow = header.closest('.endpoint-row');
                const detailsSection = endpointRow.querySelector('.endpoint-details');
                const expandBtn = header.querySelector('.expand-btn i');
                
                if (!detailsSection.classList.contains('show')) {
                    const hash = endpointRow.dataset.hash;
                    const data = await this.loadEndpointData(category, hash);
                    if (data) {
                        detailsSection.querySelector('div').innerHTML = this.renderEndpointDetails(data);
                    }
                }
                
                detailsSection.classList.toggle('show');
                expandBtn.classList.toggle('bi-chevron-down');
                expandBtn.classList.toggle('bi-chevron-up');
            });
        });

        // Load and display available methods for each endpoint
        endpoints.forEach(async endpoint => {
            const data = await this.loadEndpointData(category, endpoint.hash);
            if (data) {
                const methodsContainer = document.querySelector(`[data-hash="${endpoint.hash}"] .endpoint-methods`);
                const methods = Object.keys(Object.values(data)[0]);
                methodsContainer.innerHTML = methods.map(method => 
                    `<span class="method ${method.toLowerCase()}">${method}</span>`
                ).join('');
            }
        });
    }

    renderMethods(path) {
        const methods = ['get', 'post', 'put', 'patch', 'delete'];
        return `
            <div class="methods">
                ${methods.map(method => `
                    <span class="method ${method}">${method.toUpperCase()}</span>
                `).join('')}
            </div>
        `;
    }

    renderEndpointDetails(data) {
        const [path, pathData] = Object.entries(data)[0];
        return `
            <div class="endpoint-content">
                ${Object.entries(pathData).map(([method, methodData]) => `
                    <div class="method-section mb-4">
                        <div class="method-header d-flex align-items-center gap-2 mb-3">
                            <span class="method ${method.toLowerCase()}">${method}</span>
                            <code class="ms-2">${path}</code>
                        </div>
                        ${methodData.summary ? `
                            <div class="mb-3">
                                <h5>Summary</h5>
                                <p class="text-muted">${methodData.summary}</p>
                            </div>
                        ` : ''}
                        ${methodData.description ? `
                            <div class="mb-3">
                                <h5>Description</h5>
                                <p class="text-muted">${methodData.description}</p>
                            </div>
                        ` : ''}
                        ${this.renderParameters(methodData.parameters)}
                        ${this.renderResponseSchema(methodData.responses)}
                    </div>
                `).join('<hr>')}
            </div>
        `;
    }

    renderParameters(parameters = []) {
        if (!parameters?.length) return '';
        return `
            <div class="mb-4">
                <h5>Parameters</h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>In</th>
                                <th>Type</th>
                                <th>Required</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${parameters.map(param => `
                                <tr>
                                    <td><code>${param.name}</code></td>
                                    <td><span class="badge bg-secondary">${param.in || ''}</span></td>
                                    <td><span class="badge bg-secondary">${param.schema?.type || param.type || ''}</span></td>
                                    <td>${param.required ? '<span class="badge bg-danger">Required</span>' : ''}</td>
                                    <td>${param.description || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderResponseSchema(responses = {}) {
        return `
            <div class="mb-4">
                <h5>Responses</h5>
                <div class="list-group">
                    ${Object.entries(responses).map(([code, response]) => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <code>${code}</code>
                                    ${response.description ? `
                                        <span class="ms-2">${response.description}</span>
                                    ` : ''}
                                </div>
                                ${response.$ref ? `
                                    <span class="text-muted small">
                                        <code>${response.$ref}</code>
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Initialize the viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new APIViewer();
});