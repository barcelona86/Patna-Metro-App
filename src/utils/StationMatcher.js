import Fuse from 'fuse.js';
import stationsData from './Stations.json';

class StationMatcher {
    constructor() {
        this.stations = stationsData.stations;
        this.synonymMap = new Map();
        this.abbreviationMap = new Map();
        this.searchableItems = [];

        this.buildAbbreviationMap();
        this.buildSynonymMap();
        this.buildSearchIndex();
    }

    // 3. Generates phonetic variations for spelling mistakes
    generatePhoneticVariations(text) {
        const variations = new Set([text]);
        const engText = text.toLowerCase().trim();

        // Typical spelling mistakes / phonetic pairs
        const substitutions = [
            { from: /ee/g, to: 'i' },
            { from: /oo/g, to: 'u' },
            { from: /ph/g, to: 'f' },
            { from: /v/g, to: 'b' },
            { from: /z/g, to: 'j' },
            { from: /sh/g, to: 's' },
            { from: /cch/g, to: 'ch' },
            { from: /ou/g, to: 'au' },
            { from: /gh/g, to: 'g' },
            { from: /dh/g, to: 'd' },
            { from: /th/g, to: 't' },
            { from: /bh/g, to: 'b' },
            { from: /kh/g, to: 'k' },
            { from: /jn/g, to: 'junction' },
            { from: /junction/g, to: 'jn' },
            { from: /more/g, to: 'mor' },
            { from: /mor/g, to: 'more' },
            { from: /zoo/g, to: 'ju' }
        ];

        substitutions.forEach(({ from, to }) => {
            const variant = engText.replace(from, to);
            if (variant !== engText) variations.add(variant);
        });

        // Add space separated alternatives (e.g. rajabazar -> raja bazar)
        // If there's no space, add spaces before common suffixes
        const addSpace = engText.replace(/(pura|nagar|bazar|bhawan|chak|maidan)/g, ' $1');
        if (addSpace !== engText) variations.add(addSpace.trim());

        const removeSpace = engText.replace(/\s+/g, '');
        if (removeSpace !== engText) variations.add(removeSpace);

        return Array.from(variations);
    }

    // 4. Handles Abbreviations
    buildAbbreviationMap() {
        // Standard abbreviations
        this.abbreviationMap.set('pj', 'Patna Junction');
        this.abbreviationMap.set('pnj', 'Patna Junction');
        this.abbreviationMap.set('pmc', 'PMCH');
        this.abbreviationMap.set('pmch', 'PMCH');
        this.abbreviationMap.set('rps', 'RPS Mor');
        this.abbreviationMap.set('isbt', 'New ISBT');
        this.abbreviationMap.set('zoo', 'Patna Zoo');
        this.abbreviationMap.set('cnlu', 'CNLU');

        // Auto-generate abbreviations based on acronyms
        this.stations.forEach(station => {
            const nameWords = station.name.split(' ');
            if (nameWords.length > 1) {
                const abbr = nameWords.map(w => w[0].toLowerCase()).join('');
                if (abbr.length >= 2 && !this.abbreviationMap.has(abbr)) {
                    this.abbreviationMap.set(abbr, station.name);
                }
            }
        });
    }

    // 2. Comprehensive synonym matching
    buildSynonymMap() {
        this.stations.forEach(station => {
            // Include base name
            this.synonymMap.set(station.name.toLowerCase().trim(), station.name);

            station.synonyms.forEach(synonym => {
                const lowerSyn = synonym.toLowerCase().trim();
                this.synonymMap.set(lowerSyn, station.name);

                // Also add phonetic variations to mapping
                const variations = this.generatePhoneticVariations(lowerSyn);
                variations.forEach(v => {
                    if (!this.synonymMap.has(v)) {
                        this.synonymMap.set(v, station.name);
                    }
                });
            });
        });
    }

    // 1. Fuse.js with optimal configuration
    buildSearchIndex() {
        // Collect all possible valid names (name + synonyms + abbreviations + phonetics)
        const entriesMap = new Map();

        const addEntry = (text, name, weight) => {
            if (!text || text.length < 2) return;
            if (!entriesMap.has(text)) {
                entriesMap.set(text, { name, text, weight });
            }
        };

        this.stations.forEach(station => {
            addEntry(station.name.toLowerCase(), station.name, 1.0);

            station.synonyms.forEach(syn => {
                addEntry(syn.toLowerCase(), station.name, 1.0);
                const variations = this.generatePhoneticVariations(syn.toLowerCase());
                variations.forEach(v => addEntry(v, station.name, 0.8));
            });
        });

        this.abbreviationMap.forEach((name, abbr) => {
            addEntry(abbr, name, 1.0);
        });

        this.searchableItems = Array.from(entriesMap.values());

        this.fuse = new Fuse(this.searchableItems, {
            keys: [{ name: 'text', weight: 1 }],
            threshold: 0.45,
            distance: 100,            // How far the match can be from the string start
            includeScore: true,       // Return match score
            ignoreLocation: true,     // Match anywhere in the string
            minMatchCharLength: 2,
            findAllMatches: true
        });
    }

    // 9. Normalizes station names
    normalizeStationName(input) {
        if (!input) return input;
        const lower = input.toLowerCase().trim();
        if (this.abbreviationMap.has(lower)) return this.abbreviationMap.get(lower);
        if (this.synonymMap.has(lower)) return this.synonymMap.get(lower);
        return input; // Fallback
    }

