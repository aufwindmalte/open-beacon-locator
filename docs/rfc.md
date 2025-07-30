# OBL: Open Beacon Locator System

**Request for Comments: XXXX**  
**Category: Standards Track**  
**Status: Draft**  
**Date: July 2025**

## Abstract

This document specifies OBL (Open Beacon Locator), a human-readable location encoding system that represents geographical positions as distances to named reference points. Unlike proprietary word-based systems, OBL provides intuitive spatial relationships, offline functionality, and mathematical transparency while remaining accessible to non-technical users.

OBL addresses limitations of existing geocoding systems by combining the precision of coordinate-based systems with the interpretability of natural language descriptions. The system supports urban areas using Points of Interest (POIs), rural regions using culturally-relevant grid names, and remote areas with widely-spaced reference points.

## 1. Introduction

### 1.1 Background

Current location encoding systems fall into three categories:
- **Coordinate systems** (lat/lon, UTM): Precise but opaque to users
- **Grid systems** (Plus Codes, Geohash): Mathematical but abstract
- **Word systems** (What3Words): Memorable but proprietary and arbitrary

OBL bridges this gap by encoding locations as distances to recognizable landmarks, providing both precision and intuitive understanding.

### 1.2 Terminology

- **Beacon**: A named reference point (POI or grid intersection)
- **Distance**: Measurement in meters from current position to beacon
- **Flag**: Intersection selector (N/S/E/W) for 2-beacon disambiguation - selects which of the two circle intersection points to use
- **POI**: Point of Interest (landmarks, buildings, natural features)
- **Grid Point**: Defined reference intersection using regional naming
- **Region Prefix**: Optional geographical context for disambiguation

## 2. System Architecture

### 2.1 Encoding Formats

OBL supports standardized encoding with optional regional context:

**Two-Beacon Format:**
```
[REGION:]Distance-Beacon-Distance-Beacon-Flag[/Height]
```

**Three-Beacon Format:**
```
[REGION:]Distance-Beacon-Distance-Beacon-Distance-Beacon[/Height]
```

### 2.2 Examples

**Urban (with dashes for readability):**
```
50-BTor-80-Reichstag-E
BERLIN:50-BTor-80-Reichstag-E/3FL
```

**Rural (regional language):**
```
BAYERN:30-Watschn-300-Suppengrün-E
HOLLAND:100-Bromfiets-300-Sneev-N
```

**Remote (large distances):**
```
ATLANTIC:12800-Neptun-33430-Arielle-N
PACIFIC:45000-Kraken-67000-Poseidon-E
```

### 2.3 Height Encoding

- **Metric (default)**: `/12` (12 meters above sea level)
- **Imperial**: `/40ft`, `/500yd` (with unit suffix)
- **Floor levels**: `/3FL`, `/B2` (floors, basement levels)

## 3. Reference Point System

### 3.1 Point of Interest (POI) Beacons

**Tier 1 - Global Landmarks:**
- Eiffel, BigBen, StatueLiberty
- Internationally recognized, abbreviated names

**Tier 2 - National Landmarks:**
- BTor (Brandenburg Gate), Neuschwanstein
- Nationally significant, regionally unique

**Tier 3 - Regional Centers:**
- HH-Rathaus (Hamburg City Hall), M-Rathaus (Munich)
- City-level significance with disambiguation

**Tier 4 - Local Landmarks:**
- Rotes-Rathaus, Alte-Kirche
- Neighborhood-level with qualifiers

### 3.2 Cultural Grid-Based Beacons

For areas lacking sufficient POIs, regional language creates memorable names:

**Dutch regions:** Bromfiets, Sneev, Grachten
**Bavarian regions:** Watschn, Suppengrün, Biergarten  
**Frisian regions:** Terp, Weide, Dijk
**North German:** Dösbaddel, Klönschnack, Sabbel

### 3.4 Phonetic Separation Requirements

To prevent confusion from mishearing or misspelling beacon names:

**Minimum separation distances:**
- Phonetically similar beacons: >50km apart
- Single-letter differences: >100km apart in remote areas
- Rhyming names: >25km apart

**Implementation:**
- Use Soundex/Metaphone algorithms for phonetic similarity detection
- Regional language committees verify phonetic distinctness
- Automatic conflict detection during beacon placement

**Examples to avoid:**
```
PROBLEMATIC: 150-Fietz-200-Fritz-N  // Too similar, too close
PREFERRED:   150-Fietz-200-Rathaus-N // Phonetically distinct
```

1. **Dash separation**: Improves readability
2. **Regional language**: Authentic local terms
3. **Abbreviation encouraged**: BTor vs BrandenburgerTor
4. **Disambiguation**: City prefixes (HH-, M-) when needed
5. **Unicode support**: All regional character sets

## 4. Regional Context System

### 4.1 Optional Region Prefixes

```
[No prefix]: Local context assumed
BERLIN: City-level disambiguation
BAYERN: State/province level  
ATLANTIC: Ocean/remote area
```

