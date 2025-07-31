Internet Engineering Task Force                            M. Hoeltken
Internet-Draft                                                        
Intended status: Standards Track                           31 July 2025
Expires: 2 February 2026


           Open Beacon Locator (OBL): Human-Readable Geographic
                      Location Encoding System
    This is a **pre-IETF working draft**, shared for feedback via GitHub. 
    It is released under CC0 for open collaboration and input. Upon IETF 
    submission, the standard IETF Trust copyright notice will apply.


Abstract

   This document specifies the Open Beacon Locator (OBL), a human-
   readable location encoding system that represents geographical
   positions as distances to named reference points. Unlike proprietary
   word-based systems, OBL provides intuitive spatial relationships,
   offline functionality, and mathematical transparency while remaining
   accessible to non-technical users.

   OBL addresses limitations of existing geocoding systems by combining
   the precision of coordinate-based systems with the interpretability
   of natural language descriptions. The system supports urban areas
   using Points of Interest (POIs), rural regions using culturally-
   relevant grid names, and remote areas with widely-spaced reference
   points.

Status of This Memo

   This Internet-Draft is submitted in full conformance with the
   provisions of BCP 78 and BCP 79.

   Internet-Drafts are working documents of the Internet Engineering
   Task Force (IETF). Note that other groups may also distribute
   working documents as Internet-Drafts. The list of current Internet-
   Drafts is at https://datatracker.ietf.org/drafts/current/.

   Internet-Drafts are draft documents valid for a maximum of six months
   and may be updated, replaced, or obsoleted by other documents at any
   time. It is inappropriate to use Internet-Drafts as reference
   material or to cite them other than as "work in progress."

   This Internet-Draft will expire on 2 February 2026.

Copyright Notice

This document is an early draft of the Open Beacon Locator (OBL) specification 
and is published for open community feedback.

Until formally submitted to the IETF, this document is released under the 
[Creative Commons CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/). 
You are free to use, adapt, and redistribute this document or its contents, with or without attribution.

Contributions via pull request, issue, or suggestion are welcome under the same license.

