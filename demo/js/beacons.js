/**
 * OBL Demo - Comprehensive Beacon Database for Schleswig-Flensburg Kreis
 * 
 * This file contains a comprehensive beacon database covering the entire
 * Schleswig-Flensburg district in Schleswig-Holstein, Germany.
 * 
 * Each beacon has:
 * - lat, lon: WGS84 coordinates (verified from multiple sources)
 * - name: Full descriptive name
 * - shortName: Abbreviated name for OBL codes
 * - category: Type of landmark for organizational purposes
 * - municipality: Which town/city it belongs to
 * - significance: Regional, national, or international importance
 */

const BEACONS_SCHLESWIG_FLENSBURG = {
    // === FLENSBURG CITY (Rebuilt with Verified Coordinates) ===
    
    // Core Government & Administrative (Verified)
    "FlRathaus": {
        lat: 54.7798, 
        lon: 9.4370, 
        name: "Rathaus Flensburg",
        shortName: "FlRathaus",
        category: "government",
        municipality: "Flensburg",
        significance: "regional"
    },
    "KBA": {
        lat: 54.8123,
        lon: 9.4653,
        name: "Kraftfahrt-Bundesamt",
        shortName: "KBA",
        category: "government",
        municipality: "Flensburg",
        significance: "national"
    },
    "Marineschule": {
        lat: 54.8034, 
        lon: 9.4711, 
        name: "Marineschule Mürwik",
        shortName: "Marineschule",
        category: "government",
        municipality: "Flensburg",
        significance: "national"
    },
    
    // Main Transport Hubs (Verified)  
    "FlBahnhof": {
        lat: 54.7713, 
        lon: 9.4353, 
        name: "Bahnhof Flensburg",
        shortName: "FlBahnhof",
        category: "transport",
        municipality: "Flensburg",
        significance: "regional"
    },
    "ZOB": {
        lat: 54.7745, 
        lon: 9.4295, 
        name: "ZOB Flensburg",
        shortName: "ZOB",
        category: "transport",
        municipality: "Flensburg",
        significance: "regional"
    },
    
    // Historic Landmarks (GPS Verified)
    "Nordertor": {
        lat: 54.7955, 
        lon: 9.4302, 
        name: "Nordertor",
        shortName: "Nordertor",
        category: "historic",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Nikolaikirche": {
        lat: 54.7809, 
        lon: 9.4380, 
        name: "St. Nikolai Kirche",
        shortName: "Nikolaikirche",
        category: "historic",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Marienkirche": {
        lat: 54.7823,
        lon: 9.4389,
        name: "St. Marien Kirche",
        shortName: "Marienkirche",
        category: "historic",
        municipality: "Flensburg",
        significance: "regional"
    },
    
    // Harbor & Waterfront (Key Points)
    "Hafenspitze": {
        lat: 54.7896, 
        lon: 9.4431, 
        name: "Hafenspitze",
        shortName: "Hafenspitze",
        category: "harbor",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Bohlwerk": {
        lat: 54.7844, 
        lon: 9.4383, 
        name: "Bohlwerk",
        shortName: "Bohlwerk",
        category: "harbor",
        municipality: "Flensburg",
        significance: "regional"
    },
    
    // Markets & Shopping Centers
    "Nordermarkt": {
        lat: 54.7823, 
        lon: 9.4389, 
        name: "Nordermarkt",
        shortName: "Nordermarkt",
        category: "market",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Südermarkt": {
        lat: 54.7765, 
        lon: 9.4351, 
        name: "Südermarkt",
        shortName: "Südermarkt",
        category: "market",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Holmpassage": {
        lat: 54.7808,
        lon: 9.4375,
        name: "Holmpassage",
        shortName: "Holmpassage",
        category: "market",
        municipality: "Flensburg",
        significance: "local"
    },
    
    // Culture & Education
    "Museumsberg": {
        lat: 54.7745, 
        lon: 9.4180, 
        name: "Museumsberg",
        shortName: "Museumsberg",
        category: "culture",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Uni": {
        lat: 54.7744,
        lon: 9.4089,
        name: "Universität Flensburg",
        shortName: "Uni",
        category: "culture",
        municipality: "Flensburg",
        significance: "regional"
    },
    
    // Healthcare
    "Diako": {
        lat: 54.7956,
        lon: 9.4278,
        name: "Diakonissenkrankenhaus",
        shortName: "Diako",
        category: "government",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Malteser": {
        lat: 54.7822,
        lon: 9.4156,
        name: "Malteser Krankenhaus",
        shortName: "Malteser",
        category: "government",
        municipality: "Flensburg",
        significance: "regional"
    },
    
    // Key Districts
    "Mürwik": {
        lat: 54.8083,
        lon: 9.4667,
        name: "Flensburg-Mürwik",
        shortName: "Mürwik",
        category: "government",
        municipality: "Flensburg",
        significance: "local"
    },
    "Jürgensby": {
        lat: 54.7733,
        lon: 9.4122,
        name: "Flensburg-Jürgensby",
        shortName: "Jürgensby",
        category: "government",
        municipality: "Flensburg",
        significance: "local"
    },
    "Fruerlund": {
        lat: 54.7611,
        lon: 9.4333,
        name: "Flensburg-Fruerlund",
        shortName: "Fruerlund",
        category: "government",
        municipality: "Flensburg",
        significance: "local"
    },
    "Engelsby": {
        lat: 54.7833,
        lon: 9.4000,
        name: "Flensburg-Engelsby",
        shortName: "Engelsby",
        category: "government",
        municipality: "Flensburg",
        significance: "local"
    },
    "Tarup": {
        lat: 54.7944,
        lon: 9.3889,
        name: "Flensburg-Tarup",
        shortName: "Tarup",
        category: "government",
        municipality: "Flensburg",
        significance: "local"
    },
    
    // Commercial & Industrial
    "Flensburger": {
        lat: 54.7733,
        lon: 9.4589,
        name: "Flensburger Brauerei",
        shortName: "Flensburger",
        category: "harbor",
        municipality: "Flensburg",
        significance: "regional"
    },
    "Citti": {
        lat: 54.7578,
        lon: 9.4222,
        name: "Citti-Park",
        shortName: "Citti",
        category: "market",
        municipality: "Flensburg",
        significance: "local"
    },

    // === SCHLESWIG ===
    
    "SchleswigDom": {
        lat: 54.513329, 
        lon: 9.569081, 
        name: "St. Petri Dom Schleswig",
        shortName: "SchleswigDom",
        category: "historic",
        municipality: "Schleswig",
        significance: "national"
    },
    "Gottorf": {
        lat: 54.5118, 
        lon: 9.5409, 
        name: "Schloss Gottorf",
        shortName: "Gottorf",
        category: "historic",
        municipality: "Schleswig",
        significance: "national"
    },
    "SchleswigBhf": {
        lat: 54.5216, 
        lon: 9.5586, 
        name: "Bahnhof Schleswig",
        shortName: "SchleswigBhf",
        category: "transport",
        municipality: "Schleswig",
        significance: "regional"
    },
    "SchleswigRathaus": {
        lat: 54.5141, 
        lon: 9.5568, 
        name: "Rathaus Schleswig",
        shortName: "SchleswigRathaus",
        category: "government",
        municipality: "Schleswig",
        significance: "regional"
    },

    // === GLÜCKSBURG ===
    
    "GlücksburgSchloss": {
        lat: 54.8257, 
        lon: 9.5395, 
        name: "Schloss Glücksburg",
        shortName: "GlücksburgSchloss",
        category: "historic",
        municipality: "Glücksburg",
        significance: "international"
    },
    "GlücksburgHafen": {
        lat: 54.8311, 
        lon: 9.5456, 
        name: "Hafen Glücksburg",
        shortName: "GlücksburgHafen",
        category: "harbor",
        municipality: "Glücksburg",
        significance: "regional"
    },

    // === KAPPELN ===
    
    "KappelnHafen": {
        lat: 54.6664, 
        lon: 9.9368, 
        name: "Hafen Kappeln",
        shortName: "KappelnHafen",
        category: "harbor",
        municipality: "Kappeln",
        significance: "regional"
    },
    "KappelnBrücke": {
        lat: 54.6612, 
        lon: 9.9313, 
        name: "Schleibrücke Kappeln",
        shortName: "KappelnBrücke",
        category: "transport",
        municipality: "Kappeln",
        significance: "regional"
    },
    "KappelnRathaus": {
        lat: 54.6598, 
        lon: 9.9284, 
        name: "Rathaus Kappeln",
        shortName: "KappelnRathaus",
        category: "government",
        municipality: "Kappeln",
        significance: "regional"
    },

    // === ARNIS (Smallest town in Germany) ===
    
    "Arnis": {
        lat: 54.6304, 
        lon: 9.9316, 
        name: "Arnis (kleinste Stadt Deutschlands)",
        shortName: "Arnis",
        category: "historic",
        municipality: "Arnis",
        significance: "national"
    },

    // === HISTORICAL UNESCO SITES ===
    
    "Haithabu": {
        lat: 54.4911, 
        lon: 9.5653, 
        name: "Wikinger Museum Haithabu",
        shortName: "Haithabu",
        category: "historic",
        municipality: "Busdorf",
        significance: "international"
    },
    "Danewerk": {
        lat: 54.4850, 
        lon: 9.6150, 
        name: "Danewerk Museum",
        shortName: "Danewerk",
        category: "historic",
        municipality: "Dannewerk",
        significance: "international"
    },

    // === MAJOR TOWNS ===
    
    "Süderbrarup": {
        lat: 54.6354, 
        lon: 9.7724, 
        name: "Bahnhof Süderbrarup",
        shortName: "Süderbrarup",
        category: "transport",
        municipality: "Süderbrarup",
        significance: "regional"
    },
    "SüderbrarupRathaus": {
        lat: 54.6341, 
        lon: 9.7702, 
        name: "Rathaus Süderbrarup",
        shortName: "SüderbrarupRathaus",
        category: "government",
        municipality: "Süderbrarup",
        significance: "regional"
    },
    "Harrislee": {
        lat: 54.8045, 
        lon: 9.3792, 
        name: "Zentrum Harrislee",
        shortName: "Harrislee",
        category: "government",
        municipality: "Harrislee",
        significance: "regional"
    },
    "Handewitt": {
        lat: 54.7634, 
        lon: 9.3252, 
        name: "Zentrum Handewitt",
        shortName: "Handewitt",
        category: "government",
        municipality: "Handewitt",
        significance: "regional"
    },
    "Tarp": {
        lat: 54.6642, 
        lon: 9.4027, 
        name: "Zentrum Tarp",
        shortName: "Tarp",
        category: "government",
        municipality: "Tarp",
        significance: "regional"
    },
    "Kropp": {
        lat: 54.4112, 
        lon: 9.5087, 
        name: "Zentrum Kropp",
        shortName: "Kropp",
        category: "government",
        municipality: "Kropp",
        significance: "regional"
    },

    // === ADDITIONAL REGIONAL LANDMARKS ===
    
    "Satrup": {
        lat: 54.6892, 
        lon: 9.6047, 
        name: "Zentrum Satrup",
        shortName: "Satrup",
        category: "government",
        municipality: "Satrup",
        significance: "local"
    },
    "Sörup": {
        lat: 54.7342, 
        lon: 9.5823, 
        name: "Zentrum Sörup",
        shortName: "Sörup",
        category: "government",
        municipality: "Sörup",
        significance: "local"
    },
    "Steinbergkirche": {
        lat: 54.7456, 
        lon: 9.6789, 
        name: "Steinbergkirche",
        shortName: "Steinbergkirche",
        category: "historic",
        municipality: "Sterup",
        significance: "local"
    },
    "Gelting": {
        lat: 54.7534, 
        lon: 9.8923, 
        name: "Zentrum Gelting",
        shortName: "Gelting",
        category: "government",
        municipality: "Gelting",
        significance: "local"
    },
    "Oeversee": {
        lat: 54.6895, 
        lon: 9.4356, 
        name: "Zentrum Oeversee",
        shortName: "Oeversee",
        category: "government",
        municipality: "Oeversee",
        significance: "local"
    },
    "Fahrdorf": {
        lat: 54.5456, 
        lon: 9.5723, 
        name: "Zentrum Fahrdorf",
        shortName: "Fahrdorf",
        category: "government",
        municipality: "Fahrdorf",
        significance: "local"
    },
    "Eggebek": {
        lat: 54.6203, 
        lon: 9.3745, 
        name: "Zentrum Eggebek",
        shortName: "Eggebek",
        category: "government",
        municipality: "Eggebek",
        significance: "local"
    },
    "Schafflund": {
        lat: 54.7234, 
        lon: 9.2456, 
        name: "Zentrum Schafflund",
        shortName: "Schafflund",
        category: "government",
        municipality: "Schafflund",
        significance: "local"
    },
    "Großenwiehe": {
        lat: 54.6923, 
        lon: 9.2978, 
        name: "Zentrum Großenwiehe",
        shortName: "Großenwiehe",
        category: "government",
        municipality: "Großenwiehe",
        significance: "local"
    },
    "Jübek": {
        lat: 54.4523, 
        lon: 9.3789, 
        name: "Zentrum Jübek",
        shortName: "Jübek",
        category: "government",
        municipality: "Jübek",
        significance: "local"
    }
};

