# Contributing to OBL

Welcome! OBL needs your help to become the open standard for human-readable location codes.

**This is a concept project looking for contributors of all kinds - not just programmers!**

## Why Contribute?

OBL aims to democratize location sharing by creating an open alternative to proprietary systems like What3Words. Instead of random word combinations, OBL uses intuitive distances to landmarks: `150-FlRathaus-280-Hafenspitze-N` immediately tells you "150m from city hall, 280m from harbor point."

## Ways to Contribute

### **Geographic Knowledge** (No coding required!)
- **Add local landmarks**: Know your city? Help identify the 20-50 most important POIs
- **Verify coordinates**: Check that beacon locations are accurate on OpenStreetMap
- **Cultural naming**: Suggest authentic regional names for grid references
- **Translation**: Beacon names and descriptions in your language

### **Documentation & Communication**
- **Write user guides**: How would emergency services use this?
- **Create examples**: Show OBL codes for your hometown landmarks
- **Improve explanations**: Make the concept clearer for non-technical people
- **Blog posts & articles**: Spread awareness in your communities

### **Testing & Validation** 
- **Try the demo**: Click around and report when it gives weird results
- **Test real locations**: Do generated codes make sense to locals?
- **Check accuracy**: Use GPS to verify decoded positions
- **Edge case hunting**: Find places where the algorithm fails

###  **Algorithm & Math** (For the technically inclined)
- **Improve beacon selection**: Better algorithms for choosing landmarks
- **Optimize accuracy**: Enhance circle intersection calculations  
- **Handle edge cases**: What happens at country borders? Ocean areas?
- **Performance**: Make encoding/decoding faster

### **Code & Implementation** (Optional!)
- **Fix bugs**: The JavaScript demo has room for improvement
- **Add features**: Height encoding, regional prefixes, etc.
- **New platforms**: Mobile apps, browser extensions, API servers
- **Integrations**: OsmAnd plugins, QGIS tools, etc.

### **Community Building**
- **Emergency services outreach**: Connect with fire departments, ambulances
- **Academic partnerships**: Research collaborations with universities
- **Conference presentations**: CCC, FOSDEM, OpenStreetMap events
- **Regional coordination**: Organize beacon naming in your area

## Getting Started

### 1. **Understand the Concept** (5 minutes)
- Read the [VISION.md](VISION.md) - why does this matter?
- Try the [interactive demo](demo/index.html) - click around Flensburg
- Check the [technical RFC](docs/rfc.md) if you want math details

### 2. **Pick Your Contribution Style**

**Just want to help with local knowledge?**
- No GitHub account needed! Email suggestions to maintainers
- Comment on issues with local insights
- Verify landmarks exist and are correctly positioned

**Comfortable with text editing?**
- Fork the repo, edit Markdown files
- Submit pull requests with documentation improvements
- No coding experience required

**Want to hack on code?**
- The demo is pure HTML/CSS/JavaScript - no build system!
- Open `demo/index.html` in your browser and start experimenting
- All algorithms are in readable JavaScript files

### 3. **Start Small**

**Great first contributions:**
- Add 3-5 major landmarks for your city to the beacon database
- Fix a typo or improve an explanation you found confusing  
- Test the demo with locations you know well and report issues
- Translate beacon names or documentation to your language
- Write about OBL on social media or your blog

## The Simple Development Setup

**No complex environment needed!** This project intentionally avoids heavy tooling.

```bash
# Get the code
git clone https://github.com/aufwindmalte/open-beacon-locator  
cd open-beacon-locator

# Try the demo
cd demo/
python3 -m http.server 8000  # or just open index.html in browser
# Navigate to http://localhost:8000

# Edit and refresh - that's it!
```

**That's literally it.** No package managers, no build steps, no deployment pipelines. Just edit files and refresh your browser.

## Beacon Database Guidelines

### What Makes a Good Beacon?
- **Permanent**: Won't disappear in 5-10 years
- **Recognizable**: Locals know it by name  
- **Unambiguous**: "Rathaus" (which city hall?)
- **Well-distributed**: Not clustered together
- **Phonetically distinct**: Won't be confused when spoken

### Examples by Category

**Government & Public:**
- City halls, courthouses, major government buildings
- Train stations, airports, bus terminals
- Universities, hospitals, fire stations

**Historic & Cultural:**
- Churches, monuments, castles
- Museums, theaters, stadiums
- UNESCO sites, famous bridges

**Geographic Features:**
- Mountain peaks, major bridges
- Harbor points, lighthouse locations
- City center squares, major parks

### What to Avoid
- Commercial businesses (coffee shops, stores)
- Temporary structures
- Ambiguous names without city prefix
- Very similar names within 50km

## Community Standards

### Communication Style
- **Welcoming**: Assume good intentions
- **Practical**: Focus on making OBL work in real life
- **International**: Consider non-English speakers
- **Patient**: Explain technical concepts clearly

### Decision Making
- **RFC process**: Major changes get formal proposals
- **Community input**: Discuss significant decisions openly
- **Maintainer guidance**: Technical decisions when consensus unclear
- **Local authority**: Regional communities decide their own beacon names

## Recognition

Contributors are recognized through:
- **Git commit history**: Permanent record of your contributions
- **CONTRIBUTORS.md**: Hall of fame for significant contributors
- **Conference opportunities**: Speaking at events about your work
- **Academic collaboration**: Co-authorship on research papers

## Getting Help

### Questions About Contributing
- **GitHub Issues**: Ask questions, report problems  
- **Email maintainers**: Direct contact for sensitive discussions
- **Community forums**: General discussion (links TBD)

### Technical Support
- **Demo problems**: Open issues with screenshots/steps to reproduce
- **Algorithm questions**: Math and implementation discussions
- **Integration help**: Connecting OBL to other systems

## License & Legal

- **Code**: GPL v3 (ensures permanent openness)
- **Documentation**: CC BY-SA 4.0 (freely shareable)
- **Beacon data**: Open Database License (ODbL)
- **Contributor Agreement**: Simple acceptance of license terms

---

## Ready to Help?

**Non-technical contributors:** Start by testing the demo with your local area and reporting what works/doesn't work.

**Technical contributors:** Check out the "good first issue" labels and dive into the readable JavaScript code.

**Geographic experts:** Help us build accurate beacon databases for more regions.

**Everyone:** Share OBL with people who might benefit - emergency services, outdoor enthusiasts, international travelers.

This project succeeds when **location sharing becomes open, intuitive, and culturally authentic**. Every contribution moves us toward that goal.

*Questions? Open an issue or contact maintainers directly. We're here to help!*
