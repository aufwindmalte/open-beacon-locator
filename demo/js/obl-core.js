/**
 * OBL Core - Encoding and Decoding Functions
 * 
 * This is a prototype implementation focusing on concept demonstration
 * rather than algorithmic perfection. Production code would need:
 * - Better error handling
 * - Optimized algorithms
 * - More robust intersection calculations
 * - Support for height encoding
 * 
 * Mathematical foundation: Trilateration using circle intersections
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point  
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Find intersection points of two circles
 * @param {number} x1, y1 - Center of first circle
 * @param {number} r1 - Radius of first circle
 * @param {number} x2, y2 - Center of second circle  
 * @param {number} r2 - Radius of second circle
 * @returns {Array} Array of intersection points [{x, y}, {x, y}] or empty if no intersection
 */
function findCircleIntersections(x1, y1, r1, x2, y2, r2) {
    // Distance between circle centers
    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    // No intersection cases
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) {
        return [];
    }
    
    // Calculate intersection points
    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(r1 ** 2 - a ** 2);
    
    const px = x1 + a * (x2 - x1) / d;
    const py = y1 + a * (y2 - y1) / d;
    
    const intersection1 = {
        x: px + h * (y2 - y1) / d,
        y: py - h * (x2 - x1) / d
    };
    
    const intersection2 = {
        x: px - h * (y2 - y1) / d,
        y: py + h * (x2 - x1) / d
    };
    
    return [intersection1, intersection2];
}

/**
 * Convert lat/lon to simple x/y coordinates for circle calculations
 * This is a simplified projection suitable for small areas like Flensburg
 */
function latLonToXY(lat, lon, centerLat, centerLon) {
    const R = 6371000; // Earth radius in meters
    const x = R * toRadians(lon - centerLon) * Math.cos(toRadians(centerLat));
    const y = R * toRadians(lat - centerLat);
    return { x, y };
}

/**
 * Convert x/y coordinates back to lat/lon
 */
function xyToLatLon(x, y, centerLat, centerLon) {
    const R = 6371000; // Earth radius in meters
    const lat = centerLat + toDegrees(y / R);
    const lon = centerLon + toDegrees(x / (R * Math.cos(toRadians(centerLat))));
    return { lat, lon };
}

/**
 * Find the N nearest beacons to a given location with improved selection
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @param {number} count - Number of beacons to return
 * @returns {Array} Array of {name, beacon, distance} objects
 */
function findNearestBeacons(lat, lon, count = 3) {
    const distances = [];
    
    // Use the comprehensive beacon database
    for (const [name, beacon] of Object.entries(BEACONS_SCHLESWIG_FLENSBURG)) {
        const distance = calculateDistance(lat, lon, beacon.lat, beacon.lon);
        distances.push({ name, beacon, distance });
    }
    
    // Sort by distance, but prefer higher significance beacons for similar distances
    distances.sort((a, b) => {
        const distanceDiff = a.distance - b.distance;
        
        // If distances are very close (within 500m), prefer higher significance
        if (Math.abs(distanceDiff) < 500) {
            const aPriority = SIGNIFICANCE_PRIORITY[a.beacon.significance] || 5;
            const bPriority = SIGNIFICANCE_PRIORITY[b.beacon.significance] || 5;
            return aPriority - bPriority;
        }
        
        return distanceDiff;
    });
    
    return distances.slice(0, count);
}

/**
 * Find well-distributed beacons for optimal 3-beacon trilateration
 * Avoids selecting beacons that are too close to each other
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @param {number} count - Number of beacons to find
 * @returns {Array} Well-distributed beacons
 */
