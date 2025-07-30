/**
 * OBL Demo - UI Interactions and Map Integration
 * 
 * This file handles all user interactions and map visualization
 * for the OBL demo. It uses Leaflet.js for mapping functionality.
 */

// Global variables
let map;
let beaconMarkers = [];
let targetMarker = null;
let distanceCircles = [];
let flagLine = null;

/**
 * Initialize the demo when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    showAllBeacons();
    // Preset readable 2-beacon code
    presetExample();
});

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
    // Create map centered on Schleswig-Flensburg district
    map = L.map('map').setView([SCHLESWIG_FLENSBURG_CENTER.lat, SCHLESWIG_FLENSBURG_CENTER.lon], SCHLESWIG_FLENSBURG_CENTER.zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add click handler for encoding
    map.on('click', onMapClick);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Decode button
    document.getElementById('decodeBtn').addEventListener('click', decodeButtonClick);
    
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearMap);
    
    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', exampleButtonClick);
    });
    
    // Enter key in input field
    document.getElementById('oblCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            decodeButtonClick();
        }
    });
}

/**
 * Show all beacons on the map with improved visualization
 */
function showAllBeacons() {
    // Group beacons by significance for better visibility control
    const beaconsBySignificance = {
        international: [],
        national: [],
        regional: [],
        local: []
    };
    
    for (const [name, beacon] of Object.entries(BEACONS_SCHLESWIG_FLENSBURG)) {
        beaconsBySignificance[beacon.significance].push([name, beacon]);
    }
    
    // Show beacons with different sizes based on significance
    Object.entries(beaconsBySignificance).forEach(([significance, beacons]) => {
        const priority = SIGNIFICANCE_PRIORITY[significance];
        const radius = priority === 1 ? 12 : priority === 2 ? 10 : priority === 3 ? 8 : 6;
        const labelSize = priority <= 2 ? '12px' : priority === 3 ? '11px' : '10px';
        const showLabel = priority <= 3 || map.getZoom() > 12; // Only show local labels at higher zoom
        
        beacons.forEach(([name, beacon]) => {
            const color = getBeaconColor(beacon);
            
            const marker = L.circleMarker([beacon.lat, beacon.lon], {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            
            // Add popup with comprehensive beacon information
            const popupContent = `
                <div class="beacon-popup">
                    <h3>${beacon.name}</h3>
                    <p><strong>Code:</strong> ${beacon.shortName || name}</p>
                    <p><strong>Category:</strong> ${beacon.category} • <strong>Significance:</strong> ${beacon.significance}</p>
                    <p><strong>Municipality:</strong> ${beacon.municipality}</p>
                    <div class="coordinates">${beacon.lat.toFixed(6)}, ${beacon.lon.toFixed(6)}</div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Prevent beacon clicks from triggering map click encoding
            marker.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
            });
            
            // Add label (conditional based on significance)
            if (showLabel) {
                const label = L.marker([beacon.lat, beacon.lon], {
                    icon: L.divIcon({
                        className: 'beacon-label',
                        html: `<div style="background: ${color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: ${labelSize}; font-weight: bold; white-space: nowrap; border: 1px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${beacon.shortName || name}</div>`,
                        iconSize: [0, 0],
                        iconAnchor: [0, -28]
                    })
                }).addTo(map);
                
                beaconMarkers.push(label);
            }
            
            beaconMarkers.push(marker);
        });
    });
    
    // Update labels based on zoom level
    map.on('zoomend', function() {
        updateBeaconLabels();
    });
}

/**
 * Update beacon label visibility based on zoom level
 */
function updateBeaconLabels() {
    // This would be implemented for dynamic label showing/hiding
    // For now, we keep it simple in the demo
}

/**
 * Preset a readable 2-beacon code example on page load
 */
