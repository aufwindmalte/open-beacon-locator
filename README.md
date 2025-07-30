# OBL: Open Beacon Locator

**Human-readable location codes using distances to named landmarks or arbitrary defined points**

```
50-BTor-80-Reichstag-E        // 50m from Brandenburg Gate, 80m from Reichstag
BAYERN:300-Watschn-150-Biergarten-N    // Bavarian rural example
ATLANTIC:12800-Neptun-33430-Arielle-N  // Ocean navigation
```

## Why OBL?

**What3Words problems:**
- Proprietary and expensive for commercial use
- Offline functionality limited
- Random word combinations provide no spatial context
- Single point of failure

**OBL advantages:**
- Intuitive: "50m from Brandenburg Gate, 80m from Reichstag the easternmost section" is immediately understood
- Open Source: GPL v3, patent-free
- Offline capable: No internet required for decoding or encoding
- Error resilient: Typos lead to nearby locations, not random places
- Multiple encodings: Same location has several valid codes
- Cultural: Uses regional language and landmarks

## Format

```
[REGION:]Distance-Beacon-Distance-Beacon-Flag[/Height]
[REGION:]Distance-Beacon-Distance-Beacon-Distance-Beacon[/Height]
```

**Components:**
- **Distance**: Meters (3-5 digits depending on area density)
- **Beacon**: POI name or regional grid reference
- **Flag**: N/S/E/W for two-beacon disambiguation (placed at end)  
- **Region**: Optional prefix (BERLIN:, FLENSBURG:, HAMBURG:, ATLANTIC:)
- **Height**: Optional elevation (/12m, /3FL, /40ft)

## Examples

**Urban (dense POI coverage):**
```
50-BTor-80-Reichstag-E              // Berlin
120-Eiffel-300-Arc-S                // Paris  
200-BigBen-150-Westminster-N        // London
```

**Regional (cultural beacons):**
```
BAYERN:800-Watschn-300-Suppengrün-S     // Bavaria
HOLLAND:150-Bromfiets-200-Sneev-N       // Netherlands
SCOTLAND:400-Thistle-600-Bagpipe-E      // Scotland
```

**Remote areas (large distances):**
```
ATLANTIC:12800-Neptun-33430-Arielle-N
SAHARA:45000-Oasis-67000-Dune-E
```

**With elevation:**
```
50-BTor-80-Reichstag-E/3FL          // 3rd floor
200-Matterhorn-500-Zermatt-N/2847m  // Mountain peak
```

## Quick Start

### Encoding a location
1. Find 2-3 nearest beacons
2. Measure distances
3. Add section flag if using 2 beacons
4. Format: 'Distance-Beacon-Distance-Beacon-Flag'


### Decoding a location  
1. Parse beacon names and distances
2. Look up beacon coordinates
3. Calculate circle intersections
4. Flag indicated the basic direction of the used intersections (e.g. W the intersection most werstely and N the intersection north of the other)

## Installation

```bash
# Python