**Planned IETF Submission**:  
If and when this draft is submitted to the IETF, it will become subject to the 
[IETF Trust Legal Provisions](https://trustee.ietf.org/license-info) under BCP 78 and BCP 79. 
The final IETF version will carry the appropriate copyright notice and legal boilerplate.

Table of Contents

   1.  Introduction
     1.1.  Background
     1.2.  Terminology
   2.  System Architecture
     2.1.  Encoding Formats
     2.2.  Examples
     2.3.  Height Encoding
   3.  Reference Point System
     3.1.  Point of Interest (POI) Beacons
     3.2.  Cultural Grid-Based Beacons
     3.3.  Phonetic Separation Requirements
   4.  Regional Context System
   5.  Position Calculation
   6.  Implementation Guidelines
   7.  Multiple Encoding Support
   8.  Internationalization
   9.  Security Considerations
   10. IANA Considerations
   11. Comparison with Existing Systems
   12. Example Implementations
   13. Database Size and Scalability
   14. References
   Appendix A.  Regional Naming Guidelines
   Appendix B.  Distance Scaling Algorithm
   Appendix C.  Cultural Naming Examples

1.  Introduction

1.1.  Background

Current location encoding systems fall into three categories:
- **Coordinate systems** (lat/lon, UTM): Precise but opaque to users
- **Grid systems** (Plus Codes, Geohash): Mathematical but abstract
- **Word systems** (What3Words): Memorable but proprietary and arbitrary

OBL bridges this gap by encoding locations as distances to recognizable landmarks, providing both precision and intuitive understanding.

1.2.  Terminology

   The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
   "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
   "OPTIONAL" in this document are to be interpreted as described in BCP
   14 [RFC2119] [RFC8174] when, and only when, they appear in all
   capitals, as shown here.

   Beacon: A named reference point (POI or grid intersection) that MUST
      be uniquely identifiable within its regional context.

   Distance: Measurement in meters from current position to beacon that
      MUST be encoded as a positive integer.

   Flag: Intersection selector (N/S/E/W) for 2-beacon disambiguation
      that MUST select which of the two circle intersection points to
      use.

   POI: Point of Interest (landmarks, buildings, natural features) that
      SHOULD be culturally relevant to the local population.

   Grid Point: Defined reference intersection using regional naming
      that MUST follow cultural naming conventions.

   Region Prefix: Optional geographical context for disambiguation that
      MAY be included to resolve beacon name conflicts.

2.  System Architecture

2.1.  Encoding Formats

   OBL implementations MUST support the following standardized encoding
   formats with optional regional context:

   Two-Beacon Format:
      [REGION:]Distance-Beacon-Distance-Beacon-Flag[/Height]

   Three-Beacon Format:
      [REGION:]Distance-Beacon-Distance-Beacon-Distance-Beacon[/Height]

   Implementations MUST support both formats. The two-beacon format
   MUST include a directional flag (N, S, E, or W) to resolve the
   ambiguity of circle intersections. The three-beacon format SHOULD
   be preferred when sufficient beacons are available due to improved
   accuracy.

2.2.  Examples

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

2.3.  Height Encoding

   Implementations MUST support the following height encoding formats:

   Metric (default): /12 (12 meters above sea level)
      Height values MUST be encoded as integers followed by optional
      unit suffix.

   Imperial: /40ft, /500yd (with unit suffix)
      Imperial units MUST include the unit suffix (ft, yd, mi).

   Floor levels: /3FL, /B2 (floors, basement levels)
      Floor notation MUST use FL for floors above ground and B for
      basement levels.

3.  Reference Point System

3.1.  Point of Interest (POI) Beacons

   POI beacons MUST be organized in a hierarchical tier system:

   Tier 1 - Global Landmarks:
      Eiffel, BigBen, StatueLiberty
      These MUST be internationally recognized with abbreviated names.

   Tier 2 - National Landmarks:
      BTor (Brandenburg Gate), Neuschwanstein
      These MUST be nationally significant and regionally unique.

   Tier 3 - Regional Centers:
      HH-Rathaus (Hamburg City Hall), M-Rathaus (Munich)
      These MUST have city-level significance with disambiguation
      prefixes when necessary.

   Tier 4 - Local Landmarks:
      Rotes-Rathaus, Alte-Kirche
      These SHOULD include qualifiers to ensure local uniqueness.

3.2.  Cultural Grid-Based Beacons

   For areas lacking sufficient POIs, implementations MUST use
   regional language to create memorable grid-based beacon names:

**Dutch regions:** Bromfiets, Sneev, Grachten
**Bavarian regions:** Watschn, Suppengrün, Biergarten  
**Frisian regions:** Terp, Weide, Dijk
**North German:** Dösbaddel, Klönschnack, Sabbel

3.3.  Phonetic Separation Requirements

   To prevent confusion from mishearing or misspelling beacon names,
   implementations MUST enforce minimum separation distances:

   Phonetically similar beacons: MUST be >50km apart
   Single-letter differences: MUST be >100km apart in remote areas
   Rhyming names: SHOULD be >25km apart

   Implementation Requirements:
   - Implementations MUST use phonetic similarity algorithms (such as
     Soundex or Metaphone) for similarity detection
   - Regional language committees MUST verify phonetic distinctness
   - Automatic conflict detection MUST be performed during beacon
     placement

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

4.  Regional Context System

4.1.  Optional Region Prefixes

```
[No prefix]: Local context assumed
BERLIN: City-level disambiguation
BAYERN: State/province level  
ATLANTIC: Ocean/remote area
```

4.2.  Automatic Context Detection

   Implementations SHOULD support automatic context detection:
   - GPS location SHOULD determine default region
   - Applications SHOULD suggest region prefix when ambiguous
   - Emergency services MAY operate without prefixes in local context

4.3.  Distance Scaling by Region

   Implementations MUST support distance scaling by region type:
   Urban areas: 10m-999m (3 digits maximum)
   Suburban areas: 100m-9999m (4 digits maximum)
   Rural/Ocean: 1km-99999m (5 digits maximum)
   Islands: Dense spacing regardless of remoteness

**Rationale for closer urban spacing:**
- Human distance estimation accuracy decreases with range
- 150m: easily estimated ("about 150 meters")
- 1500m: roughly estimated ("about 1.5 kilometers") 
- 15000m: very roughly estimated ("about 15 kilometers")
- Closer beacons enable more user-friendly distance values

5.  Position Calculation

5.1.  Two-Beacon Trilateration

   Two circles intersect at two points. Implementations MUST use
   cardinal indicators to resolve ambiguity:

```
150-Eiffel-200-Arc-N
```
- Circle 1: 150m radius around Eiffel Tower
- Circle 2: 200m radius around Arc de Triomphe  
- N flag: Select northernmost intersection point

5.2.  Three-Beacon Trilateration

   Three circles provide unique intersection within measurement
   tolerance. Implementations SHOULD prefer three-beacon encoding
   when sufficient beacons are available:

```
150-Eiffel-200-Arc-180-Louvre
```

5.3.  Positioning Accuracy

   Position accuracy depends heavily on beacon intersection angles.
   Implementations MUST consider the following accuracy expectations:

   Two-beacon intersection angles:
   - 90° intersection: ~5m accuracy (optimal)
   - 60° intersection: ~6m accuracy (good)  
   - 45° intersection: ~8m accuracy (acceptable)
   - 30° intersection: ~11m accuracy (usable for most applications)
   - <30° intersection: >20m accuracy (SHOULD be avoided)

   Three-beacon systems: Provide ~3m accuracy regardless of
   intersection angles through redundancy and error correction.

   Practical implications: Even 30m accuracy easily locates shops,
   restaurants, and meeting points. Unlike competing systems where
   errors can result in globally distant locations, OBL positioning
   errors remain locally bounded.

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

9.  Security Considerations

   This section addresses security considerations for the Open Beacon
   Locator system, including privacy, data integrity, authentication,
   and potential attack vectors.

9.1.  Privacy and Location Disclosure

   OBL implementations MUST consider the privacy implications of
   location encoding and sharing:

   Location Privacy: OBL codes inherently reveal approximate location
   information. Implementations SHOULD provide mechanisms to control
   the precision of encoded locations through distance rounding or
   beacon selection algorithms.

   Offline Operation: The system MUST support offline calculation
   capability to prevent mandatory disclosure of location queries to
   third parties. Implementations SHOULD NOT require network
   connectivity for basic encoding and decoding operations.

   Regional Context Leakage: Optional region prefixes MAY reveal
   broader geographical context. Implementations SHOULD allow users to
   omit region prefixes when local context is sufficient.

   Tracking Resistance: Unlike centralized systems, OBL MUST NOT
   require user registration or account creation for basic
   functionality. Implementations SHOULD NOT log or transmit user
   queries for encoding or decoding operations.

9.2.  Data Integrity and Authentication

   Beacon Database Integrity: Implementations MUST verify the
   integrity of beacon databases to prevent location spoofing attacks.
   Database updates SHOULD use cryptographic signatures to ensure
   authenticity.

   Beacon Verification: Regional beacon databases MUST implement
   community verification processes to prevent malicious beacon
   insertion or modification. Implementations SHOULD provide mechanisms
   to report and verify suspicious beacon data.

   Coordinate Validation: Implementations MUST validate that decoded
   coordinates fall within expected geographical bounds. Invalid
   coordinates SHOULD be rejected with appropriate error messages.

   Fallback Mechanisms: Systems MUST implement fallback procedures
   when primary beacon references become unavailable or compromised.
   Alternative beacon selections SHOULD maintain equivalent location
   accuracy.

9.3.  Denial of Service and Availability

   Database Availability: Implementations MUST ensure beacon database
   availability through distributed storage or caching mechanisms.
   Single points of failure SHOULD be avoided in critical
   deployments.

   Resource Exhaustion: Encoding algorithms MUST include safeguards
   against resource exhaustion attacks through excessive computation
   requests. Rate limiting SHOULD be implemented where appropriate.

   Beacon Pollution: Systems MUST resist attempts to pollute beacon
   databases with invalid or misleading entries. Community moderation
   and reputation systems SHOULD be employed.

9.4.  Cryptographic Considerations

   Database Signatures: Beacon databases SHOULD be signed using
   established cryptographic standards (e.g., ECDSA with P-256 or
   Ed25519). Signature verification MUST be performed before using
   beacon data.

   Hash Verification: Individual beacon entries SHOULD include
   cryptographic hashes to detect tampering. Implementations MUST
   verify these hashes before using beacon coordinates.

   Key Management: Systems requiring cryptographic verification MUST
   implement secure key distribution and rotation mechanisms.
   Compromised keys SHOULD be revocable through established
   certificate revocation mechanisms.

9.5.  Patent and Intellectual Property

   Patent Freedom: OBL builds on established public domain
   technologies including trilateration (ancient), DME principles
   (1940s aviation standard), and cultural naming conventions
   (unpatentable expressions). Implementations SHOULD avoid
   incorporation of patented algorithms or methodologies.

   Trademark Considerations: Beacon names MUST respect existing
   trademark rights. Regional naming committees SHOULD verify that
   proposed beacon names do not infringe on registered trademarks.

9.6.  Emergency Services and Safety

   Accuracy Requirements: Implementations used for emergency services
   MUST provide location accuracy sufficient for first responder
   navigation. Accuracy estimates SHOULD be provided with all decoded
   locations.

   Reliability Standards: Safety-critical implementations MUST meet
   appropriate reliability and availability standards for their
   intended use case. Backup systems SHOULD be available for critical
   deployments.

   Error Handling: Systems MUST provide clear error messages for
   invalid or ambiguous location codes. Silent failures that could
   misdirect emergency responders MUST NOT occur.

9.7.  International and Cross-Border Considerations

   Jurisdictional Issues: Beacon databases MAY be subject to different
   legal jurisdictions. Implementations SHOULD consider applicable
   laws regarding location data and privacy in relevant jurisdictions.

   Cultural Sensitivity: Regional naming conventions MUST respect
   cultural sensitivities and avoid potentially offensive or
   inappropriate terms. Community oversight SHOULD include diverse
   cultural representation.

   Export Controls: Implementations SHOULD consider applicable export
   control regulations for location-based technologies, particularly
   for high-precision applications.

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

10.  IANA Considerations

   This document makes no requests of IANA. The Open Beacon Locator
   system operates independently of existing URI schemes, domain name
   systems, and protocol registries.

   Future extensions to OBL that require standardized identifiers or
   protocol elements MAY necessitate IANA registration, but such
   extensions are beyond the scope of this specification.

14.  References

14.1.  Normative References

   [RFC2119]  Bradner, S., "Key words for use in RFCs to Indicate
              Requirement Levels", BCP 14, RFC 2119,
              DOI 10.17487/RFC2119, March 1997,
              <https://www.rfc-editor.org/info/rfc2119>.

   [RFC8174]  Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC
              2119 Key Words", BCP 14, RFC 8174,
              DOI 10.17487/RFC8174, May 2017,
              <https://www.rfc-editor.org/info/rfc8174>.

   [WGS84]    National Imagery and Mapping Agency, "Department of
              Defense World Geodetic System 1984: Its Definition and
              Relationships with Local Geodetic Systems", Technical
              Report 8350.2, Third Edition, 2000.

14.2.  Informative References

   [DME]      International Civil Aviation Organization, "Aeronautical
              Telecommunications: Radio Navigation Aids", Annex 10,
              Volume I, Seventh Edition, 2018.

   [OSM]      OpenStreetMap Foundation, "OpenStreetMap",
              <https://www.openstreetmap.org>.

   [PLUS]     Google Inc., "Open Location Code Specification",
              <https://github.com/google/open-location-code>.

   [W3W]      What3Words Ltd., "What3Words Algorithm",
              <https://what3words.com/about>.

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

Author's Address

   Malte Hoeltken
   Email: malte@hoeltken.de