    areSameStations(source, destination) {
        return this.normalizeStationName(source) === this.normalizeStationName(destination);
    }

    // 5. Provides real-time suggestions
    getSuggestions(partial, limit = 4) {
        if (!partial || partial.trim().length < 2) return [];
        const cleanPartial = partial.toLowerCase().trim();

        // Exact abbreviation check
        if (this.abbreviationMap.has(cleanPartial)) {
            return [this.abbreviationMap.get(cleanPartial)];
        }

        const results = this.fuse.search(cleanPartial);
        const uniqueNames = [...new Set(results.map(r => r.item.name))];
        return uniqueNames.slice(0, limit);
    }

    // Main entry point for deciding source/destination
    findStations(input) {
        if (!input || input.trim().length === 0) return [];

        let lowerInput = input.toLowerCase().trim();
        const found = [];

        // 6. Ignore common stop words
        const exactStopWordsList = [
            'से', 'to', 'जाना', 'है', 'मुझे', 'करना', 'चाहिए', 'के', 'लिए', 'और', 'या',
            'from', 'in', 'at', 'between', 'route', 'path', 'tell', 'show', 'please',
            'kindly', 'i', 'want', 'go'
        ];

        const addMatch = (name, index, method, score) => {
            if (!found.some(f => f.name === name)) {
                found.push({ name, index, method, score });
            }
        };

        const maskString = (str, start, length) => {
            return str.substring(0, start) + '#'.repeat(length) + str.substring(start + length);
        };

        // STAGE 7.1: Exact Substring Matching (Synonyms & Phonetic Variations)
        // Sort keys by length descendant so larger phrases match before smaller ones
        const sortedAliases = [...this.synonymMap.entries()].sort((a, b) => b[0].length - a[0].length);

        // Check abbreviations boundary-matched
        this.abbreviationMap.forEach((stationName, abbr) => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'i');
            const match = lowerInput.match(regex);
            if (match) {
                addMatch(stationName, match.index, 'exact_abbrev', 0.0);
                lowerInput = maskString(lowerInput, match.index, abbr.length);
            }
        });

        sortedAliases.forEach(([alias, stationName]) => {
            if (alias.length < 2) return;
            const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedAlias}\\b`, 'i');
            const match = lowerInput.match(regex);

            if (match) {
                addMatch(stationName, match.index, 'exact_synonym', 0.0);
                lowerInput = maskString(lowerInput, match.index, alias.length);
            }
        });

        // STAGE 7.2: Pattern Matching Regex context (e.g. A to B)
        if (found.length < 2) {
            const patternInput = input.toLowerCase().trim();
            const patterns = [
                /(.+?)\s+(?:to|-|->|–)\s+(.+)/i,             // A to B
                /from\s+(.+?)\s+to\s+(.+)/i,                // from A to B
                /(.+?)\s+से\s+(.+?)\s+(?:जाना|के लिए|का)/i, // A से B जाना
                /(.+?)\s+से\s+(.+)/i,                       // A से B
                /between\s+(.+?)\s+and\s+(.+)/i             // between A and B
            ];

            for (const pattern of patterns) {
                const matchInfo = patternInput.match(pattern);
                if (matchInfo) {
                    const [_, srcStr, destStr] = matchInfo;

                    const matchFuzzy = (text) => {
                        const cleanStr = text.split(/\s+/).filter(w => !exactStopWordsList.includes(w)).join(' ');
                        const res = this.fuse.search(cleanStr);
                        return (res.length > 0 && res[0].score <= 0.45) ? res[0].item.name : null;
                    };

                    const sName = matchFuzzy(srcStr);
                    const dName = matchFuzzy(destStr);

                    if (sName) addMatch(sName, 0, 'pattern_source', 0.1);
                    if (dName) addMatch(dName, patternInput.length, 'pattern_dest', 0.1);

                    if (sName && dName) break;
                }
            }
        }

        // STAGE 7.3: Word-by-Word Fuzzy Matching
        if (found.length < 2) {
            let cleanFuzzyInput = lowerInput;
            exactStopWordsList.forEach(w => {
                const regex = new RegExp(`\\b${w}\\b`, 'gi');
                cleanFuzzyInput = cleanFuzzyInput.replace(regex, ' ');
            });

            const tokens = cleanFuzzyInput.split(/\s+/).filter(w => w.length >= 2 && !/^#+$/.test(w));

            // Try bigrams
            for (let i = 0; i < tokens.length - 1; i++) {
                if (found.length >= 2) break;
                const bigram = tokens[i] + ' ' + tokens[i + 1];
                const res = this.fuse.search(bigram);

                if (res.length > 0 && res[0].score <= 0.45) {
                    addMatch(res[0].item.name, input.indexOf(tokens[i]), 'fuzzy_bigram', res[0].score);
                    tokens[i] = '#';
                    tokens[i + 1] = '#';
                }
            }

            // Unigrams
            tokens.forEach(word => {
                if (word === '#' || found.length >= 2) return;
                const res = this.fuse.search(word);
                // 8. Matches with confidence scores
                if (res.length > 0 && res[0].score <= 0.45) {
                    addMatch(res[0].item.name, input.indexOf(word), 'fuzzy_word', res[0].score);
                }
            });
        }

        // 10. Handle both English and Hindi seamlessly via indexing length & index
        found.sort((a, b) => a.index - b.index);

        return found.slice(0, 2).map(s => s.name);
    }
}

export default new StationMatcher();