function findWellDistributedBeacons(lat, lon, count = 3) {
    const allBeacons = [];
    
    // Get all beacons with distances
    for (const [name, beacon] of Object.entries(BEACONS_SCHLESWIG_FLENSBURG)) {
        const distance = calculateDistance(lat, lon, beacon.lat, beacon.lon);
        allBeacons.push({ name, beacon, distance });
    }
    
    // Sort by distance first
    allBeacons.sort((a, b) => a.distance - b.distance);
    
    if (count < 2) {
        return allBeacons.slice(0, count);
    }
    
    // For 2+ beacons, use geometric quality optimization with stricter constraints
    const selectedBeacons = [];
    const minSeparationDistance = 1500; // Increased minimum distance between beacons for better distribution
    const minAngularSeparation = 45; // Increased angular separation to avoid poor geometries
    
    // Start with the closest beacon, but check if there are significantly closer alternatives
    selectedBeacons.push(allBeacons[0]);
    
    // Find remaining beacons with good geometric distribution
    for (let i = 1; i < allBeacons.length && selectedBeacons.length < count; i++) {
        const candidate = allBeacons[i];
        let isGoodCandidate = true;
        
        // Check distance separation from already selected beacons
        for (const selected of selectedBeacons) {
            const separation = calculateDistance(
                candidate.beacon.lat, candidate.beacon.lon,
                selected.beacon.lat, selected.beacon.lon
            );
            
            if (separation < minSeparationDistance) {
                isGoodCandidate = false;
                break;
            }
        }
        
        // Additional check: avoid beacons that would create very distant codes compared to alternatives
        if (isGoodCandidate && candidate.distance > 1000) {
            // Look for closer beacons that might provide better distribution
            for (let j = 1; j < i; j++) {
                const alternative = allBeacons[j];
                if (alternative.distance < candidate.distance * 0.7) { // Alternative is significantly closer
                    // Check if this alternative would also meet distribution requirements
                    let altMeetsRequirements = true;
                    for (const selected of selectedBeacons) {
                        const separation = calculateDistance(
                            alternative.beacon.lat, alternative.beacon.lon,
                            selected.beacon.lat, selected.beacon.lon
                        );
                        if (separation < minSeparationDistance) {
                            altMeetsRequirements = false;
                            break;
                        }
                    }
                    if (altMeetsRequirements) {
                        isGoodCandidate = false; // Prefer the closer alternative
                        break;
                    }
                }
            }
        }
        
        // Check angular separation for trilateration quality
        if (isGoodCandidate && selectedBeacons.length >= 1) {
            const angles = [];
            for (const selected of selectedBeacons) {
                const angle = calculateBearing(lat, lon, selected.beacon.lat, selected.beacon.lon);
                angles.push(angle);
            }
            
            const candidateAngle = calculateBearing(lat, lon, candidate.beacon.lat, candidate.beacon.lon);
            
            // Check if candidate angle is well separated from existing angles
            for (const existingAngle of angles) {
                const angleDiff = Math.min(
                    Math.abs(candidateAngle - existingAngle),
                    360 - Math.abs(candidateAngle - existingAngle)
                );
                
                if (angleDiff < minAngularSeparation) {
                    isGoodCandidate = false;
                    break;
                }
            }
        }
        
        if (isGoodCandidate) {
            selectedBeacons.push(candidate);
        }
    }
    
    // If we couldn't find enough well-distributed beacons, use adaptive fallback strategy
    if (selectedBeacons.length < count) {
        // Try multiple strategies in order of preference
        const fallbackStrategies = [
            { minSep: 800, minAngle: 30, description: "reduced constraints" },
            { minSep: 500, minAngle: 20, description: "minimal constraints" },
            { minSep: 200, minAngle: 15, description: "emergency fallback" }
        ];
        
        for (const strategy of fallbackStrategies) {
            if (selectedBeacons.length >= count) break;
            
            for (let i = 1; i < allBeacons.length && selectedBeacons.length < count; i++) {
                const candidate = allBeacons[i];
                let isGoodCandidate = true;
                
                // Skip if already selected
                if (selectedBeacons.find(s => s.name === candidate.name)) {
                    continue;
                }
                
                // Check distance separation with current strategy
                for (const selected of selectedBeacons) {
                    const separation = calculateDistance(
                        candidate.beacon.lat, candidate.beacon.lon,
                        selected.beacon.lat, selected.beacon.lon
                    );
                    
                    if (separation < strategy.minSep) {
                        isGoodCandidate = false;
                        break;
                    }
                }
                
                // Check angular separation if we have more than one beacon already
                if (isGoodCandidate && selectedBeacons.length >= 1) {
                    const angles = [];
                    for (const selected of selectedBeacons) {
                        const angle = calculateBearing(lat, lon, selected.beacon.lat, selected.beacon.lon);
                        angles.push(angle);
                    }
                    
                    const candidateAngle = calculateBearing(lat, lon, candidate.beacon.lat, candidate.beacon.lon);
                    
                    // Check angular separation with strategy requirements
                    for (const existingAngle of angles) {
                        const angleDiff = Math.min(
                            Math.abs(candidateAngle - existingAngle),
                            360 - Math.abs(candidateAngle - existingAngle)
                        );
                        
                        if (angleDiff < strategy.minAngle) {
                            isGoodCandidate = false;
                            break;
                        }
                    }
                }
                
                if (isGoodCandidate) {
                    selectedBeacons.push(candidate);
                }
            }
        }
        
        // If still not enough, just take the closest remaining beacons (but avoid duplicates)
        while (selectedBeacons.length < count && selectedBeacons.length < allBeacons.length) {
            for (const beacon of allBeacons) {
                if (!selectedBeacons.find(s => s.name === beacon.name)) {
                    selectedBeacons.push(beacon);
                    break;
                }
            }
        }
    }
    
    return selectedBeacons;
}

