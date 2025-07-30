# OBL: Open Beacon Locator

**Human-readable location codes using distances to named landmarks**

```
50-BranTor-E-80-Reichstag              // 50m from Brandenburg Gate, 80m from Reichstag
BAYERN:300-Watschn-N-150-Biergarten    // Bavarian rural example
ATLANTIC:12800-Neptun-N-33430-Arielle  // Ocean navigation
```

## Why OBL?

**What3Words problems:**
- Proprietary and expensive for commercial use
- Offline functionality limited
- Random word combinations provide no spatial context
- Single point of failure

**OBL advantages:**
- Intuitive: "50m from Brandenburg Gate" is immediately understood
- Open Source: GPL v3, patent-free
- Offline capable: No internet required for decoding
- Error resilient: Typos lead to nearby locations, not random places
- Multiple encodings: Same location has several valid codes
- Cultural: Uses regional language and landmarks

## Format

```
[REGION:]Distance-Beacon-Indicator-Distance-Beacon[/Height]
[REGION:]Distance-Beacon-Distance-Beacon-Distance-Beacon[/Height]
```

**Components:**
- **Distance**: Meters (3-5 digits depending on area density)
- **Beacon**: POI name or regional grid reference
- **Indicator**: N/S/E/W for two-beacon disambiguation  
- **Region**: Optional prefix (BERLIN:, BAYERN:, ATLANTIC:)
- **Height**: Optional elevation (/12m, /3FL, /40ft)

## Examples

**Urban (dense POI coverage):**
```
50-BTor-E-80-Reichstag              // Berlin
120-Eiffel-S-300-Arc                // Paris  
200-BigBen-N-150-Westminster        // London
```

**Regional (cultural beacons):**
```
BAYERN:800-Watschn-S-300-Suppengrün     // Bavaria
HOLLAND:150-Bromfiets-N-200-Sneev       // Netherlands
SCOTLAND:400-Thistle-E-600-Bagpipe      // Scotland
```

**Remote areas (large distances):**
```
ATLANTIC:12800-Neptun-N-33430-Arielle
SAHARA:45000-Addax-E-67000-Tuareg
```

**With elevation:**
```
50-BTor-E-80-Reichstag/3FL          // 3rd floor
200-Matterhorn-N-500-Zermatt/2847m  // Mountain peak
```

## Quick Start

### Encoding a location
1. Find 2-3 nearest beacons
2. Measure distances
3. Add cardinal indicator if using 2 beacons
4. Format: `Distance-Beacon-Indicator-Distance-Beacon`

### Decoding a location  
1. Parse beacon names and distances
2. Look up beacon coordinates
3. Calculate circle intersections
4. Apply cardinal direction if specified

## Installation

```bash
# Python
