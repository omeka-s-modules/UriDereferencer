'use strict'

LinkedDataDisplay.addService({
    getName() {
        return 'Wikidata';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint(uri) {
        const match = this.getMatch(uri);
        return `https://www.wikidata.org/wiki/Special:EntityData/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (LinkedDataDisplay.isset(() => json['entities'][match[1]]['labels']['en']['value'])) {
            data.set('Label', json['entities'][match[1]]['labels']['en']['value']);
        }
        if (LinkedDataDisplay.isset(() => json['entities'][match[1]]['descriptions']['en']['value'])) {
            data.set('Description', json['entities'][match[1]]['descriptions']['en']['value']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/www\.wikidata\.org\/wiki\/(Q.+)/);
    }
});
LinkedDataDisplay.addService({
    authorities: [
        // Subjects, Thesauri, Classification
        'subjects', 'classification', 'childrensSubjects', 'performanceMediums',
        // Agents
        'names',
        // Genre
        'genreForms',
        // Cataloging
        'demographicTerms',
    ],
    vocabularies: [
        // Subjects, Thesauri, Classification
        'graphicMaterials', 'ethnographicTerms', 'subjectSchemes',
        'classSchemes',
        // Agents
        'organizations',
        // Genre
        'marcgt', 'genreFormSchemes',
        // Languages
        'languages', 'iso639-1', 'iso639-2', 'iso639-5',
        // Geographic
        'countries', 'geographicAreas',
        // Cataloging
        'maspect', 'marcauthen', 'mbroadstd', 'carriers', 'mcolor',
        'contentTypes', 'descriptionConventions', 'mcapturestorage', 'menclvl',
        'mfont', 'mfiletype', 'mgeneration', 'mgroove', 'mstatus', 'millus',
        'maudience', 'issuance', 'mlayout', 'mediaTypes', 'mmusnotation',
        'mmusicformat', 'mplayback', 'mplayspeed', 'mpolarity', 'mpresformat',
        'mproduction', 'mprojection', 'frequencies', 'mrecmedium', 'mrectype',
        'mreductionratio', 'mregencoding', 'relators', 'mrelief',
        'resourceComponents', 'mscale', 'mscript', 'msoundcontent',
        'mspecplayback', 'msupplcont', 'mmaterial', 'mtactile', 'mtapeconfig',
        'mtechnique', 'mvidformat',
        // Preservation Vocabularies
        'preservation', // we get the rest for free!
    ],
    getName() {
        return 'Library of Congress Authorities and Vocabularies';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint(uri) {
        const match = this.getMatch(uri);
        return `http://id.loc.gov/${match[1]}/${match[2]}/${match[3]}.skos.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const index = json.findIndex(function(element) {
            // The relevant data is indexed by the URI set on the @id.
            return uri.replace(/\.html$/, '') == element['@id'];
        });
        const data = new Map();
        if (LinkedDataDisplay.isset(() => json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value'])) {
            data.set('Label', json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value']);
        }
        if (LinkedDataDisplay.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'])) {
            data.set('Pref label', json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']);
        }
        if (LinkedDataDisplay.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value'])) {
            data.set('Definition', json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value']);
        }
        if (LinkedDataDisplay.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value'])) {
            data.set('Note', json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value']);
        }
        const altLabels = [];
        if (LinkedDataDisplay.isset(() => json[index]['http://www.w3.org/2008/05/skos-xl#altLabel'])) {
            for (let altLabel of json[index]['http://www.w3.org/2008/05/skos-xl#altLabel']) {
                if (altLabel['@value']) {
                    altLabels.push(altLabel['@value']);
                }
            }
            if (altLabels) {
                data.set('Alt Label', altLabels.join('; '));
            }
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        const re = new RegExp(`^http?:\/\/id\.loc\.gov\/(authorities|vocabulary)\/(${this.authorities.join('|')}|${this.vocabularies.join('|')})\/(.+?)(\.html)?$`);
        return uri.match(re);
    }
});
LinkedDataDisplay.addService({
    getName() {
        return 'DBpedia';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint(uri) {
        const match = this.getMatch(uri);
        return `http://dbpedia.org/data/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (LinkedDataDisplay.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label'])) {
            for (let label of json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label']) {
                if ('en' === label['lang']) {
                    data.set('Label', label['value']);
                }
            }
        }
        if (LinkedDataDisplay.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment'])) {
            for (let comment of json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment']) {
                if ('en' === comment['lang']) {
                    data.set('Comment', comment['value']);
                }
            }
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        // Does not support Category URLs
        return uri.match(/^https?:\/\/dbpedia\.org\/page\/((?!Category:).+)$/);
    }
});
LinkedDataDisplay.addService({
    getName() {
        return 'Getty Vocabularies (AAT, TGN, ULAN)';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint(uri) {
        // Note that Getty doesn't enable cross-origin resource sharing (CORS),
        // so we can't directly fetch the JSON representations. Use the SPARQL
        // endpoint instead.
        const match = this.getMatch(uri);
        const sparql = `
        SELECT ?Subject ?Term ?ScopeNote {
            ?Subject a skos:Concept ;
            skos:inScheme ${match[1]}: ;
            dc:identifier "${match[2]}" ;
            skosxl:prefLabel [xl:literalForm ?Term] .
            OPTIONAL {?Subject skos:scopeNote [
                dct:language gvp_lang:en;
                rdf:value ?ScopeNote]
            }
        }`;
        return `http://vocab.getty.edu/sparql.json?query=${encodeURIComponent(sparql)}`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (LinkedDataDisplay.isset(() => json['results']['bindings'][0]['Term']['value'])) {
            data.set('Term', json['results']['bindings'][0]['Term']['value']);
        }
        if (LinkedDataDisplay.isset(() => json['results']['bindings'][0]['ScopeNote']['value'])) {
            data.set('Scope note', json['results']['bindings'][0]['ScopeNote']['value']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/vocab\.getty\.edu\/(aat|tgn|ulan)\/(.+)$/);
    }
});
