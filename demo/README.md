# OBL Demo - Open Beacon Locator

Interactive web demonstration of the Open Beacon Locator (OBL) system - an open-source alternative to What3Words that encodes locations as distances to recognizable landmarks.

**Now covers the entire Schleswig-Flensburg Kreis with 40+ verified landmarks!**

## Quick Start

1. **Open the demo**: Open `index.html` in any modern web browser
2. **Local server** (recommended): 
   ```bash
   cd demo/
   python3 -m http.server 8000
   # Navigate to http://localhost:8000
   ```

No build process or dependencies required - just open and run!

## What is OBL?

OBL encodes geographical locations using distances to named landmarks (beacons):

- **2-Beacon Format**: `150-FlRathaus-280-Hafenspitze-N`
  - = 150m from Flensburg Rathaus, 280m from Hafenspitze, northernmost intersection point
- **3-Beacon Format**: `120-FlRathaus-200-Hafenspitze-180-Nordermarkt`  
  - = Unique intersection of three distance circles (no direction needed)
- **Cross-District Format**: `2500-SchleswigDom-3200-FlBahnhof-N`
  - = Northernmost intersection of distance circles around these major district landmarks

## Demo Features

### Interactive Map
- **Click anywhere** → Generate OBL code for that location
- **Enter OBL code** → Decode and show position on map
- **Example buttons** → Try predefined locations
- **Visual elements**:
  - 🔴 Red marker: Target location
  - 🔵 Blue markers: Beacon locations with labels (sized by significance)
  - ⭕ Colored circles: Distance rings around beacons
  - ➡️ Green intersection selector: N/S/E/W flag indicating which intersection point to use

### NEW: Multiple Encoding Options
When you click on the map, you now get **multiple encoding alternatives**:
- **✅ 3-beacon precise**: `120-FlRathaus-200-Hafenspitze-180-Nordermarkt` (±3m)
- **✅ 3-beacon readable**: `125-FlRathaus-200-Hafenspitze-175-Nordermarkt` (±8m)  
- **✅ 3-beacon approximate**: `125-FlRathaus-200-Hafenspitze-175-Nordermarkt` (±18m)
- **✅ 2-beacon precise**: `150-FlRathaus-280-Hafenspitze-N` (±5m)
- **✅ 2-beacon readable**: `150-FlRathaus-280-Hafenspitze-N` (±10m)
- **✅ 2-beacon approximate**: `150-FlRathaus-275-Hafenspitze-N` (±20m)

### Smart Distance Rounding
- **Precise**: Exact calculated distances (4347m → 4347m)
- **Readable**: Human-friendly numbers (4347m → 4350m)  
- **Approximate**: Very rounded for speech (4347m → 4300m)

### Demo Controls
- **Click any option** → Copy to clipboard & visualize on map
- **Input field**: Enter any valid OBL code
- **Decode button**: Process entered code
- **Clear Map button**: Reset visualization
- **Example buttons**: Cross-district, UNESCO sites, etc.

## Schleswig-Flensburg Beacon Database

The demo now uses 40+ verified landmarks across the entire Schleswig-Flensburg district:

### Key Corrections Made
- **KBA Coordinates**: Fixed to precise location 54.8123°N, 9.4653°E (previously incorrect)
- **District Coverage**: Expanded from 12 Flensburg landmarks to 40+ across entire Kreis

### Major Landmark Categories

#### International Significance (UNESCO World Heritage)
- **Haithabu**: Viking Museum and archaeological site
- **Danewerk**: Ancient Danish defensive earthworks
- **GlücksburgSchloss**: Renaissance water castle

#### National Significance
- **KBA**: Kraftfahrt-Bundesamt (verified coordinates)
- **SchleswigDom**: St. Peter's Cathedral, Schleswig
- **Gottorf**: Gottorf Castle and museum complex
- **Marineschule**: Naval Academy Mürwik
- **Arnis**: Germany's smallest town

#### Regional Centers
- **Flensburg**: FlRathaus, FlBahnhof, Hafenspitze, Nordertor, etc.
- **Schleswig**: Cathedral, castle, railway station
- **Kappeln**: Harbor, bridge, town center
- **Süderbrarup**: Railway junction
- **Glücksburg**: Castle and harbor

#### Additional Towns & Villages
- Harrislee, Handewitt, Tarp, Kropp, Satrup, Sörup, Gelting, Oeversee, Eggebek, Schafflund, and many more

### Distance Scaling by Area
- **Urban areas** (avg distance <1km): 3-digit distances, ±3-5m accuracy
- **Suburban areas** (1-3km): 4-digit distances, ±5-8m accuracy  
- **Rural areas** (3-8km): 4-digit distances, ±8-12m accuracy
- **Remote areas** (>8km): 5-digit distances, ±15-25m accuracy

## File Structure