### 4.2 Automatic Context Detection

- GPS location determines default region
- Apps suggest region prefix when ambiguous
- Emergency services operate without prefixes locally

### 4.3 Distance Scaling by Region

**Urban areas**: 10m-999m (3 digits max)
**Suburban areas**: 100m-9999m (4 digits max)  
**Rural/Ocean**: 1km-99999m (5 digits max)
**Islands**: Dense spacing regardless of remoteness

**Rationale for closer urban spacing:**
- Human distance estimation accuracy decreases with range
- 150m: easily estimated ("about 150 meters")
- 1500m: roughly estimated ("about 1.5 kilometers") 
- 15000m: very roughly estimated ("about 15 kilometers")
- Closer beacons enable more user-friendly distance values

## 5. Position Calculation

### 5.1 Two-Beacon Trilateration

Two circles intersect at two points. Cardinal indicators resolve ambiguity:

```
150-Eiffel-200-Arc-N
```
- Circle 1: 150m radius around Eiffel Tower
- Circle 2: 200m radius around Arc de Triomphe  
- N flag: Select northernmost intersection point

### 5.2 Three-Beacon Trilateration

Three circles provide unique intersection (within measurement tolerance):

```
150-Eiffel-200-Arc-180-Louvre
```

### 5.4 Positioning Accuracy

Position accuracy depends heavily on beacon intersection angles:

**Two-beacon intersection angles:**
- 90° intersection: ~5m accuracy (optimal)
- 60° intersection: ~6m accuracy (good)
- 45° intersection: ~8m accuracy (acceptable)
- 30° intersection: ~11m accuracy (usable for most applications)
- <30° intersection: >20m accuracy (should be avoided)

**Three-beacon systems:** Provide ~3m accuracy regardless of intersection angles through redundancy and error correction.

**Practical implications:** Even 30m accuracy easily locates shops, restaurants, and meeting points. Unlike competing systems where errors can result in globally distant locations, OBL positioning errors remain locally bounded.

Algorithm preferences:
1. **Angular separation**: Prefer 90° angles between beacons
2. **Beacon hierarchy**: POIs over grid points
3. **Distance minimization**: Shorter codes preferred
4. **Regional relevance**: Culturally appropriate landmarks

## 6. Implementation Guidelines

### 6.1 Reference Database Structure

**POI Sources:**
- OpenStreetMap (primary)
- Local government databases
- Community submissions with regional naming

**Grid Generation:**
- Regional language word pools
- Cultural relevance verification
- Community-driven naming process

### 6.2 Encoding Algorithm

```
1. Detect region context (GPS/user preference)
2. Identify candidate beacons within scaled range
3. Calculate optimal 2-beacon and 3-beacon combinations
4. Score by: angular separation, cultural relevance, code length
5. Return shortest unambiguous encoding
```

### 6.3 Decoding Algorithm

```
1. Parse region prefix (if present)
2. Split beacon names and distances using dash separators
3. Lookup beacon coordinates from regional database
4. Calculate circle intersections
5. Apply intersection selector flags if present
6. Return coordinate with uncertainty estimate
```

## 7. Multiple Encoding Support

### 7.1 Redundancy Benefits

Unlike single-encoding systems, OpenDME supports multiple valid codes:

```
Position can be encoded as:
- 150-Eiffel-200-Arc-N
- 180-Louvre-120-Pantheon-S
- 220-NotreDame-170-Bastille-W
```

### 7.2 Error Resilience

- Typos suggest nearest beacon matches
- Distance errors result in nearby positions
- Multiple encodings provide cross-validation
- Dash separators prevent parsing ambiguity

## 8. Internationalization

### 8.1 Regional Language Support

Beacon names use authentic local terms:

```
NEDERLAND: Grachten, Windmolen, Tulpenveld
BAYERN: Biergarten, Lederhose, Weißwurst
SCOTLAND: Thistle, Bagpipe, Haggis
```

### 8.2 Script Support

- Full Unicode character support
- ASCII transliteration for compatibility
- Regional keyboard layouts supported

## 9. Security Considerations

### 9.1 Patent Landscape

OpenDME builds on established technologies:
- **Trilateration**: Public domain since antiquity
- **DME principles**: Aviation standard since 1940s
- **Regional naming**: Cultural expressions not patentable

### 9.2 Privacy

- No centralized tracking required
- Offline calculation capability
- Position precision controllable by distance rounding
- Regional context optional

### 9.3 Data Integrity

- Regional community verification
- Cryptographic database signatures
- Fallback systems for compromised beacons

## 10. Comparison with Existing Systems

| System | Length | Offline | Open | Spatial Context | Regional | Error Tolerance |
|--------|--------|---------|------|-----------------|----------|-----------------|
| What3Words | 20 chars | No | No | No | No | Poor |
| Plus Codes | 11 chars | Yes | Yes | No | No | Good |
| OpenDME | 16-35 chars | Yes | Yes | Yes | Yes | Excellent |