function presetExample() {
    // Use a clear, readable 2-beacon example
    const exampleCode = '150-FlRathaus-280-Hafenspitze-N';
    
    // Set the input field
    document.getElementById('oblCodeInput').value = exampleCode;
    
    // Decode and visualize it
    const result = decodeLocation(exampleCode);
    
    if (result) {
        // Show decoded location
        targetMarker = L.circleMarker([result.lat, result.lon], {
            radius: 12,
            fillColor: '#28a745',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(map);
        
        targetMarker.bindPopup(`
            <div class="beacon-popup">
                <h3>Example Location</h3>
                <p><strong>${exampleCode}</strong></p>
                <p>Method: ${result.method}</p>
                <p>Accuracy: ${result.accuracy}</p>
                <div class="coordinates">${result.lat.toFixed(6)}, ${result.lon.toFixed(6)}</div>
            </div>
        `);
        
        // Center map on the example location
        map.setView([result.lat, result.lon], 16);
        
        // Visualize the decoding
        visualizeDecoding(result, exampleCode);
        
        // Update status panel
        updateStatus({
            code: exampleCode,
            beacons: result.beacons,
            accuracy: result.accuracy,
            method: result.method,
            areaType: result.areaType || 'example'
        });
    }
}

/**
 * Handle map click events for encoding
 */
function onMapClick(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    
    // Clear previous visualization
    clearVisualization();
    
    // Generate multiple encoding options
    const encodingOptions = generateMultipleEncodingOptions(lat, lon);
    
    // Use the first (best) option for primary display
    const primaryResult = encodingOptions[0];
    
    // Show target marker
    targetMarker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: '#dc3545',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);
    
    targetMarker.bindPopup(`
        <div class="beacon-popup">
            <h3>Target Location</h3>
            <p><strong>${primaryResult.code}</strong></p>
            <p>${primaryResult.description}</p>
            <div class="coordinates">${lat.toFixed(6)}, ${lon.toFixed(6)}</div>
        </div>
    `);
    
    // Visualize the primary encoding
    visualizeEncoding(primaryResult, lat, lon);
    
    // Update status panel with primary result
    updateStatus(primaryResult);
    
    // Show all encoding options
    displayEncodingOptions(encodingOptions, lat, lon);
}

/**
 * Visualize the encoding on the map
 */
function visualizeEncoding(result, targetLat, targetLon) {
    if (result.method === 'error') return;
    
    // Show distance circles and highlight used beacons
    result.beacons.forEach((beaconName, index) => {
        const beacon = getBeacon(beaconName);
        const distance = calculateDistance(targetLat, targetLon, beacon.lat, beacon.lon);
        
        // Add distance circle
        const circle = L.circle([beacon.lat, beacon.lon], {
            radius: distance,
            color: index === 0 ? '#28a745' : index === 1 ? '#007bff' : '#ffc107',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.1
        }).addTo(map);
        
        distanceCircles.push(circle);
        
        // Add distance label
        const midLat = (beacon.lat + targetLat) / 2;
        const midLon = (beacon.lon + targetLon) / 2;
        
        const distanceLabel = L.marker([midLat, midLon], {
            icon: L.divIcon({
                className: 'distance-label',
                html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; border: 1px solid #ccc;">${Math.round(distance)}m</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        distanceCircles.push(distanceLabel);
    });
    
    // For 2-beacon encoding, show flag line
    if (result.method === '2-beacon' && result.beacons.length >= 2) {
        const beacon1 = getBeacon(result.beacons[0]);
        const beacon2 = getBeacon(result.beacons[1]);
        
        // Draw line between beacons
        flagLine = L.polyline([
            [beacon1.lat, beacon1.lon],
            [beacon2.lat, beacon2.lon]
        ], {
            color: '#6c757d',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 5'
        }).addTo(map);
        
        // Add flag indicator
        const centerLat = (beacon1.lat + beacon2.lat) / 2;
        const centerLon = (beacon1.lon + beacon2.lon) / 2;
        
        const parsed = parseOBLCode(result.code);
        const flag = parsed ? parsed.flag : 'N';
        
        const flagMarker = L.marker([centerLat, centerLon], {
            icon: L.divIcon({
                className: 'flag-indicator',
                html: `<div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 50%; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${flag}</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        distanceCircles.push(flagMarker);
    }
}

/**
 * Handle decode button clicks
 */
function decodeButtonClick() {
    const oblCode = document.getElementById('oblCodeInput').value.trim();
    
    if (!oblCode) {
        alert('Please enter an OBL code');
        return;
    }
    
    // Clear previous visualization and hide options
    clearVisualization();
    hideEncodingOptions();
    
    // Decode the location
    const result = decodeLocation(oblCode);
    
    if (!result) {
        alert('Invalid OBL code format or unknown beacons');
        updateStatus({ code: 'ERROR: Invalid code', beacons: [], accuracy: 'N/A', method: 'error' });
        return;
    }
    
    // Show decoded location
    targetMarker = L.circleMarker([result.lat, result.lon], {
        radius: 12,
        fillColor: '#28a745',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);
    
    targetMarker.bindPopup(`
        <div class="beacon-popup">
            <h3>Decoded Location</h3>
            <p><strong>${oblCode}</strong></p>
            <p>Method: ${result.method}</p>
            <p>Accuracy: ${result.accuracy}</p>
            <div class="coordinates">${result.lat.toFixed(6)}, ${result.lon.toFixed(6)}</div>
        </div>
    `);
    
    // Center map on decoded location
    map.setView([result.lat, result.lon], 16);
    
    // Visualize the decoding
    visualizeDecoding(result, oblCode);
    
    // Update status panel
    updateStatus({
        code: oblCode,
        beacons: result.beacons,
        accuracy: result.accuracy,
        method: result.method,
        areaType: result.areaType || 'decoded'
    });
}

/**
 * Visualize the decoding on the map
 */
function visualizeDecoding(result, oblCode) {
    const parsed = parseOBLCode(oblCode);
    if (!parsed) return;
    
    // Show distance circles for each beacon
    parsed.beacons.forEach((beaconData, index) => {
        const beacon = getBeacon(beaconData.name);
        
        // Add distance circle
        const circle = L.circle([beacon.lat, beacon.lon], {
            radius: beaconData.distance,
            color: index === 0 ? '#28a745' : index === 1 ? '#007bff' : '#ffc107',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.1
        }).addTo(map);
        
        distanceCircles.push(circle);
        
        // Add distance label
        const labelLat = beacon.lat + (beaconData.distance / 111000) * 0.7; // Approximate offset
        const labelLon = beacon.lon;
        
        const distanceLabel = L.marker([labelLat, labelLon], {
            icon: L.divIcon({
                className: 'distance-label',
                html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; border: 1px solid #ccc;">${beaconData.distance}m</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        distanceCircles.push(distanceLabel);
    });
    
    // For 2-beacon codes, show flag line
    if (parsed.type === '2-beacon') {
        const beacon1 = getBeacon(parsed.beacons[0].name);
        const beacon2 = getBeacon(parsed.beacons[1].name);
        
        // Draw line between beacons
        flagLine = L.polyline([
            [beacon1.lat, beacon1.lon],
            [beacon2.lat, beacon2.lon]
        ], {
            color: '#6c757d',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 5'
        }).addTo(map);
        
        // Add flag indicator
        const centerLat = (beacon1.lat + beacon2.lat) / 2;
        const centerLon = (beacon1.lon + beacon2.lon) / 2;
        
        const flagMarker = L.marker([centerLat, centerLon], {
            icon: L.divIcon({
                className: 'flag-indicator',
                html: `<div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 50%; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${parsed.flag}</div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        distanceCircles.push(flagMarker);
    }
}

/**
 * Handle example button clicks
 */
function exampleButtonClick(e) {
    const oblCode = e.target.getAttribute('data-code');
    
    // Set input field
    document.getElementById('oblCodeInput').value = oblCode;
    
    // Trigger decode
    decodeButtonClick();
}

/**
 * Clear all visualization from map
 */
function clearVisualization() {
    // Remove target marker
    if (targetMarker) {
        map.removeLayer(targetMarker);
        targetMarker = null;
    }
    
    // Remove distance circles and labels
    distanceCircles.forEach(item => {
        if (map.hasLayer(item)) {
            map.removeLayer(item);
        }
    });
    distanceCircles = [];
    
    // Remove flag line
    if (flagLine) {
        map.removeLayer(flagLine);
        flagLine = null;
    }
}

/**
 * Clear only the visualization elements but preserve the target marker
 */
function clearVisualizationKeepTarget() {
    // Remove distance circles and labels
    distanceCircles.forEach(item => {
        if (map.hasLayer(item)) {
            map.removeLayer(item);
        }
    });
    distanceCircles = [];
    
    // Remove flag line
    if (flagLine) {
        map.removeLayer(flagLine);
        flagLine = null;
    }
}

/**
 * Display multiple encoding options for a location
 * @param {Array} options - Array of encoding options
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 */
function displayEncodingOptions(options, lat, lon) {
    const optionsPanel = document.getElementById('encodingOptions');
    const optionsList = document.getElementById('optionsList');
    
    // Clear previous options
    optionsList.innerHTML = '';
    
    if (options.length === 0 || options[0].method === 'error') {
        optionsPanel.style.display = 'none';
        return;
    }
    
    // Create option items
    options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = `option-item method-${option.method} rounding-${option.roundingLevel}`;
        
        if (index === 0) {
            optionItem.classList.add('primary');
        }
        
        optionItem.innerHTML = `
            <div class="option-code">${option.code}</div>
            <div class="option-details">
                <div class="option-method">${option.description}</div>
                <div class="option-accuracy">${option.beacons.length} beacons • ${option.accuracy}</div>
            </div>
        `;
        
        // Add click handler for copying and visualization
        optionItem.addEventListener('click', () => {
            copyToClipboard(option.code, optionItem);
            
            // Update main status with selected option
            updateStatus(option);
            
            // Re-visualize with selected option (keep target marker)
            clearVisualizationKeepTarget();
            visualizeEncoding(option, lat, lon);
            
            // Update target marker popup
            if (targetMarker) {
                targetMarker.setPopupContent(`
                    <div class="beacon-popup">
                        <h3>Target Location</h3>
                        <p><strong>${option.code}</strong></p>
                        <p>${option.description}</p>
                        <div class="coordinates">${lat.toFixed(6)}, ${lon.toFixed(6)}</div>
                    </div>
                `);
            }
        });
        
        optionsList.appendChild(optionItem);
    });
    
    // Show the options panel with animation
    optionsPanel.style.display = 'block';
    optionsPanel.classList.add('fade-in');
}

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {Element} element - Element to show feedback on
 */
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        // Show copy feedback
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 600);
    }).catch(err => {
        console.warn('Failed to copy to clipboard:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            element.classList.add('copied');
            setTimeout(() => {
                element.classList.remove('copied');
            }, 600);
        } catch (err) {
            console.warn('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    });
}

/**
 * Hide encoding options panel
 */
function hideEncodingOptions() {
    const optionsPanel = document.getElementById('encodingOptions');
    optionsPanel.style.display = 'none';
}

/**
 * Clear all map elements and reset view
 */
function clearMap() {
    clearVisualization();
    hideEncodingOptions();
    
    // Clear input field
    document.getElementById('oblCodeInput').value = '';
    
    // Reset map view to district center
    map.setView([SCHLESWIG_FLENSBURG_CENTER.lat, SCHLESWIG_FLENSBURG_CENTER.lon], SCHLESWIG_FLENSBURG_CENTER.zoom);
    
    // Reset status panel
    updateStatus({
        code: 'Click on the map to generate an OBL code',
        beacons: [],
        accuracy: '',
        method: '',
        areaType: ''
    });
}

/**
 * Update the status panel with enhanced information
 */
function updateStatus(result) {
    const codeElement = document.getElementById('generatedCode');
    const accuracyElement = document.getElementById('accuracy');
    const beaconsElement = document.getElementById('beacons');
    
    codeElement.textContent = result.code;
    
    // Enhanced accuracy display with area type
    if (result.accuracy && result.accuracy !== 'N/A') {
        let accuracyText = `Accuracy: ${result.accuracy}`;
        if (result.areaType) {
            accuracyText += ` (${result.areaType} area)`;
        }
        if (result.method) {
            accuracyText += ` • ${result.method}`;
        }
        accuracyElement.textContent = accuracyText;
    } else {
        accuracyElement.textContent = '';
    }
    
    if (result.beacons && result.beacons.length > 0) {
        // Show short names for compact display
        const shortNames = result.beacons.map(beaconName => {
            const beacon = getBeacon(beaconName);
            return beacon ? (beacon.shortName || beaconName) : beaconName;
        });
        beaconsElement.textContent = `Beacons: ${shortNames.join(', ')}`;
    } else {
        beaconsElement.textContent = '';
    }
    
    // Add visual feedback with area-specific styling
    if (result.method === 'error') {
        codeElement.style.color = '#dc3545';
        codeElement.style.backgroundColor = '#f8d7da';
        codeElement.style.borderColor = '#f5c6cb';
    } else {
        // Color-code by area type
        const areaColors = {
            urban: '#28a745',
            suburban: '#17a2b8', 
            rural: '#6f42c1',
            remote: '#ffc107',
            unknown: '#667eea'
        };
        const color = areaColors[result.areaType] || areaColors.unknown;
        
        codeElement.style.color = color;
        codeElement.style.backgroundColor = '#f8f9ff';
        codeElement.style.borderColor = '#e0e6ed';
    }
}