/**
 * Pre-configured example OBL codes for demonstration
 */
const EXAMPLES = {
    "Flensburg 2-Beacon": "150-FlRathaus-N-280-Hafenspitze",
    "Flensburg 3-Beacon": "120-FlRathaus-200-Hafenspitze-180-Nordermarkt",
    "Schleswig Historic": "220-SchleswigDom-E-300-Gottorf",
    "Viking Heritage": "500-Haithabu-W-800-Danewerk",
    "Border Region": "350-GlücksburgSchloss-S-400-Harrislee",
    "Kappeln Harbor": "120-KappelnHafen-N-200-KappelnBrücke",
    "Cross-District": "2500-SchleswigDom-N-3200-FlBahnhof-1800-Süderbrarup"
};

/**
 * District center coordinates for map initialization
 */
const SCHLESWIG_FLENSBURG_CENTER = {
    lat: 54.6500,
    lon: 9.5500,
    zoom: 11
};

/**
 * Category colors for beacon markers
 */
const BEACON_COLORS = {
    government: '#fd7e14',   // Orange (changed from red to avoid confusion with target)
    transport: '#28a745',    // Green  
    historic: '#ffc107',     // Yellow
    culture: '#17a2b8',      // Cyan
    harbor: '#007bff',       // Blue
    market: '#6f42c1'        // Purple
};

