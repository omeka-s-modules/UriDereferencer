'use strict'

UriDereferencer.addService({
    getName() {
        // https://www.wikidata.org/wiki/Wikidata:Data_access#Linked_Data_interface
        return 'Wikidata';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://www.wikidata.org/wiki/Special:EntityData/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json['entities'][match[1]]['labels']['en']['value'])) {
            data.set('Label', json['entities'][match[1]]['labels']['en']['value']);
        }
        if (UriDereferencer.isset(() => json['entities'][match[1]]['descriptions']['en']['value'])) {
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
UriDereferencer.addService({
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
        // http://id.loc.gov/
        return 'Library of Congress Authorities and Vocabularies';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
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
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value'])) {
            data.set('Label', json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value']);
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'])) {
            data.set('Pref label', json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']);
        }
        const altLabels = [];
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2008/05/skos-xl#altLabel'])) {
            for (let altLabel of json[index]['http://www.w3.org/2008/05/skos-xl#altLabel']) {
                if (altLabel['@value']) {
                    altLabels.push(altLabel['@value']);
                }
            }
            if (altLabels) {
                data.set('Alt Label', altLabels.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value'])) {
            data.set('Definition', json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value']);
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value'])) {
            data.set('Note', json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value']);
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
UriDereferencer.addService({
    getName() {
        // https://wiki.dbpedia.org/OnlineAccess#2%20Linked%20Data
        return 'DBpedia';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `http://dbpedia.org/data/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label'])) {
            for (let label of json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label']) {
                if ('en' === label['lang']) {
                    data.set('Label', label['value']);
                }
            }
        }
        if (UriDereferencer.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment'])) {
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
UriDereferencer.addService({
    getName() {
        // http://www.getty.edu/research/tools/vocabularies/lod/
        return 'Getty Vocabularies (AAT, TGN, ULAN)';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
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
        if (UriDereferencer.isset(() => json['results']['bindings'][0]['Term']['value'])) {
            data.set('Term', json['results']['bindings'][0]['Term']['value']);
        }
        if (UriDereferencer.isset(() => json['results']['bindings'][0]['ScopeNote']['value'])) {
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
UriDereferencer.addService({
    getName() {
        // https://www.geonames.org/
        return 'Geonames';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // Note that Geonames does not provide a JSON representation. Use the
        // RDF representation instead.
        const match = this.getMatch(uri);
        return `http://www.geonames.org/${match[1]}/about.rdf`;
    },
    getMarkup(uri, text) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const data = new Map();
        data.set('Name', this.getNodeText(xmlDoc, '//gn:Feature/gn:name'));
        data.set('Official name', this.getNodeText(xmlDoc, '//gn:Feature/gn:officialName[lang("en")]'));
        data.set('Latitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:lat'));
        data.set('Longitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:long'));
        data.set('Altitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:alt'));
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/www\.geonames\.org\/(.+)$/);
    },
    getNodeText(xmlDoc, xpathExpression) {
        const namespaceResolver = function(prefix) {
            const ns = {
                'gn': 'http://www.geonames.org/ontology#',
                'wgs84_pos': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
            };
            return ns[prefix] || null;
        };
        const xpathResult = xmlDoc.evaluate(xpathExpression, xmlDoc, namespaceResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return xpathResult.singleNodeValue ? xpathResult.singleNodeValue.textContent : null;
    }
});
UriDereferencer.addService({
    getName() {
        return 'OCLC VIAF';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://viaf.org/viaf/${match[1]}/viaf.json`;
    },
    getMarkup(uri, text) {
        // Note that we're prioritizing Library of Congress (LC) as the source.
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json['mainHeadings']['data'])) {
            const headings = [];
            for (let heading of json['mainHeadings']['data']) {
                if (heading['sources']['s'].includes('LC')) {
                    headings.push(heading['text']);
                }
            }
            if (headings.length) {
                data.set('Main headings', headings.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json['nameType'])) {
            data.set('Name type', json['nameType']);
        }
        if (UriDereferencer.isset(() => json['fieldOfActivity']['data'])) {
            for (let fields of json['fieldOfActivity']['data']) {
                if ('LC' === fields['sources']['s']) {
                    data.set('Field of activity', fields['text']);
                }
            }
        }
        if (UriDereferencer.isset(() => json['occupation']['data'])) {
            const occupations = [];
            for (let occupation of json['occupation']['data']) {
                if ('LC' === occupation['sources']['s']) {
                    occupations.push(occupation['text']);
                }
            }
            if (occupations.length) {
                data.set('Occupation', occupations.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json['birthDate'])) {
            data.set('Birth date', json['birthDate']);
        }
        if (UriDereferencer.isset(() => json['deathDate'])) {
            data.set('Death date', json['deathDate']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/www\.viaf\.org\/viaf\/(.+)$/);
    }
});
