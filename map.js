// Get saved map position or use default
const savedPosition = JSON.parse(localStorage.getItem('mapPosition') || 
    `{"center": [33.853517, -117.470798], "zoom": 15}`);

// Initialize the map with saved position and higher max zoom
const map = L.map('map', {
    maxZoom: 25,  // Increased max zoom level
    maxNativeZoom: 19  // This is the maximum zoom level where tiles are available
}).setView(savedPosition.center, savedPosition.zoom);

// Save map position when it changes
map.on('moveend', function() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    localStorage.setItem('mapPosition', JSON.stringify({
        center: [center.lat, center.lng],
        zoom: zoom
    }));
});

// Add coordinate tracking
const coordDisplay = document.getElementById('coordinates');
map.on('mousemove', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    coordDisplay.textContent = `Coordinates: [${lat}, ${lng}]`;
});

// Create pin SVG icon template
const createPinIcon = (color, showIndicator = false) => {
    return `<svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 7.17 7.29 15.47 11.71 19.71.19.19.44.29.69.29s.5-.1.69-.29C17.71 27.47 24 19.17 24 12c0-6.63-5.37-12-12-12z" 
        fill="${color}"/>
        <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" 
        fill="white"/>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 7.17 7.29 15.47 11.71 19.71.19.19.44.29.69.29s.5-.1.69-.29C17.71 27.47 24 19.17 24 12c0-6.63-5.37-12-12-12zm0 30.59c-3.82-3.82-10-10.71-10-18.59 0-5.51 4.49-10 10-10s10 4.49 10 10c0 7.88-6.18 14.77-10 18.59z" 
        fill="rgba(0,0,0,0.2)"/>
        ${showIndicator ? '<div class="pin-measure-indicator"></div>' : ''}
    </svg>`;
};

// Add map layers with updated zoom settings
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    maxNativeZoom: 19,
    attribution: ''
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 25,
    maxNativeZoom: 19,
    attribution: ''
});

const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    maxNativeZoom: 17,
    attribution: ''
});

const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 25,
    maxNativeZoom: 19,
    attribution: ''
});

const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 25,
    maxNativeZoom: 19,
    attribution: ''
});

const stamenTerrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
    maxZoom: 25,
    maxNativeZoom: 18,
    attribution: ''
});

const stamenWatercolorLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
    maxZoom: 25,
    maxNativeZoom: 16,
    attribution: ''
});

const cyclosmLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 25,
    maxNativeZoom: 20,
    attribution: ''
});

const thunderforestOutdoorsLayer = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
    maxZoom: 25,
    maxNativeZoom: 22,
    attribution: ''
});

const esriWorldStreetLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 25,
    maxNativeZoom: 19,
    attribution: ''
});

// Add high-resolution satellite layer
const esriWorldImageryLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 25,
    maxNativeZoom: 23,
    attribution: ''
});

// Set satellite as default
satelliteLayer.addTo(map);

// Add layer control with all options
const baseLayers = {
    "Satellite (High-Res)": esriWorldImageryLayer,
    "Satellite": satelliteLayer,
    "Street Map": osmLayer,
    "Dark Mode": darkLayer,
    "Light Mode": lightLayer,
    "Topographic": topoLayer,
    "Terrain": stamenTerrainLayer,
    "Watercolor": stamenWatercolorLayer,
    "Cycling": cyclosmLayer,
    "Outdoors": thunderforestOutdoorsLayer,
    "World Street": esriWorldStreetLayer
};

// Create a more organized layer control
const layerControl = L.control.layers(baseLayers, null, { 
    position: 'topright',
    collapsed: true,
    sortLayers: true
}).addTo(map);

// Add a layer preview on hover
const layerPreview = L.DomUtil.create('div', 'layer-preview');
layerPreview.style.cssText = `
    position: absolute;
    width: 150px;
    height: 150px;
    background-size: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 5px;
    display: none;
    z-index: 1000;
`;
document.body.appendChild(layerPreview);

// Add preview images for each layer
const previewImages = {
    "Satellite": "https://i.imgur.com/3pE0M5p.jpg",
    "Street Map": "https://i.imgur.com/QFxqB2H.jpg",
    "Dark Mode": "https://i.imgur.com/xs0JtfY.jpg",
    "Light Mode": "https://i.imgur.com/0PxHqJ4.jpg",
    "Topographic": "https://i.imgur.com/2YVD1pP.jpg",
    "Terrain": "https://i.imgur.com/BrVvQkP.jpg",
    "Watercolor": "https://i.imgur.com/8DI0Bd9.jpg",
    "Cycling": "https://i.imgur.com/CPn3ZQV.jpg",
    "Outdoors": "https://i.imgur.com/Y8Cr0Wa.jpg",
    "World Street": "https://i.imgur.com/QMjEtUl.jpg"
};