### 10.1 Advantages

- **Intuitive**: "150m from Eiffel" immediately understood
- **Cultural**: Regional language authenticity
- **Flexible**: Multiple valid encodings per location
- **Scalable**: Auto-adjusts to population density
- **Robust**: Graceful degradation with errors

### 10.2 Limitations

- **Variable length**: Longer than some alternatives
- **Beacon familiarity**: Regional beacons may be unfamiliar to outsiders
- **Database size**: ~370,000 global reference points

## 11. Example Implementations

### 11.1 Urban Emergency Services

```
Berlin Ambulance Dispatch:
- 50-BTor-80-Reichstag-E
- 120-Alex-200-Fernsehturm-N
```

### 11.2 Rural Cultural Context

```
Bavaria Hiking:
BAYERN:800-Watschn-1200-Suppengrün-S

Netherlands Cycling:
HOLLAND:300-Bromfiets-150-Sneev-N
```

### 11.3 Maritime Navigation

```
Atlantic Crossing:
ATLANTIC:12800-Neptun-33430-Arielle-N

Pacific Research:
PACIFIC:45000-Kraken-67000-Poseidon-E/15m
```

### 11.4 Building Interior

```
Office Complex:
150-Hauptbahnhof-80-Rathaus-N/5FL
```

## 12. Database Size and Scalability

### 12.1 Global Beacon Requirements

**Estimated global beacon count:** ~370,000 reference points
- 50,000 Points of Interest (landmarks, infrastructure)
- 320,000 Grid reference points (rural and remote areas)

**Regional distribution:**
- Europe: ~55,000 beacons
- North America: ~60,000 beacons  
- Asia: ~180,000 beacons
- Other regions: ~75,000 beacons

### 12.2 Database Storage Requirements

**Per-beacon data structure:**
- Beacon name: 15 bytes average
- Coordinates: 16 bytes (lat/lon double precision)
- Height: 4 bytes (optional elevation)
- Region/metadata: 30 bytes
- **Total per beacon: 65 bytes**

**Database sizes:**
- Global database: 23 MB (370,000 × 65 bytes)
- European subset: 3.5 MB (55,000 × 65 bytes)
- Single country: 500 KB - 2 MB typical

### 12.3 Comparison with Alternative Systems

**What3Words offline database:**
- Theoretical size: ~1.8 million GB (impractical)
- 57 billion 3m×3m squares globally
- 34 bytes per square minimum

**OBL advantage:** 80 million times smaller database enables practical offline operation on mobile devices.

This document requests no IANA actions. OpenDME operates independently of existing URI schemes and domain name systems.

## 14. References

### 14.1 Normative References

- **[RFC2119]** Bradner, S., "Key words for use in RFCs", BCP 14, RFC 2119, March 1997.
- **[OSM]** OpenStreetMap Foundation, https://www.openstreetmap.org
- **[WGS84]** World Geodetic System 1984, NIMA TR8350.2, 2000.

### 14.2 Informative References

- **[DME]** ICAO Annex 10: Aeronautical Telecommunications, Volume I, 2018.
- **[W3W]** What3Words Algorithm, https://what3words.com/about
- **[PLUS]** Open Location Code Specification, https://github.com/google/open-location-code

## Appendix A: Regional Naming Guidelines

### A.1 Beacon Selection Criteria

- **Cultural relevance**: Meaningful to local population
- **Memorability**: Easy to remember and pronounce
- **Uniqueness**: Regionally distinctive
- **Brevity**: Prefer shorter terms for code efficiency

### A.2 Community Process

1. Regional language committees propose beacon names
2. Community voting on preferred terms
3. Conflict resolution through geographic context
4. Regular review and updates

## Appendix B: Distance Scaling Algorithm

```python
def calculate_beacon_spacing(region_type, population_density):
    base_spacing = {
        'urban': 2000,      # 2km in cities
        'suburban': 5000,   # 5km in suburbs  
        'rural': 20000,     # 20km in countryside
        'remote': 50000,    # 50km+ in wilderness
        'ocean': 100000     # 100km+ at sea
    }
    
    density_factor = max(0.1, min(2.0, population_density / 1000))
    return base_spacing[region_type] / density_factor
```

## Appendix C: Cultural Naming Examples

### C.1 Regional Vocabularies

**Bavarian German:**
- Watschn (slap), Suppengrün (soup vegetables)
- Biergarten, Lederhose, Weißwurst
- Bergspitze, Alpenblick, Oktoberfest

**Dutch:**
- Bromfiets (moped), Sneev (snow)
- Grachten (canals), Windmolen (windmill)
- Tulpenveld, Poffertjes, Stroopwafel

**Frisian:**
- Terp (settlement mound), Weide (pasture)
- Dijk (dike), Skiep (ship), Greide (grass)

---

*This document is released under Creative Commons CC0 1.0 Universal Public Domain Dedication.*