/**
 * Calculate bearing between two points
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {number} Bearing in degrees (0-360)
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    const bearing = toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * Determine appropriate distance scaling based on beacon density and area type
 * @param {Array} nearestBeacons - Array of nearest beacons with distances
 * @returns {Object} Scaling information
 */
function getDistanceScaling(nearestBeacons) {
    if (nearestBeacons.length === 0) return { maxDigits: 5, type: 'remote' };
    
    const closestDistance = nearestBeacons[0].distance;
    const averageDistance = nearestBeacons.slice(0, 3).reduce((sum, b) => sum + b.distance, 0) / Math.min(3, nearestBeacons.length);
    
    // Determine area type based on beacon density - but allow longer distances to avoid artificial capping
    if (averageDistance < 1000) {
        // Urban area - closer beacons, 3-digit distances preferred, but allow 4-digit when needed
        return { maxDigits: 4, type: 'urban', maxDistance: 2999 };
    } else if (averageDistance < 3000) {
        // Suburban area - 4-digit distances
        return { maxDigits: 4, type: 'suburban', maxDistance: 9999 };
    } else if (averageDistance < 8000) {
        // Rural area - 4-digit distances, some 5-digit
        return { maxDigits: 4, type: 'rural', maxDistance: 9999 };
    } else {
        // Remote area - 5-digit distances
        return { maxDigits: 5, type: 'remote', maxDistance: 99999 };
    }
}

/**
 * Determine intersection selector flag between two points
 * Selects which of the two circle intersection points to use
 * @param {Object} point1 - {lat, lon}
 * @param {Object} point2 - {lat, lon}
 * @param {Object} target - {lat, lon} 
 * @returns {string} N, S, E, or W (intersection selector flag)
 */
function getIntersectionSelector(point1, point2, target) {
    // Calculate the midpoint of the line between the two beacons
    const midLat = (point1.lat + point2.lat) / 2;
    const midLon = (point1.lon + point2.lon) / 2;
    
    // Determine the primary orientation of the line between beacons
    const dx = Math.abs(point2.lon - point1.lon);
    const dy = Math.abs(point2.lat - point1.lat);
    
    if (dx > dy) {
        // Line is more horizontal, use N/S flags to select intersection
        // Check if target is north or south of the midpoint
        return target.lat > midLat ? 'N' : 'S';
    } else {
        // Line is more vertical, use E/W flags to select intersection
        // Check if target is east or west of the midpoint
        return target.lon > midLon ? 'E' : 'W';
    }
}

/**
 * Calculate geometric accuracy based on actual circle intersection geometry
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @param {Array} beacons - Array of beacon objects with distances
 * @param {Array} actualDistances - Array of actual (unrounded) distances
 * @param {string} method - '2-beacon' or '3-beacon'
 * @returns {string} Accuracy estimate (e.g., "±12m")
 */
