// VaxTrack Pure JavaScript Application
class VaxTrackApp {
    constructor() {
        this.vaccinations = [];
        this.filteredVaccinations = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.editingId = null;
        
        this.init();
    }

    init() {
        this.loadVaccinations();
        this.setupEventListeners();
        this.setupFormValidation();
        this.updateStats();
        this.renderVaccinations();
        this.initializeFeatherIcons();
    }

    // Local Storage Management
    loadVaccinations() {
        try {
            const stored = localStorage.getItem('vaxtrack_vaccinations');
            if (stored) {
                this.vaccinations = JSON.parse(stored);
            } else {
                // Initialize with common vaccinations
                this.vaccinations = this.getCommonVaccinations();
                this.saveVaccinations();
            }
            this.filteredVaccinations = [...this.vaccinations];
        } catch (error) {
            console.error('Error loading vaccinations:', error);
            this.vaccinations = this.getCommonVaccinations();
            this.filteredVaccinations = [...this.vaccinations];
            this.saveVaccinations();
        }
    }

    getCommonVaccinations() {
        const today = new Date();
        const futureDate1 = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
        const futureDate2 = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days from now
        const futureDate3 = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days from now
        const pastDate1 = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 year ago
        const pastDate2 = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000)); // 6 months ago
        const pastDate3 = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)); // 3 months ago
        
        return [
            {
                id: 1,
                name: 'COVID-19 Vaccine',
                type: 'COVID-19',
                date: pastDate1.toISOString().split('T')[0],
                status: 'completed',
                notes: 'First dose completed',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Annual Flu Shot',
                type: 'Influenza',
                date: today.toISOString().split('T')[0],
                status: 'pending',
                notes: 'Scheduled at local clinic',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Tetanus Booster',
                type: 'Tetanus',
                date: futureDate1.toISOString().split('T')[0],
                status: 'upcoming',
                notes: 'Due for 10-year booster',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Hepatitis B',
                type: 'Hepatitis B',
                date: pastDate2.toISOString().split('T')[0],
                status: 'completed',
                notes: 'Series completed',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'MMR Vaccine',
                type: 'Measles, Mumps, Rubella',
                date: pastDate3.toISOString().split('T')[0],
                status: 'completed',
                notes: 'Second dose',
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                name: 'Polio Vaccine',
                type: 'Polio',
                date: pastDate1.toISOString().split('T')[0],
                status: 'completed',
                notes: 'Booster dose',
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                name: 'HPV Vaccine',
                type: 'HPV',
                date: futureDate2.toISOString().split('T')[0],
                status: 'upcoming',
                notes: 'Second dose scheduled',
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                name: 'Shingles Vaccine',
                type: 'Shingles',
                date: futureDate3.toISOString().split('T')[0],
                status: 'upcoming',
                notes: 'Age-appropriate vaccination',
                createdAt: new Date().toISOString()
            },
            {
                id: 9,
                name: 'Pneumonia Vaccine',
                type: 'Pneumococcal',
                date: today.toISOString().split('T')[0],
                status: 'pending',
                notes: 'Doctor recommended',
                createdAt: new Date().toISOString()
            },
            {
                id: 10,
                name: 'Meningitis Vaccine',
                type: 'Meningococcal',
                date: pastDate2.toISOString().split('T')[0],
                status: 'completed',
                notes: 'College requirement',
                createdAt: new Date().toISOString()
            },
            {
                id: 11,
                name: 'Chickenpox Vaccine',
                type: 'Varicella',
                date: pastDate1.toISOString().split('T')[0],
                status: 'completed',
                notes: 'Childhood vaccination',
                createdAt: new Date().toISOString()
            },
            {
                id: 12,
                name: 'Travel Vaccine',
                type: 'Yellow Fever',
                date: futureDate1.toISOString().split('T')[0],
                status: 'upcoming',
                notes: 'Required for travel',
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveVaccinations() {
        try {
            localStorage.setItem('vaxtrack_vaccinations', JSON.stringify(this.vaccinations));
            return true;
        } catch (error) {
            console.error('Error saving vaccinations:', error);
            this.showAlert('Error saving data. Please try again.', 'danger');
            return false;
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterVaccinations();
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-buttons .btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update filter
                this.currentFilter = button.dataset.filter;
                this.filterVaccinations();
            });
        });

        // Add vaccination form
        const addForm = document.getElementById('addVaccinationForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddVaccination(e);
            });
        }

        // Edit vaccination form
        const editForm = document.getElementById('editVaccinationForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditVaccination(e);
            });
        }

        // Date constraints based on status
        this.setupDateConstraints();

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    setupDateConstraints() {
        const statusSelects = document.querySelectorAll('select[name="status"]');
        
        statusSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const form = e.target.closest('form');
                const dateInput = form.querySelector('input[name="date"]');
                const today = new Date().toISOString().split('T')[0];
                
                if (e.target.value === 'completed') {
                    dateInput.max = today;
                } else {
                    dateInput.removeAttribute('max');
                }
            });
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            this.clearFieldError(field);
            
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Date validation
        const dateInput = form.querySelector('input[name="date"]');
        const statusSelect = form.querySelector('select[name="status"]');
        
        if (dateInput && statusSelect && dateInput.value && statusSelect.value) {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (statusSelect.value === 'completed' && selectedDate > today) {
                this.showFieldError(dateInput, 'Completed vaccinations cannot be in the future');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Vaccination Management
    handleAddVaccination(e) {
        const formData = new FormData(e.target);
        const vaccination = {
            id: Date.now(), // Simple ID generation
            name: formData.get('name').trim(),
            type: formData.get('type'),
            date: formData.get('date'),
            status: formData.get('status'),
            notes: formData.get('notes').trim(),
            createdAt: new Date().toISOString()
        };

        this.vaccinations.push(vaccination);
        
        if (this.saveVaccinations()) {
            this.showAlert('Vaccination record added successfully!', 'success');
            this.updateStats();
            this.renderVaccinations();
            this.filterVaccinations();
            
            // Reset form and close modal
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVaccinationModal'));
            if (modal) modal.hide();
        }
    }

    handleEditVaccination(e) {
        const formData = new FormData(e.target);
        const vaccinationIndex = this.vaccinations.findIndex(v => v.id === this.editingId);
        
        if (vaccinationIndex !== -1) {
            this.vaccinations[vaccinationIndex] = {
                ...this.vaccinations[vaccinationIndex],
                name: formData.get('name').trim(),
                type: formData.get('type'),
                date: formData.get('date'),
                status: formData.get('status'),
                notes: formData.get('notes').trim(),
                updatedAt: new Date().toISOString()
            };

            if (this.saveVaccinations()) {
                this.showAlert('Vaccination record updated successfully!', 'success');
                this.updateStats();
                this.renderVaccinations();
                this.filterVaccinations();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editVaccinationModal'));
                if (modal) modal.hide();
            }
        }
    }

    editVaccination(id) {
        const vaccination = this.vaccinations.find(v => v.id === id);
        if (!vaccination) return;

        this.editingId = id;
        
        // Populate edit form
        document.getElementById('editVaccinationName').value = vaccination.name;
        document.getElementById('editVaccinationType').value = vaccination.type;
        document.getElementById('editVaccinationDate').value = vaccination.date;
        document.getElementById('editVaccinationStatus').value = vaccination.status;
        document.getElementById('editVaccinationNotes').value = vaccination.notes || '';
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editVaccinationModal'));
        modal.show();
    }

    deleteVaccination(id) {
        if (confirm('Are you sure you want to delete this vaccination record?')) {
            this.vaccinations = this.vaccinations.filter(v => v.id !== id);
            
            if (this.saveVaccinations()) {
                this.showAlert('Vaccination record deleted successfully!', 'success');
                this.updateStats();
                this.renderVaccinations();
                this.filterVaccinations();
            }
        }
    }

    // Statistics and Rendering
    updateStats() {
        const stats = this.calculateStats();
        
        // Animate count updates
        this.animateCount(document.getElementById('completedCount'), stats.completed);
        this.animateCount(document.getElementById('pendingCount'), stats.pending);
        this.animateCount(document.getElementById('upcomingCount'), stats.upcoming);
        this.animateCount(document.getElementById('totalCount'), stats.total);
    }

    calculateStats() {
        const stats = {
            completed: 0,
            pending: 0,
            upcoming: 0,
            total: this.vaccinations.length
        };

        this.vaccinations.forEach(vaccination => {
            switch (vaccination.status) {
                case 'completed':
                    stats.completed++;
                    break;
                case 'pending':
                    stats.pending++;
                    break;
                case 'upcoming':
                    stats.upcoming++;
                    break;
            }
        });

        return stats;
    }

    filterVaccinations() {
        this.filteredVaccinations = this.vaccinations.filter(vaccination => {
            // Status filter
            const statusMatch = this.currentFilter === 'all' || vaccination.status === this.currentFilter;
            
            // Search filter
            const searchContent = `${vaccination.name} ${vaccination.type} ${vaccination.notes || ''}`.toLowerCase();
            const searchMatch = !this.searchTerm || searchContent.includes(this.searchTerm);
            
            return statusMatch && searchMatch;
        });

        this.renderVaccinations();
    }

    renderVaccinations() {
        const container = document.getElementById('vaccinationCards');
        const emptyState = document.getElementById('emptyState');
        
        // Clear existing cards (except empty state)
        const existingCards = container.querySelectorAll('.vaccination-card');
        existingCards.forEach(card => card.remove());

        if (this.vaccinations.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        if (this.filteredVaccinations.length === 0) {
            this.showNoResultsState();
            return;
        }

        // Sort vaccinations by date
        const sortedVaccinations = [...this.filteredVaccinations].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        sortedVaccinations.forEach(vaccination => {
            const cardHTML = this.createVaccinationCard(vaccination);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-initialize feather icons
        this.initializeFeatherIcons();
    }

    createVaccinationCard(vaccination) {
        const statusIcon = this.getStatusIcon(vaccination.status);
        const statusClass = `status-${vaccination.status}`;
        const borderClass = this.getBorderClass(vaccination.status);
        
        return `
            <div class="col-lg-4 col-md-6 mb-4 vaccination-card fade-in" data-status="${vaccination.status}">
                <div class="card vaccination-item h-100 ${borderClass}">
                    <div class="card-header">
                        <span class="badge status-badge ${statusClass}">
                            <i data-feather="${statusIcon}" class="me-1"></i>
                            ${this.capitalizeFirst(vaccination.status)}
                        </span>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                <i data-feather="more-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="vaxTrackApp.editVaccination(${vaccination.id})">
                                        <i data-feather="edit-2" class="me-2"></i>
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-danger" href="#" onclick="vaxTrackApp.deleteVaccination(${vaccination.id})">
                                        <i data-feather="trash-2" class="me-2"></i>
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${vaccination.name}</h5>
                        <p class="card-text">
                            <strong>Type:</strong> ${vaccination.type}<br>
                            <strong>Date:</strong> ${this.formatDate(vaccination.date)}<br>
                            ${vaccination.notes ? `<strong>Notes:</strong> ${vaccination.notes}` : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    showNoResultsState() {
        const container = document.getElementById('vaccinationCards');
        const noResultsHTML = `
            <div class="col-12 vaccination-card">
                <div class="empty-state">
                    <i data-feather="search" class="empty-icon"></i>
                    <h3>No Results Found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                    <button class="btn btn-primary" onclick="vaxTrackApp.clearFilters()">
                        <i data-feather="x" class="me-2"></i>
                        Clear Filters
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', noResultsHTML);
        this.initializeFeatherIcons();
    }

    clearFilters() {
        // Reset search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
        }

        // Reset filter buttons
        const filterButtons = document.querySelectorAll('.filter-buttons .btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0].classList.add('active');
        
        this.currentFilter = 'all';
        this.filterVaccinations();
    }

    // Utility Methods
    getStatusIcon(status) {
        const icons = {
            completed: 'check-circle',
            pending: 'clock',
            upcoming: 'calendar'
        };
        return icons[status] || 'circle';
    }

    getBorderClass(status) {
        const classes = {
            completed: 'border-success',
            pending: 'border-warning',
            upcoming: 'border-info'
        };
        return classes[status] || 'border-secondary';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    animateCount(element, targetValue) {
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = Math.abs(targetValue - currentValue) * 50;
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, duration / Math.abs(targetValue - currentValue));
    }

    showAlert(message, type = 'success') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alertHTML = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.remove();
            }
        }, 5000);
    }

    initializeFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + / to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const bsModal = bootstrap.Modal.getInstance(openModal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        }
        
        // Ctrl/Cmd + N to add new vaccination
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('addVaccinationModal'));
            modal.show();
        }
    }

    // Clear all data and reset to sample vaccinations
    clearAllData() {
        if (confirm('Are you sure you want to clear all vaccination data? This will reset to sample vaccinations.')) {
            localStorage.removeItem('vaxtrack_vaccinations');
            this.vaccinations = this.getCommonVaccinations();
            this.saveVaccinations();
            this.updateStats();
            this.renderVaccinations();
            this.filterVaccinations();
            this.showAlert('All data cleared and reset to sample vaccinations!', 'success');
        }
    }

    // Export data functionality
    exportData() {
        const dataStr = JSON.stringify(this.vaccinations, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vaxtrack-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import data functionality
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.vaccinations = importedData;
                    this.saveVaccinations();
                    this.updateStats();
                    this.renderVaccinations();
                    this.filterVaccinations();
                    this.showAlert('Data imported successfully!', 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                this.showAlert('Error importing data. Please check the file format.', 'danger');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize app when DOM is loaded
let vaxTrackApp;
document.addEventListener('DOMContentLoaded', function() {
    vaxTrackApp = new VaxTrackApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && typeof feather !== 'undefined') {
        feather.replace();
    }
});