// Add hover effect to layer control items
document.querySelector('.leaflet-control-layers').addEventListener('mouseover', function(e) {
    const label = e.target.closest('label');
    if (label) {
        const text = label.textContent.trim();
        const previewUrl = previewImages[text];
        if (previewUrl) {
            layerPreview.style.backgroundImage = `url(${previewUrl})`;
            layerPreview.style.display = 'block';
            
            // Position preview next to the layer control
            const rect = label.getBoundingClientRect();
            layerPreview.style.top = `${rect.top}px`;
            layerPreview.style.left = `${rect.right + 10}px`;
        }
    }
});

document.querySelector('.leaflet-control-layers').addEventListener('mouseout', function(e) {
    if (!e.target.closest('label')) {
        layerPreview.style.display = 'none';
    }
});

// Add styles for the layer control
const style = document.createElement('style');
style.textContent = `
    .leaflet-control-layers {
        border-radius: 8px !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
    }
    .leaflet-control-layers label {
        padding: 8px 10px !important;
        margin: 0 !important;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    .leaflet-control-layers label:hover {
        background-color: #f0f0f0;
    }
    .leaflet-control-layers-list {
        padding: 5px !important;
    }
`;
document.head.appendChild(style);

// Variables to store temporary data
let tempMarker = null;
let markers = [];
let categories = [];
let currentEditingPin = null;
let nextMarkerId = 0;  // Counter for generating unique marker IDs
let confirmCallback = null;
let editingCategoryIndex = null;

// Distance measurement variables
let measureMode = false;
let firstPin = null;
let secondPin = null;  // Add second pin tracking
let measureLine = null;
let measureTooltip = null;

// Add these variables at the top with other variables
let currentPinImages = [];
let currentEditPinImages = [];

// Add these variables for image viewing
let currentImageIndex = 0;
let currentImageSet = [];
let currentZoom = 1;
let isDragging = false;
let startPos = { x: 0, y: 0 };
let currentPos = { x: 0, y: 0 };

// Add this near the top of the file with other variable declarations
let isMenuOpen = false;

// Load saved data from localStorage
function loadSavedData() {
    try {
        categories = JSON.parse(localStorage.getItem('mapCategories') || '[]');
        updateCategoryUI();
        
        const savedPins = JSON.parse(localStorage.getItem('mapPins') || '[]');
        nextMarkerId = Math.max(0, ...savedPins.map(pin => pin.id || 0)) + 1;
        savedPins.forEach(pin => {
            createMarker(pin.lat, pin.lng, pin.title, pin.description, pin.category, pin.customColor, pin.checklist, pin.images, pin.id);
        });
    } catch (error) {
        console.error('Error loading saved data:', error);
        categories = [];
        markers = [];
        nextMarkerId = 0;
    }
}

// Save categories to localStorage
function saveCategories() {
    try {
        localStorage.setItem('mapCategories', JSON.stringify(categories));
        updateCategoryUI();
    } catch (error) {
        console.error('Error saving categories:', error);
    }
}

// Show new folder form
function showNewFolderForm() {
    document.getElementById('folderForm').style.display = 'block';
}

// Hide new folder form
function hideNewFolderForm() {
    document.getElementById('folderForm').style.display = 'none';
}

// Add new category
function addFolder() {
    const nameInput = document.getElementById('newFolderName');
    const name = nameInput.value.trim();
    const color = document.getElementById('newFolderColor').value;
    
    if (name) {
        categories.push({ name, color, visible: true });
        saveCategories();
        nameInput.value = '';
        hideNewFolderForm();
    }
}

// Edit category
function editFolder(index) {
    showEditCategoryDialog(index);
}

// Delete category
function deleteFolder(index) {
    showConfirmDialog('Delete this category and all its pins?', (confirmed) => {
        if (confirmed) {
            // Remove all pins in this category
            markers = markers.filter(marker => {
                if (marker.data.categoryIndex === index) {
                    map.removeLayer(marker.marker);
                    return false;
                }
                return true;
            });
            
            // Update category indices for remaining pins
            markers.forEach(marker => {
                if (marker.data.categoryIndex > index) {
                    marker.data.categoryIndex--;
                }
            });
            
            categories.splice(index, 1);
            saveCategories();
            saveToLocalStorage();
        }
    });
}

// Toggle color input visibility based on category selection
function toggleColorInput(categoryValue, isEdit = false) {
    const colorGroup = document.getElementById(isEdit ? 'editPinColorGroup' : 'pinColorGroup');
    if (categoryValue === "") {
        colorGroup.classList.add('show');
    } else {
        colorGroup.classList.remove('show');
    }
}