function calculateGeometricAccuracy(lat, lon, beacons, actualDistances, method) {
    if (beacons.length < 2 || actualDistances.length < 2) {
        return '±?m';
    }
    
    let totalError = 0;
    let errorComponents = [];
    
    // 1. Distance rounding error
    for (let i = 0; i < beacons.length; i++) {
        const roundedDistance = beacons[i].distance || actualDistances[i];
        const actualDistance = actualDistances[i];
        const roundingError = Math.abs(roundedDistance - actualDistance);
        errorComponents.push(roundingError);
    }
    
    // 2. Geometric dilution of precision (GDOP) factor
    let gdopFactor = 1.0;
    
    if (method === '2-beacon' && beacons.length >= 2) {
        // For 2-beacon: accuracy depends on intersection angle
        const beacon1 = beacons[0];
        const beacon2 = beacons[1];
        
        // Calculate angle between lines from target to each beacon
        const angle1 = Math.atan2(beacon1.beacon.lat - lat, beacon1.beacon.lon - lon);
        const angle2 = Math.atan2(beacon2.beacon.lat - lat, beacon2.beacon.lon - lon);
        let intersectionAngle = Math.abs(angle1 - angle2);
        if (intersectionAngle > Math.PI) intersectionAngle = 2 * Math.PI - intersectionAngle;
        
        // Convert to degrees and calculate GDOP
        const angleDegrees = intersectionAngle * 180 / Math.PI;
        
        // Best accuracy when angle is 90°, worst when close to 0° or 180°
        const optimalAngle = 90;
        const angleDeviation = Math.abs(angleDegrees - optimalAngle);
        gdopFactor = 1 + (angleDeviation / 45); // Scale factor based on angle deviation
        
    } else if (method === '3-beacon' && beacons.length >= 3) {
        // For 3-beacon: calculate triangle quality (area vs perimeter ratio)
        const beacon1 = beacons[0];
        const beacon2 = beacons[1];
        const beacon3 = beacons[2];
        
        // Calculate distances between beacons
        const d12 = calculateDistance(beacon1.beacon.lat, beacon1.beacon.lon, beacon2.beacon.lat, beacon2.beacon.lon);
        const d23 = calculateDistance(beacon2.beacon.lat, beacon2.beacon.lon, beacon3.beacon.lat, beacon3.beacon.lon);
        const d31 = calculateDistance(beacon3.beacon.lat, beacon3.beacon.lon, beacon1.beacon.lat, beacon1.beacon.lon);
        
        // Calculate triangle area (Heron's formula)
        const s = (d12 + d23 + d31) / 2;
        const area = Math.sqrt(s * (s - d12) * (s - d23) * (s - d31));
        const perimeter = d12 + d23 + d31;
        
        // Quality factor: higher area/perimeter ratio = better geometry
        const qualityRatio = area / (perimeter * perimeter);
        gdopFactor = 1 / (1 + qualityRatio * 10000); // Inverse relationship
    }
    
    // 3. Distance factor (further from beacons = less accurate)
    const avgDistance = actualDistances.reduce((sum, d) => sum + d, 0) / actualDistances.length;
    const distanceFactor = 1 + (avgDistance / 5000); // Scale with average distance
    
    // Combine all error sources
    const maxRoundingError = Math.max(...errorComponents);
    const baseError = maxRoundingError * gdopFactor * distanceFactor;
    
    // Add minimum error based on method
    const minimumError = method === '2-beacon' ? 3 : 2; // 3-beacon is inherently more accurate
    totalError = Math.max(baseError, minimumError);
    
    // Round to reasonable precision
    if (totalError < 10) {
        totalError = Math.ceil(totalError);
    } else if (totalError < 100) {
        totalError = Math.ceil(totalError / 5) * 5;
    } else {
        totalError = Math.ceil(totalError / 10) * 10;
    }
    
    return `±${totalError}m`;
}

/**
 * Round distance to human-friendly values
 * @param {number} distance - Distance in meters
 * @param {string} roundingLevel - 'precise', 'readable', 'approximate'
 * @returns {number} Rounded distance
 */
function roundDistanceHumanFriendly(distance, roundingLevel = 'readable') {
    switch (roundingLevel) {
        case 'exact':
            return Math.round(distance);
        case 'readable':
            // Default: 10-meter rounding for human communication
            return Math.round(distance / 10) * 10;
        case 'coarse':
            if (distance < 1000) return Math.round(distance / 50) * 50; // Round to 50m
            if (distance < 10000) return Math.round(distance / 100) * 100; // Round to 100m
            return Math.round(distance / 500) * 500; // Round to 500m
        default:
            return Math.round(distance / 10) * 10;
    }
}

/**
 * Get accuracy description for rounding level
 * @param {string} roundingLevel - The rounding level used
 * @param {string} areaType - Area type (urban/suburban/rural/remote)
 * @returns {string} Accuracy description
 */
function getAccuracyForRounding(roundingLevel, areaType) {
    const baseAccuracy = areaType === 'urban' ? 3 : areaType === 'suburban' ? 5 : areaType === 'rural' ? 8 : 15;
    
    switch (roundingLevel) {
        case 'precise':
            return `±${baseAccuracy}m`;
        case 'readable':
            return `±${baseAccuracy + 5}m`;
        case 'approximate':
            return `±${baseAccuracy + 15}m`;
        default:
            return `±${baseAccuracy}m`;
    }
}

