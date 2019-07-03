'use strict'

LinkedDataDisplay.addService({
    getName: function() {
        return 'Wikidata';
    },
    isMatch: function(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint: function(uri) {
        const match = this.getMatch(uri);
        return `https://www.wikidata.org/wiki/Special:EntityData/${match[1]}.json`;
    },
    getMarkup: function(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const label = json['entities'][match[1]]['labels']['en']['value'];
        const description = json['entities'][match[1]]['descriptions']['en']['value'];
        return `
        <dl>
            <dt>Label</dt>
            <dd>${label}</dd>
            <dt>Description</dt>
            <dd>${description}</dd>
        </dl>`;
    },
    getMatch: function(uri) {
        return uri.match(/^https?:\/\/www\.wikidata\.org\/wiki\/(Q.+)/);
    }
});
LinkedDataDisplay.addService({
    getName: function() {
        return 'Library of Congress Subject Headings';
    },
    isMatch: function(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint: function(uri) {
        const match = this.getMatch(uri);
        return `http://id.loc.gov/authorities/subjects/${match[1]}.skos.json`;
    },
    getMarkup: function(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const prefLabel = json[0]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'];
        const note = json[0]['http://www.w3.org/2004/02/skos/core#note'][0]['@value'];
        const altLabels = [];
        for (let altLabel of json[0]['http://www.w3.org/2008/05/skos-xl#altLabel']) {
            if (altLabel['@value']) {
                altLabels.push(altLabel['@value']);
            }
        }
        return `
        <dl>
            <dt>Label</dt>
            <dd>${prefLabel}</dd>
            <dt>Note</dt>
            <dd>${note}</dd>
            <dt>Alt labels</dt>
            <dd>${altLabels.join('; ')}</dd>
        </dl>`;
    },
    getMatch: function(uri) {
        return uri.match(/^http?:\/\/id\.loc\.gov\/authorities\/subjects\/(.+?)(\.html)?$/);
    }
});
LinkedDataDisplay.addService({
    getName: function() {
        return 'DBpedia';
    },
    isMatch: function(uri) {
        return (null !== this.getMatch(uri));
    },
    getEndpoint: function(uri) {
        const match = this.getMatch(uri);
        return `http://dbpedia.org/data/${match[1]}.json`;
    },
    getMarkup: function(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const labels = json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label'];
        const comments = json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment'];
        let displayLabel;
        let displayComment;
        const displaySubjects = [];
        for (let label of labels) {
            if ('en' === label['lang']) {
                displayLabel = label['value'];
            }
        }
        for (let comment of comments) {
            if ('en' === comment['lang']) {
                displayComment = comment['value'];
            }
        }
        return `
        <dl>
            <dt>Label</dt>
            <dd>${displayLabel}</dd>
            <dt>Comment</dt>
            <dd>${displayComment}</dd>
        </dl>`;
    },
    getMatch: function(uri) {
        // Does not support Category URLs
        return uri.match(/^https?:\/\/dbpedia\.org\/page\/((?!Category:).+)$/);
    }
});