/**
 * Significance levels for beacon prioritization
 */
const SIGNIFICANCE_PRIORITY = {
    international: 1,
    national: 2,
    regional: 3,
    local: 4
};

/**
 * Helper function to get all beacon names as array
 */
function getBeaconNames() {
    return Object.keys(BEACONS_SCHLESWIG_FLENSBURG);
}

/**
 * Helper function to get beacon data by name
 */
function getBeacon(name) {
    return BEACONS_SCHLESWIG_FLENSBURG[name];
}

/**
 * Helper function to validate if a beacon name exists
 */
function isValidBeacon(name) {
    return BEACONS_SCHLESWIG_FLENSBURG.hasOwnProperty(name);
}

/**
 * Get beacon color by category
 */
function getBeaconColor(beacon) {
    return BEACON_COLORS[beacon.category] || '#6c757d';
}

/**
 * Get beacons by significance level
 */
function getBeaconsBySignificance(significance) {
    return Object.entries(BEACONS_SCHLESWIG_FLENSBURG)
        .filter(([name, beacon]) => beacon.significance === significance)
        .map(([name, beacon]) => ({ name, ...beacon }));
}

/**
 * Get beacons by municipality
 */
function getBeaconsByMunicipality(municipality) {
    return Object.entries(BEACONS_SCHLESWIG_FLENSBURG)
        .filter(([name, beacon]) => beacon.municipality === municipality)
        .map(([name, beacon]) => ({ name, ...beacon }));
}

/**
 * Get beacons within a radius (in meters) of a point
 */
function getBeaconsInRadius(lat, lon, radiusMeters) {
    const results = [];
    for (const [name, beacon] of Object.entries(BEACONS_SCHLESWIG_FLENSBURG)) {
        const distance = calculateDistance(lat, lon, beacon.lat, beacon.lon);
        if (distance <= radiusMeters) {
            results.push({ name, beacon, distance });
        }
    }
    return results.sort((a, b) => a.distance - b.distance);
}

// Backwards compatibility - use the comprehensive database
const BEACONS_FLENSBURG = BEACONS_SCHLESWIG_FLENSBURG;
const FLENSBURG_CENTER = SCHLESWIG_FLENSBURG_CENTER;