/**
 * Generate multiple encoding options for a location
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @returns {Array} Array of encoding options with different methods and accuracy levels
 */
function generateMultipleEncodingOptions(lat, lon) {
    const options = [];
    const nearestBeacons = findNearestBeacons(lat, lon, 5);
    
    if (nearestBeacons.length < 2) {
        return [{
            code: 'ERROR-Not-Enough-Beacons',
            description: 'Not enough beacons in range',
            method: 'error',
            accuracy: 'N/A',
            beacons: [],
            roundingLevel: 'precise'
        }];
    }
    
    const scaling = getDistanceScaling(nearestBeacons);
    
    // Generate options for different rounding levels and beacon counts
    const roundingLevels = ['readable', 'exact', 'coarse'];
    const beaconCounts = [2];
    
    // Add 3-beacon option if available
    if (nearestBeacons.length >= 3) {
        beaconCounts.push(3);
    }
    
    roundingLevels.forEach(roundingLevel => {
        beaconCounts.forEach(beaconCount => {
            try {
                const option = generateSingleEncodingOption(lat, lon, nearestBeacons, scaling, beaconCount, roundingLevel);
                if (option && option.code !== 'ERROR-Invalid-Location') {
                    options.push(option);
                }
            } catch (error) {
                console.warn('Error generating encoding option:', error);
            }
        });
    });
    
    // Remove duplicates and sort by preference (3-beacon precise first, then by readability)
    const uniqueOptions = [];
    const seenCodes = new Set();
    
    options.forEach(option => {
        if (!seenCodes.has(option.code)) {
            seenCodes.add(option.code);
            uniqueOptions.push(option);
        }
    });
    
    return uniqueOptions.sort((a, b) => {
        // Sort by: 2-beacon first (easier naming), then by rounding level (precise > readable > approximate)
        if (a.method !== b.method) {
            return a.method === '2-beacon' ? -1 : 1;
        }
        const roundingOrder = { readable: 0, exact: 1, coarse: 2 };
        return roundingOrder[a.roundingLevel] - roundingOrder[b.roundingLevel];
    });
}

/**
 * Generate a single encoding option
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @param {Array} nearestBeacons - Pre-calculated nearest beacons
 * @param {Object} scaling - Scaling information
 * @param {number} beaconCount - Number of beacons to use (2 or 3)
 * @param {string} roundingLevel - Rounding level
 * @returns {Object} Single encoding option
 */
function generateSingleEncodingOption(lat, lon, nearestBeacons, scaling, beaconCount, roundingLevel) {
    let beaconsToUse;
    
    // For both 2-beacon and 3-beacon encoding, use well-distributed beacons to avoid close beacon pairs
    const wellDistributed = findWellDistributedBeacons(lat, lon, beaconCount);
    
    // Store actual distances before rounding for accuracy calculation
    const actualDistances = wellDistributed.map(b => b.distance);
    
    beaconsToUse = wellDistributed.map(b => ({
        ...b,
        actualDistance: b.distance, // Keep original distance
        distance: roundDistanceHumanFriendly(b.distance, roundingLevel)
    }));
    
    // Filter out beacons that would exceed reasonable distances instead of capping them
    beaconsToUse = beaconsToUse.filter(b => b.distance <= scaling.maxDistance);
    
    // If we filtered out too many beacons, we need to get more
    if (beaconsToUse.length < beaconCount) {
        // Try to find alternative beacons that fit within distance limits
        const alternativeBeacons = findWellDistributedBeacons(lat, lon, beaconCount + 3)
            .filter(b => b.distance <= scaling.maxDistance)
            .slice(0, beaconCount);
        
        if (alternativeBeacons.length >= beaconCount) {
            const altActualDistances = alternativeBeacons.map(b => b.distance);
            beaconsToUse = alternativeBeacons.map(b => ({
                ...b,
                actualDistance: b.distance,
                distance: roundDistanceHumanFriendly(b.distance, roundingLevel)
            }));
            actualDistances = altActualDistances;
        }
    }
    
    if (beaconCount === 3) {
        // 3-Beacon encoding
        const beacon1 = beaconsToUse[0];
        const beacon2 = beaconsToUse[1];
        const beacon3 = beaconsToUse[2];
        
        const name1 = beacon1.beacon.shortName || beacon1.name;
        const name2 = beacon2.beacon.shortName || beacon2.name;
        const name3 = beacon3.beacon.shortName || beacon3.name;
        
        const code = `${beacon1.distance}-${name1}-${beacon2.distance}-${name2}-${beacon3.distance}-${name3}`;
        
        // Calculate real geometric accuracy
        const realAccuracy = calculateGeometricAccuracy(lat, lon, beaconsToUse, actualDistances, '3-beacon');
        
        return {
            code: code,
            description: `3-beacon ${roundingLevel} (${realAccuracy})`,
            method: '3-beacon',
            accuracy: realAccuracy,
            beacons: [beacon1.name, beacon2.name, beacon3.name],
            roundingLevel: roundingLevel,
            areaType: scaling.type
        };
    } else {
        // 2-Beacon encoding
        const beacon1 = beaconsToUse[0];
        const beacon2 = beaconsToUse[1];
        
        const flag = getIntersectionSelector(
            { lat: beacon1.beacon.lat, lon: beacon1.beacon.lon },
            { lat: beacon2.beacon.lat, lon: beacon2.beacon.lon },
            { lat, lon }
        );
        
        const name1 = beacon1.beacon.shortName || beacon1.name;
        const name2 = beacon2.beacon.shortName || beacon2.name;
        
        const code = `${beacon1.distance}-${name1}-${beacon2.distance}-${name2}-${flag}`;
        
        // Calculate real geometric accuracy
        const realAccuracy = calculateGeometricAccuracy(lat, lon, beaconsToUse, actualDistances, '2-beacon');
        
        return {
            code: code,
            description: `2-beacon ${roundingLevel} (${realAccuracy})`,
            method: '2-beacon',
            accuracy: realAccuracy,
            beacons: [beacon1.name, beacon2.name],
            roundingLevel: roundingLevel,
            areaType: scaling.type
        };
    }
}