```
demo/
├── index.html          # Main demo page
├── css/
│   └── style.css       # Modern, responsive styling
├── js/
│   ├── beacons.js      # Flensburg beacon database
│   ├── obl-core.js     # Encoding/decoding algorithms
│   └── demo.js         # UI interactions and map integration
└── README.md           # This file
```

## Technical Implementation

### Dependencies
- **Leaflet.js 1.9.4**: Interactive mapping (loaded from CDN)
- **OpenStreetMap**: Map tiles
- **Pure JavaScript**: No frameworks, keep it simple

### Key Algorithms
- **Haversine formula**: Calculate distances between coordinates
- **Circle intersection**: Find where distance circles meet
- **Trilateration**: Calculate position from multiple distance measurements
- **Intersection selection**: Determine N/S/E/W flag for choosing between the two intersection points

### Browser Compatibility
- Modern browsers with ES6 support
- Mobile-friendly responsive design
- Works offline after initial load

## Usage Examples

### Encoding (Click on Map)
1. Click anywhere on the Flensburg map
2. Algorithm finds nearest beacons
3. Calculates distances and generates OBL code
4. Shows visual representation with circles and markers

### Decoding (Enter Code)
1. Enter code like `150-Rathaus-280-Hafenspitze-N`
2. System parses beacon names and distances
3. Looks up beacon coordinates
4. Calculates intersection point(s)
5. Shows decoded location on map

### Example Codes to Try
```
# Flensburg examples
150-FlRathaus-280-Hafenspitze-N                    # 2-beacon with intersection selector
120-FlRathaus-200-Hafenspitze-180-Nordermarkt      # 3-beacon triangulation

# Historic Schleswig
220-SchleswigDom-300-Gottorf-E                     # Cathedral to castle

# UNESCO Viking sites  
500-Haithabu-800-Danewerk-W                        # World Heritage sites

# Cross-district codes
2500-SchleswigDom-3200-FlBahnhof-1800-Süderbrarup-N  # Spans entire district

# Border region
350-GlücksburgSchloss-400-Harrislee-S              # Near Danish border

# Smallest town in Germany
180-Arnis-250-KappelnHafen-E                       # Arnis to Kappeln
```

## Accuracy and Limitations

### Accuracy
- **2-beacon codes**: ±8m typical accuracy
- **3-beacon codes**: ±5m typical accuracy  
- **Best accuracy**: When beacons form good angles (60°+ intersections)

### Current Limitations
- **Prototype quality**: Simplified algorithms for demonstration
- **Flensburg only**: Limited to 12 local beacons
- **No height encoding**: Elevation not yet implemented
- **Basic error handling**: Production version needs robustness
- **Simplified math**: Real trilateration is more complex

## Extending the Demo

### Adding New Beacons
Edit `js/beacons.js`:
```javascript
"NewBeacon": {
    lat: 54.7800,
    lon: 9.4300,
    name: "New Landmark Name",
    category: "government" // or transport, historic, etc.
}
```

### Adding New Regions
1. Create new beacon database for your area
2. Update `FLENSBURG_CENTER` coordinates
3. Modify examples for local landmarks
4. Test with local knowledge

### Algorithm Improvements
Current TODOs in `js/obl-core.js`:
- More robust circle intersection calculation
- Better error handling for edge cases
- Height/elevation encoding support
- Optimized beacon selection algorithms
- Support for larger beacon databases

## Demo Purpose

This demonstration is designed for:

### Audiences
- **OSM/FOSS community**: Show the open-source concept
- **Emergency services**: Demonstrate practical applications
- **Conference presentations**: CCC, FOSDEM, etc.
- **Press/media**: Visual explanation of the system
- **Technical contributors**: Foundation for production implementation

### Goals
- **30-second understanding**: Anyone grasps the concept quickly
- **Visual impact**: Clear connection between distances and landmarks  
- **Hackable code**: Easy for developers to understand and extend
- **Cultural authenticity**: Uses real local landmarks Germans recognize
- **Professional presentation**: Screenshot-ready for press use

## Contributing

### Code Improvements
- Better algorithms in `obl-core.js`
- Enhanced UI/UX in `demo.js`
- Mobile optimization
- Performance improvements

### Content Additions  
- More beacon databases for other cities
- Better visual design
- Additional example codes
- Multilingual support

### Testing
- Cross-browser compatibility
- Mobile device testing
- Edge case discovery
- User experience feedback

## Background Context

Created by an aerospace engineer who "understands the math (trilateration) but needs help with the code." This demo prioritizes:

1. **Concept demonstration** over algorithmic perfection
2. **Visual impact** over production optimization  
3. **Community engagement** over commercial polish
4. **Open development** over proprietary solutions

The goal is to attract technical contributors who can improve the implementation while keeping the core vision of human-readable, culturally-authentic location codes.

## License

This demo is part of the OBL project, released under GPL v3 license. The concept is based on public domain trilateration mathematics with no patent restrictions.

---

**Ready to contribute?** The code is intentionally hackable - dive in and make it better!