// Export category pins as JSON
function exportCategoryPins(categoryIndex) {
    const category = categories[categoryIndex];
    if (!category) return;

    // Get all pins for this category
    const categoryPins = markers
        .filter(m => m.data.categoryIndex === categoryIndex)
        .map(m => ({
            id: m.id,
            lat: m.data.lat,
            lng: m.data.lng,
            title: m.data.title,
            description: m.data.description,
            customColor: m.data.customColor,
            checklist: m.data.checklist,
            images: m.data.images,
            category: {
                name: category.name,
                color: category.color
            }
        }));

    // Create the export object
    const exportData = {
        category: {
            name: category.name,
            color: category.color
        },
        pins: categoryPins,
        exportDate: new Date().toISOString()
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pins.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Update category UI
function updateCategoryUI() {
    // Update folder list
    const folderList = document.getElementById('folderList');
    folderList.innerHTML = '';
    
    categories.forEach((category, index) => {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.innerHTML = `
            <div class="folder-color" style="background-color: ${category.color}"></div>
            <span class="folder-name">${category.name}</span>
            <div class="folder-actions">
                <input type="checkbox" ${category.visible ? 'checked' : ''} 
                       onchange="toggleCategory(${index})" 
                       title="${category.visible ? 'Hide category' : 'Show category'}">
                <button onclick="editFolder(${index})" class="action-btn edit-btn" title="Edit category">Edit</button>
                <button onclick="exportCategoryPins(${index})" class="action-btn export-btn" title="Export category">
                    Export
                </button>
                <button onclick="deleteFolder(${index})" class="action-btn delete-btn" title="Delete category">Delete</button>
            </div>
        `;
        folderList.appendChild(folderItem);
    });
    
    // Update pin form category selects
    const categorySelects = ['pinCategory', 'editPinCategory'];
    categorySelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">No Category</option>' +
                categories.map((cat, index) => 
                    `<option value="${index}">${cat.name}</option>`
                ).join('');
        }
    });
}

// Toggle category visibility
function toggleCategory(index) {
    if (categories[index]) {
        categories[index].visible = !categories[index].visible;
        saveCategories();
        
        markers.forEach(marker => {
            if (marker.data.categoryIndex === index) {
                if (categories[index].visible) {
                    map.addLayer(marker.marker);
                } else {
                    map.removeLayer(marker.marker);
                }
            }
        });
    }
}

// Add checklist item
function addChecklistItem(editMode = false) {
    const checklistDiv = document.getElementById(editMode ? 'editPinChecklist' : 'pinChecklist');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkbox-item';
    itemDiv.innerHTML = `
        <input type="checkbox">
        <input type="text" placeholder="Enter checklist item...">
        <button onclick="this.parentElement.remove()" title="Remove item">×</button>
    `;
    checklistDiv.appendChild(itemDiv);
    
    // Focus the new text input
    const textInput = itemDiv.querySelector('input[type="text"]');
    textInput.focus();
}

function addEditChecklistItem() {
    addChecklistItem(true);
}

// Get checklist items
function getChecklistItems(checklistId) {
    const items = [];
    document.querySelectorAll(`#${checklistId} .checkbox-item`).forEach(item => {
        const text = item.querySelector('input[type="text"]').value.trim();
        if (text) {
            items.push({
                text: text,
                checked: item.querySelector('input[type="checkbox"]').checked
            });
        }
    });
    return items;
}