/**
 * Encode a location as an OBL code with improved algorithm (backward compatibility)
 * @param {number} lat - Target latitude
 * @param {number} lon - Target longitude
 * @param {boolean} use3Beacon - Whether to prefer 3-beacon encoding
 * @returns {Object} {code, beacons, accuracy, method, areaType}
 */
function encodeLocation(lat, lon, use3Beacon = false) {
    try {
        const nearestBeacons = findNearestBeacons(lat, lon, 5);
        
        if (nearestBeacons.length < 2) {
            throw new Error('Not enough beacons in range');
        }
        
        // Get distance scaling information
        const scaling = getDistanceScaling(nearestBeacons);
        
        // Round distances to meters and apply scaling limits
        nearestBeacons.forEach(b => {
            b.distance = Math.round(b.distance);
        });
        
        // Filter out beacons that exceed distance limits instead of capping them
        const validBeacons = nearestBeacons.filter(b => b.distance <= scaling.maxDistance);
        
        // If we don't have enough valid beacons, use the well-distributed algorithm
        let beaconsToUse = validBeacons;
        if (validBeacons.length < 2) {
            // Fall back to well-distributed beacons, filtering by distance
            beaconsToUse = findWellDistributedBeacons(lat, lon, 3)
                .filter(b => roundDistanceHumanFriendly(b.distance, 'readable') <= scaling.maxDistance)
                .slice(0, 3);
        }
        
        if (beaconsToUse.length < 2) {
            return {
                code: 'ERROR-Not-Enough-Valid-Beacons',
                beacons: [],
                accuracy: 'N/A',
                method: 'error',
                areaType: scaling.type
            };
        }
        
        // Auto-decide between 2-beacon and 3-beacon based on area type and availability
        const shouldUse3Beacon = use3Beacon || 
            (beaconsToUse.length >= 3 && 
             scaling.type === 'urban' && 
             beaconsToUse[2].distance < 2000);
        
        if (shouldUse3Beacon && beaconsToUse.length >= 3) {
            // 3-Beacon encoding: no intersection selector needed, better accuracy
            const beacon1 = beaconsToUse[0];
            const beacon2 = beaconsToUse[1];
            const beacon3 = beaconsToUse[2];
            
            // Use shortName for more compact codes
            const name1 = beacon1.beacon.shortName || beacon1.name;
            const name2 = beacon2.beacon.shortName || beacon2.name;
            const name3 = beacon3.beacon.shortName || beacon3.name;
            
            const code = `${beacon1.distance}-${name1}-${beacon2.distance}-${name2}-${beacon3.distance}-${name3}`;
            
            return {
                code: code,
                beacons: [beacon1.name, beacon2.name, beacon3.name],
                accuracy: scaling.type === 'urban' ? '±3m' : '±5m',
                method: '3-beacon',
                areaType: scaling.type
            };
        } else {
            // 2-Beacon encoding: intersection selector needed
            const beacon1 = beaconsToUse[0];
            const beacon2 = beaconsToUse[1];
            
            const flag = getIntersectionSelector(
                { lat: beacon1.beacon.lat, lon: beacon1.beacon.lon },
                { lat: beacon2.beacon.lat, lon: beacon2.beacon.lon },
                { lat, lon }
            );
            
            // Use shortName for more compact codes
            const name1 = beacon1.beacon.shortName || beacon1.name;
            const name2 = beacon2.beacon.shortName || beacon2.name;
            
            const code = `${beacon1.distance}-${name1}-${beacon2.distance}-${name2}-${flag}`;
            
            return {
                code: code,
                beacons: [beacon1.name, beacon2.name],
                accuracy: scaling.type === 'urban' ? '±5m' : '±8m',
                method: '2-beacon',
                areaType: scaling.type
            };
        }
    } catch (error) {
        console.error('Encoding error:', error);
        return {
            code: 'ERROR-Invalid-Location',
            beacons: [],
            accuracy: 'N/A',
            method: 'error',
            areaType: 'unknown'
        };
    }
}

/**
 * Parse an OBL code to extract components
 * @param {string} oblCode - The OBL code to parse
 * @returns {Object} Parsed components or null if invalid
 */
function parseOBLCode(oblCode) {
    if (!oblCode || typeof oblCode !== 'string') {
        return null;
    }
    
    const parts = oblCode.trim().split('-');
    
    // 2-beacon format: Distance-Beacon-Distance-Beacon-Flag  
    if (parts.length === 5) {
        const [dist1, beacon1, dist2, beacon2, flag] = parts;
        
        if (!isValidBeacon(beacon1) || !isValidBeacon(beacon2)) {
            return null;
        }
        
        if (!['N', 'S', 'E', 'W'].includes(flag)) {
            return null;
        }
        
        return {
            type: '2-beacon',
            beacons: [
                { name: beacon1, distance: parseInt(dist1) },
                { name: beacon2, distance: parseInt(dist2) }
            ],
            flag: flag
        };
    }
    
    // 3-beacon format: Distance-Beacon-Distance-Beacon-Distance-Beacon
    if (parts.length === 6) {
        const [dist1, beacon1, dist2, beacon2, dist3, beacon3] = parts;
        
        if (!isValidBeacon(beacon1) || !isValidBeacon(beacon2) || !isValidBeacon(beacon3)) {
            return null;
        }
        
        return {
            type: '3-beacon',
            beacons: [
                { name: beacon1, distance: parseInt(dist1) },
                { name: beacon2, distance: parseInt(dist2) },
                { name: beacon3, distance: parseInt(dist3) }
            ]
        };
    }
    
    return null;
}

/**
 * Decode an OBL code to get coordinates
 * @param {string} oblCode - The OBL code to decode
 * @returns {Object} {lat, lon, accuracy, beacons} or null if invalid
 */
function decodeLocation(oblCode) {
    try {
        const parsed = parseOBLCode(oblCode);
        if (!parsed) {
            throw new Error('Invalid OBL code format');
        }
        
        if (parsed.type === '2-beacon') {
            return decode2Beacon(parsed);
        } else if (parsed.type === '3-beacon') {
            return decode3Beacon(parsed);
        }
        
        throw new Error('Unknown OBL code type');
    } catch (error) {
        console.error('Decoding error:', error);
        return null;
    }
}

/**
 * Decode 2-beacon OBL code
 */