// Set checklist items
function setChecklistItems(checklistId, items) {
    const checklistDiv = document.getElementById(checklistId);
    checklistDiv.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkbox-item';
        itemDiv.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <input type="text" value="${item.text}">
            <button onclick="this.parentElement.remove()" title="Remove item">×</button>
        `;
        checklistDiv.appendChild(itemDiv);
    });
}

// Create a new marker
function createMarker(lat, lng, title, description, categoryIndex, customColor, checklist = [], images = [], id = null) {
    const markerId = id !== null ? parseInt(id) : nextMarkerId++;
    const color = categoryIndex !== null ? categories[categoryIndex].color : (customColor || '#4CAF50');
    const categoryName = categoryIndex !== null ? categories[categoryIndex].name : 'No Category';
    
    const icon = L.divIcon({
        className: 'custom-pin',
        html: createPinIcon(color),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36]
    });
    
    const marker = L.marker([lat, lng], { icon });
    
    // Store marker data first
    const markerData = {
        id: markerId,
        marker: marker,
        data: {
            lat: lat,
            lng: lng,
            title: title,
            description: description,
            categoryIndex: categoryIndex,
            customColor: customColor,
            checklist: checklist || [],
            images: images || []
        }
    };
    markers.push(markerData);
    
    // Add marker to map if category is visible
    if (categoryIndex === null || categories[categoryIndex].visible) {
        marker.addTo(map);
    }
    
    // Handle marker clicks
    marker.on('click', function(e) {
        // Check if we're in measure mode
        if (measureMode) {
            if (handlePinClick(marker)) {
                return;
            }
        }
        
        // Close any existing popups
        map.closePopup();
        
        // Unbind any existing popup
        marker.unbindPopup();
        
        // Create and show the popup
        try {
            const popup = createPopup(markerData);
            marker.bindPopup(popup);
            marker.openPopup();
        } catch (error) {
            console.error('Error creating popup:', error);
        }
    });
    
    saveToLocalStorage();
    return markerId;
}

// Separate function to create popup content
function createPopup(markerData) {
    const { id, data } = markerData;
    const categoryName = data.categoryIndex !== null ? categories[data.categoryIndex].name : 'No Category';
    
    const popup = L.popup({
        maxWidth: 300,
        className: 'custom-popup',
        closeOnClick: false  // Prevent popup from closing when clicking inside it
    });
    
    const container = document.createElement('div');
    container.className = 'pin-info';
    
    // Build the HTML content
    let content = `
        <h3>${escapeHtml(data.title)}</h3>
        ${data.description ? `<p>${escapeHtml(data.description)}</p>` : ''}
        <p><small>Category: ${escapeHtml(categoryName)}</small></p>
    `;
    
    // Add images if they exist
    if (data.images && data.images.length > 0) {
        content += `
            <div class="pin-images-popup">
                ${data.images.map((img, index) => `
                    <img src="${img}" 
                         onclick="openImageViewer(${id}, ${index})"
                         alt="Pin image ${index + 1}"
                         style="width: 100px; height: 100px; object-fit: cover;">
                `).join('')}
            </div>
        `;
    }
    
    // Add checklist if it exists
    if (data.checklist && data.checklist.length > 0) {
        content += `
            <div class="checkbox-list">
                ${data.checklist.map((item, index) => `
                    <div class="checkbox-item">
                        <input type="checkbox" 
                               ${item.checked ? 'checked' : ''} 
                               onchange="updatePinChecklist(${id}, this, ${index})">
                        <input type="text" value="${escapeHtml(item.text)}" readonly>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Add buttons
    content += `
        <div class="button-group">
            <button onclick="editPin(${id})" class="save-btn">Edit</button>
            <button onclick="deletePin(${id})" class="delete-btn">Delete</button>
        </div>
    `;
    
    container.innerHTML = content;
    popup.setContent(container);
    
    return popup;
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Update checklist item
function updatePinChecklist(markerId, checkbox, itemIndex) {
    const markerData = markers.find(m => m.id === markerId);
    if (!markerData || !markerData.data.checklist) return;
    
    markerData.data.checklist[itemIndex].checked = checkbox.checked;
    saveToLocalStorage();
}

// Update the image viewer function
function openImageViewer(markerId, imageIndex) {
    const markerData = markers.find(m => m.id === markerId);
    if (!markerData || !markerData.data.images || !markerData.data.images.length) {
        console.error('No marker data or images found:', markerId);
        return;
    }
    
    const images = markerData.data.images;
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const counter = document.getElementById('imageCounter');
    
    // Show/hide navigation buttons
    const prevBtn = modal.querySelector('.nav-prev');
    const nextBtn = modal.querySelector('.nav-next');
    prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = images.length > 1 ? 'flex' : 'none';
    
    // Update counter
    if (images.length > 1) {
        counter.textContent = `${imageIndex + 1} / ${images.length}`;
        counter.style.display = 'block';
    } else {
        counter.style.display = 'none';
    }
    
    // Set current image
    currentImageSet = images;
    currentImageIndex = imageIndex;
    
    // Load image
    modalImg.src = images[imageIndex];
    modal.style.display = 'block';
}

// Update close modal function
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Reset image viewer state
    currentImageSet = [];
    currentImageIndex = 0;
    
    // Reset modal image
    const modalImg = document.getElementById('modalImage');
    modalImg.src = '';
    
    // Reset zoom and position
    currentZoom = 1;
    currentPos = { x: 0, y: 0 };
    modalImg.style.transform = 'none';
    
    // Remove any lingering event listeners
    modalImg.onload = null;
}

// Save to localStorage with error handling
function saveToLocalStorage() {
    try {
        const pinsData = markers.map(m => ({
            id: m.id,
            lat: m.data.lat,
            lng: m.data.lng,
            title: m.data.title,
            description: m.data.description,
            category: m.data.categoryIndex,
            customColor: m.data.customColor,
            checklist: m.data.checklist,
            images: m.data.images
        }));
        localStorage.setItem('mapPins', JSON.stringify(pinsData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Edit pin
function editPin(markerId) {
    markerId = parseInt(markerId);
    const markerIndex = markers.findIndex(m => m.id === markerId);
    if (markerIndex === -1) return;
    
    currentEditingPin = markerId;
    const pin = markers[markerIndex].data;
    
    document.getElementById('editPinTitle').value = pin.title;
    document.getElementById('editPinDescription').value = pin.description || '';
    document.getElementById('editPinCategory').value = pin.categoryIndex !== null ? pin.categoryIndex : '';
    document.getElementById('editPinColor').value = pin.customColor || '#4CAF50';
    
    toggleColorInput(pin.categoryIndex !== null ? pin.categoryIndex.toString() : "", true);
    
    setChecklistItems('editPinChecklist', pin.checklist || []);
    
    // Set up images
    currentEditPinImages = [...(pin.images || [])];
    const previewContainer = document.getElementById('editPinImagePreview');
    previewContainer.innerHTML = '';
    currentEditPinImages.forEach(imageData => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        
        const img = document.createElement('img');
        img.src = imageData;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = function() {
            const index = currentEditPinImages.indexOf(imageData);
            if (index > -1) {
                currentEditPinImages.splice(index, 1);
            }
            previewItem.remove();
        };
        
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewContainer.appendChild(previewItem);
    });
    
    document.getElementById('editPinForm').style.display = 'block';
}

// Hide edit pin form
function hideEditPinForm() {
    document.getElementById('editPinForm').style.display = 'none';
    currentEditingPin = null;
}

// Update pin
function updatePin() {
    if (currentEditingPin === null) return;
    
    const markerIndex = markers.findIndex(m => m.id === currentEditingPin);
    if (markerIndex === -1) return;
    
    const title = document.getElementById('editPinTitle').value.trim();
    const description = document.getElementById('editPinDescription').value.trim();
    const categoryIndex = document.getElementById('editPinCategory').value;
    const customColor = document.getElementById('editPinColor').value;
    const checklist = getChecklistItems('editPinChecklist');
    
    if (title) {
        const pin = markers[markerIndex];
        const latlng = pin.marker.getLatLng();
        
        // Remove old marker
        map.removeLayer(pin.marker);
        markers.splice(markerIndex, 1);
        
        // Create new marker with same ID
        createMarker(
            latlng.lat,
            latlng.lng,
            title,
            description,
            categoryIndex === "" ? null : parseInt(categoryIndex),
            categoryIndex === "" ? customColor : null,
            checklist,
            currentEditPinImages,
            currentEditingPin
        );
        
        hideEditPinForm();
    }
}

// Delete pin
function deletePin(markerId) {
    markerId = parseInt(markerId);
    const markerIndex = markers.findIndex(m => m.id === markerId);
    if (markerIndex !== -1) {
        map.removeLayer(markers[markerIndex].marker);
        markers.splice(markerIndex, 1);
        saveToLocalStorage();
    }
}

// Handle map click
map.on('click', function(e) {
    // Don't create pins in measure mode
    if (measureMode) {
        return;
    }

    // Check if any popup is currently open
    const activePopup = document.querySelector('.leaflet-popup');
    if (activePopup) {
        // Just close any open popups and don't create a new pin
        map.closePopup();
        return;
    }

    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    
    const icon = L.divIcon({
        className: 'custom-pin',
        html: createPinIcon('#999999'),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36]
    });
    
    tempMarker = L.marker(e.latlng, { icon }).addTo(map);
    document.getElementById('pinForm').style.display = 'block';
});

// Save pin
function savePin() {
    const title = document.getElementById('pinTitle').value.trim();
    const description = document.getElementById('pinDescription').value.trim();
    const categoryIndex = document.getElementById('pinCategory').value;
    const customColor = document.getElementById('pinColor').value;
    const checklist = getChecklistItems('pinChecklist');
    
    if (title && tempMarker) {
        const latlng = tempMarker.getLatLng();
        
        map.removeLayer(tempMarker);
        tempMarker = null;
        
        createMarker(
            latlng.lat, 
            latlng.lng, 
            title, 
            description, 
            categoryIndex === "" ? null : parseInt(categoryIndex), 
            categoryIndex === "" ? customColor : null,
            checklist,
            currentPinImages
        );
        
        // Clear form
        document.getElementById('pinTitle').value = '';
        document.getElementById('pinDescription').value = '';
        document.getElementById('pinCategory').value = '';
        document.getElementById('pinColor').value = '#4CAF50';
        document.getElementById('pinChecklist').innerHTML = '';
        document.getElementById('pinImagePreview').innerHTML = '';
        currentPinImages = [];
        document.getElementById('pinForm').style.display = 'none';
    }
}

// Cancel pin creation
function cancelPin() {
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
    
    document.getElementById('pinTitle').value = '';
    document.getElementById('pinDescription').value = '';
    document.getElementById('pinCategory').value = '';
    document.getElementById('pinColor').value = '#4CAF50';
    document.getElementById('pinChecklist').innerHTML = '';
    document.getElementById('pinImagePreview').innerHTML = '';
    document.getElementById('pinForm').style.display = 'none';
}

function showConfirmDialog(message, callback) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmDialog').style.display = 'block';
    confirmCallback = callback;
    showOverlay();
}

function handleConfirmAction(confirmed) {
    hideConfirmDialog();
    if (confirmCallback) {
        confirmCallback(confirmed);
        confirmCallback = null;
    }
}

function hideConfirmDialog() {
    document.getElementById('confirmDialog').style.display = 'none';
    hideOverlay();
}

function showEditCategoryDialog(index) {
    editingCategoryIndex = index;
    const category = categories[index];
    document.getElementById('editCategoryName').value = category.name;
    document.getElementById('editCategoryDialog').style.display = 'block';
    showOverlay();
}

function hideEditCategoryDialog() {
    document.getElementById('editCategoryDialog').style.display = 'none';
    hideOverlay();
    editingCategoryIndex = null;
}

function handleEditCategory() {
    const newName = document.getElementById('editCategoryName').value.trim();
    if (newName && editingCategoryIndex !== null) {
        categories[editingCategoryIndex].name = newName;
        saveCategories();
        hideEditCategoryDialog();
    }
}

function showOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);
    overlay.style.display = 'block';
}

function hideOverlay() {
    const overlay = document.querySelector('.dialog-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Load saved data when the page loads
loadSavedData();

// Delete current pin
function deleteCurrentPin() {
    if (currentEditingPin !== null) {
        deletePin(currentEditingPin);
        hideEditPinForm();
    }
}

// Command Line Interface
document.addEventListener('DOMContentLoaded', () => {
    const commandPrompt = document.getElementById('commandPrompt');
    const commandInput = document.getElementById('commandInput');
    const commandHistory = document.getElementById('commandHistory');

    if (!commandPrompt || !commandInput || !commandHistory) {
        console.error('Command prompt elements not found');
        return;
    }

    // Available commands
    const commands = {
        'help': {
            description: 'Show available commands',
            execute: () => {
                addToHistory('Available commands:');
                Object.keys(commands).forEach(cmd => {
                    addToHistory(`  ${cmd}: ${commands[cmd].description}`);
                });
            }
        },
        'clear': {
            description: 'Clear command history',
            execute: () => {
                commandHistory.innerHTML = '';
            }
        },
        'addpin': {
            description: 'Add a new pin at current map center',
            execute: () => {
                const center = map.getCenter();
                showPinForm(center.lat, center.lng);
                hideCommandPrompt();
            }
        },
        'center': {
            description: 'Center map on coordinates (usage: center lat lng)',
            execute: (args) => {
                if (args.length !== 2) {
                    addToHistory('Error: Usage - center latitude longitude');
                    return;
                }
                const lat = parseFloat(args[0]);
                const lng = parseFloat(args[1]);
                if (isNaN(lat) || isNaN(lng)) {
                    addToHistory('Error: Invalid coordinates');
                    return;
                }
                map.setView([lat, lng]);
                addToHistory(`Map centered at [${lat}, ${lng}]`);
            }
        },
        'zoom': {
            description: 'Set zoom level (usage: zoom level)',
            execute: (args) => {
                if (args.length !== 1) {
                    addToHistory('Error: Usage - zoom level (0-18)');
                    return;
                }
                const level = parseInt(args[0]);
                if (isNaN(level) || level < 0 || level > 18) {
                    addToHistory('Error: Invalid zoom level (should be 0-18)');
                    return;
                }
                map.setZoom(level);
                addToHistory(`Zoom level set to ${level}`);
            }
        },
        'coords': {
            description: 'Show current map center coordinates',
            execute: () => {
                const center = map.getCenter();
                addToHistory(`Current center: [${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}]`);
            }
        },
        'measure': {
            description: 'Toggle distance measurement mode between pins',
            execute: () => {
                toggleMeasureMode();
                addToHistory(`Measure mode ${measureMode ? 'enabled' : 'disabled'}`);
                if (measureMode) {
                    addToHistory('Click two pins to measure the distance between them');
                }
            }
        }
    };

    // Handle spacebar to show command prompt
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isAnyPopupVisible()) {
            e.preventDefault();
            showCommandPrompt();
        } else if (e.code === 'Escape' && commandPrompt.style.display !== 'none') {
            hideCommandPrompt();
        }
    });

    // Handle command input
    commandInput.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            const input = commandInput.value.trim().toLowerCase();
            if (input) {
                executeCommand(input);
                commandInput.value = '';
            }
        }
    });

    function showCommandPrompt() {
        commandPrompt.style.display = 'block';
        commandInput.focus();
    }

    function hideCommandPrompt() {
        commandPrompt.style.display = 'none';
    }

    function addToHistory(message) {
        const div = document.createElement('div');
        div.textContent = message;
        commandHistory.appendChild(div);
        commandHistory.scrollTop = commandHistory.scrollHeight;
    }

    function executeCommand(input) {
        addToHistory(`> ${input}`);
        
        const parts = input.split(' ');
        const commandName = parts[0];
        const args = parts.slice(1);

        if (commands.hasOwnProperty(commandName)) {
            commands[commandName].execute(args);
        } else {
            addToHistory('Error: Unknown command. Type "help" for available commands.');
        }
    }
});

function isAnyPopupVisible() {
    return (
        document.getElementById('pinForm').style.display !== 'none' ||
        document.getElementById('folderForm').style.display !== 'none' ||
        document.getElementById('editPinForm').style.display !== 'none' ||
        document.getElementById('confirmDialog').style.display !== 'none' ||
        document.getElementById('editCategoryDialog').style.display !== 'none'
    );
}

// Add drag and drop functionality
document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.add('dragging');
});

document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
        document.body.classList.remove('dragging');
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.remove('dragging');
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(file => file.name.toLowerCase().endsWith('.json'));
    
    for (const file of jsonFiles) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Check if it's a valid export format
            if (data.category && data.pins && Array.isArray(data.pins)) {
                // Add the category
                const categoryIndex = categories.length;
                categories.push({
                    name: data.category.name,
                    color: data.category.color,
                    visible: true
                });
                
                // Add all pins
                data.pins.forEach(pin => {
                    createMarker(
                        pin.lat,
                        pin.lng,
                        pin.title,
                        pin.description,
                        categoryIndex,
                        null,
                        pin.checklist || [],
                        pin.images || []
                    );
                });
                
                saveCategories();
                saveToLocalStorage();
            }
    } catch (error) {
            console.error('Error importing file:', error);
        }
    }
});

// Add measure mode toggle function
function toggleMeasureMode() {
    measureMode = !measureMode;
    
    // Reset measurement state
    if (!measureMode) {
        resetMeasurementPins();
        if (measureLine) {
            map.removeLayer(measureLine);
            measureLine = null;
        }
        if (measureTooltip) {
            map.removeLayer(measureTooltip);
            measureTooltip = null;
        }
    }
    
    // Update cursor and interface
    document.body.style.cursor = measureMode ? 'crosshair' : '';
    document.getElementById('measureBtn').classList.toggle('active', measureMode);
}

// Reset measurement pins
function resetMeasurementPins() {
    if (firstPin) {
        updatePinIcon(firstPin, false);
        firstPin.setZIndexOffset(0);
        firstPin = null;
    }
    if (secondPin) {
        updatePinIcon(secondPin, false);
        secondPin.setZIndexOffset(0);
        secondPin = null;
    }
}

// Update pin icon
function updatePinIcon(marker, showIndicator) {
    const markerData = markers.find(m => m.marker === marker);
    if (markerData) {
        const color = markerData.data.categoryIndex !== null ? 
            categories[markerData.data.categoryIndex].color : 
            (markerData.data.customColor || '#4CAF50');
        
        const icon = L.divIcon({
            className: 'custom-pin',
            html: createPinIcon(color, showIndicator),
            iconSize: [24, 36],
            iconAnchor: [12, 36],
            popupAnchor: [0, -36]
        });
        
        marker.setIcon(icon);
    }
}

// Modify the marker click event to handle measurements
function handlePinClick(marker) {
    if (measureMode) {
        if (!firstPin && !secondPin) {
            // First pin selection
            firstPin = marker;
            updatePinIcon(marker, true);
            marker.setZIndexOffset(1000);
        } else if (firstPin === marker) {
            // Clicking the first pin again - deselect it
            updatePinIcon(marker, false);
            marker.setZIndexOffset(0);
            firstPin = null;
            
            // Remove measurement line and tooltip if they exist
            if (measureLine) {
                map.removeLayer(measureLine);
                measureLine = null;
            }
            if (measureTooltip) {
                map.removeLayer(measureTooltip);
                measureTooltip = null;
            }
        } else if (secondPin === marker) {
            // Clicking the second pin again - deselect it
            updatePinIcon(marker, false);
            marker.setZIndexOffset(0);
            secondPin = null;
            
            // Remove measurement line and tooltip
            if (measureLine) {
                map.removeLayer(measureLine);
                measureLine = null;
            }
            if (measureTooltip) {
                map.removeLayer(measureTooltip);
                measureTooltip = null;
            }
        } else if (!secondPin) {
            // Selecting second pin
            secondPin = marker;
            updatePinIcon(marker, true);
            marker.setZIndexOffset(1000);
            updateMeasurementLine(firstPin, secondPin);
        } else {
            // Attempting to select a third pin - reset and start with this pin
            resetMeasurementPins();
            firstPin = marker;
            updatePinIcon(marker, true);
            marker.setZIndexOffset(1000);
            
            // Remove measurement line and tooltip
            if (measureLine) {
                map.removeLayer(measureLine);
                measureLine = null;
            }
            if (measureTooltip) {
                map.removeLayer(measureTooltip);
                measureTooltip = null;
            }
        }
        return true; // Prevent normal pin click behavior
    }
    return false; // Allow normal pin click behavior
}

// Calculate distance between two points
function calculateDistance(latlng1, latlng2) {
    // Calculate distance in meters
    const meters = map.distance(latlng1, latlng2);
    
    // Convert to feet (1 meter = 3.28084 feet)
    const feet = meters * 3.28084;
    
    // Convert to miles (1 mile = 5280 feet)
    const miles = feet / 5280;
    
    return {
        feet: Math.round(feet),
        miles: miles.toFixed(2)
    };
}

// Update or create measurement line
function updateMeasurementLine(startPin, endPin) {
    const start = startPin.getLatLng();
    const end = endPin.getLatLng();
    
    // Create or update the line
    if (!measureLine) {
        measureLine = L.polyline([start, end], {
            color: '#4CAF50',
            weight: 3,
            dashArray: '5, 10',
            opacity: 0.8
        }).addTo(map);
    } else {
        measureLine.setLatLngs([start, end]);
    }
    
    // Calculate distance
    const distance = calculateDistance(start, end);
    
    // Create or update the tooltip
    const tooltipContent = `
        <div class="measure-tooltip">
            <strong>Distance:</strong><br>
            ${distance.feet.toLocaleString()} ft<br>
            ${distance.miles} mi
        </div>
    `;
    
    if (!measureTooltip) {
        measureTooltip = L.tooltip({
            permanent: true,
            direction: 'top',
            offset: [0, -10],
            className: 'measure-tooltip-wrapper'
        })
        .setContent(tooltipContent)
        .setLatLng([(start.lat + end.lat) / 2, (start.lng + end.lng) / 2])
        .addTo(map);
    } else {
        measureTooltip.setContent(tooltipContent)
            .setLatLng([(start.lat + end.lat) / 2, (start.lng + end.lng) / 2]);
    }
}

// Update navigation function
function navigateImages(direction) {
    if (!currentImageSet || !currentImageSet.length) return;
    
    currentImageIndex = (currentImageIndex + direction + currentImageSet.length) % currentImageSet.length;
    const modalImg = document.getElementById('modalImage');
    const counter = document.getElementById('imageCounter');
    
    modalImg.src = currentImageSet[currentImageIndex];
    counter.textContent = `${currentImageIndex + 1} / ${currentImageSet.length}`;
}

// Update image upload handling
function handleImageUpload(files, previewContainerId, imageArray) {
    const container = document.getElementById(previewContainerId);
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed');
            return;
        }
        
        if (file.size > maxFileSize) {
            alert('Image size should be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            addImageToPreview(imageData, container, imageArray);
        };
        reader.readAsDataURL(file);
    });
}

// Update preview function
function addImageToPreview(imageData, container, imageArray) {
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    
    const img = document.createElement('img');
    img.src = imageData;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = function() {
        const index = imageArray.indexOf(imageData);
        if (index > -1) {
            imageArray.splice(index, 1);
        }
        previewItem.remove();
    };
    
    previewItem.appendChild(img);
    previewItem.appendChild(removeBtn);
    container.appendChild(previewItem);
    
    // Add to image array
    imageArray.push(imageData);
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Add image upload listeners
    document.getElementById('pinImages').addEventListener('change', function(e) {
        handleImageUpload(this.files, 'pinImagePreview', currentPinImages);
    });
    
    document.getElementById('editPinImages').addEventListener('change', function(e) {
        handleImageUpload(this.files, 'editPinImagePreview', currentEditPinImages);
    });
    
    // Add modal click listener
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageModal();
        }
    });
});