function decode2Beacon(parsed) {
    const beacon1 = getBeacon(parsed.beacons[0].name);
    const beacon2 = getBeacon(parsed.beacons[1].name);
    const dist1 = parsed.beacons[0].distance;
    const dist2 = parsed.beacons[1].distance;
    const flag = parsed.flag;
    
    // Use center point for coordinate conversion
    const centerLat = (beacon1.lat + beacon2.lat) / 2;
    const centerLon = (beacon1.lon + beacon2.lon) / 2;
    
    // Convert beacons to XY coordinates
    const b1 = latLonToXY(beacon1.lat, beacon1.lon, centerLat, centerLon);
    const b2 = latLonToXY(beacon2.lat, beacon2.lon, centerLat, centerLon);
    
    // Find circle intersections
    const intersections = findCircleIntersections(b1.x, b1.y, dist1, b2.x, b2.y, dist2);
    
    if (intersections.length === 0) {
        throw new Error('No intersection found for given distances');
    }
    
    // Select correct intersection based on flag
    let selectedPoint;
    if (intersections.length === 1) {
        selectedPoint = intersections[0];
    } else {
        // Choose intersection based on selector flag
        const int1 = xyToLatLon(intersections[0].x, intersections[0].y, centerLat, centerLon);
        const int2 = xyToLatLon(intersections[1].x, intersections[1].y, centerLat, centerLon);
        
        const flag1 = getIntersectionSelector(beacon1, beacon2, int1);
        const flag2 = getIntersectionSelector(beacon1, beacon2, int2);
        
        if (flag1 === flag) {
            selectedPoint = intersections[0];
        } else if (flag2 === flag) {
            selectedPoint = intersections[1];
        } else {
            // Fallback to first intersection
            selectedPoint = intersections[0];
        }
    }
    
    const result = xyToLatLon(selectedPoint.x, selectedPoint.y, centerLat, centerLon);
    
    // Calculate real accuracy for decoded location
    const beaconsWithData = parsed.beacons.map(b => ({
        beacon: getBeacon(b.name),
        distance: b.distance,
        name: b.name
    }));
    const actualDistances = beaconsWithData.map(b => 
        calculateDistance(result.lat, result.lon, b.beacon.lat, b.beacon.lon)
    );
    const realAccuracy = calculateGeometricAccuracy(result.lat, result.lon, beaconsWithData, actualDistances, '2-beacon');
    
    return {
        lat: result.lat,
        lon: result.lon,
        accuracy: realAccuracy,
        beacons: parsed.beacons.map(b => b.name),
        method: '2-beacon'
    };
}

/**
 * Decode 3-beacon OBL code using trilateration
 */
function decode3Beacon(parsed) {
    const beacon1 = getBeacon(parsed.beacons[0].name);
    const beacon2 = getBeacon(parsed.beacons[1].name);
    const beacon3 = getBeacon(parsed.beacons[2].name);
    const dist1 = parsed.beacons[0].distance;
    const dist2 = parsed.beacons[1].distance;
    const dist3 = parsed.beacons[2].distance;
    
    // Use center point for coordinate conversion
    const centerLat = (beacon1.lat + beacon2.lat + beacon3.lat) / 3;
    const centerLon = (beacon1.lon + beacon2.lon + beacon3.lon) / 3;
    
    // Convert beacons to XY coordinates
    const b1 = latLonToXY(beacon1.lat, beacon1.lon, centerLat, centerLon);
    const b2 = latLonToXY(beacon2.lat, beacon2.lon, centerLat, centerLon);
    const b3 = latLonToXY(beacon3.lat, beacon3.lon, centerLat, centerLon);
    
    // Simplified trilateration algorithm
    // In production, this would use more robust methods
    const A = 2 * (b2.x - b1.x);
    const B = 2 * (b2.y - b1.y);
    const C = dist1 ** 2 - dist2 ** 2 - b1.x ** 2 + b2.x ** 2 - b1.y ** 2 + b2.y ** 2;
    const D = 2 * (b3.x - b2.x);
    const E = 2 * (b3.y - b2.y);
    const F = dist2 ** 2 - dist3 ** 2 - b2.x ** 2 + b3.x ** 2 - b2.y ** 2 + b3.y ** 2;
    
    const x = (C * E - F * B) / (E * A - B * D);
    const y = (A * F - D * C) / (A * E - D * B);
    
    const result = xyToLatLon(x, y, centerLat, centerLon);
    
    // Calculate real accuracy for decoded location
    const beaconsWithData = parsed.beacons.map(b => ({
        beacon: getBeacon(b.name),
        distance: b.distance,
        name: b.name
    }));
    const actualDistances = beaconsWithData.map(b => 
        calculateDistance(result.lat, result.lon, b.beacon.lat, b.beacon.lon)
    );
    const realAccuracy = calculateGeometricAccuracy(result.lat, result.lon, beaconsWithData, actualDistances, '3-beacon');
    
    return {
        lat: result.lat,
        lon: result.lon,
        accuracy: realAccuracy,
        beacons: parsed.beacons.map(b => b.name),
        method: '3-beacon'
    };
}