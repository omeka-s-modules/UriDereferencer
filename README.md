# URI Dereferencer

Dereferences URIs when viewing items, media, and item sets.

## URIs

This module will automatically dereference all "URI" data type values that match
a registered service. If you want your custom data types to be dereferenceable,
you must add the `uri-value-link` class to the anchor tag containing the URI.

## Linked data services

Linked data services are JavaScript objects that are responsible for dereferencing
URIs and returning linked data markup. This module already comes with several services:

- [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page)
- [DBpedia](https://wiki.dbpedia.org/)
- [Library of Congress Authorities and Vocabularies](http://id.loc.gov/)
- [Getty Vocabularies (AAT, TGN, ULAN)](https://www.getty.edu/research/tools/vocabularies/)
- [OCLC VIAF](https://www.oclc.org/en/viaf.html)
- [Geonames](https://www.geonames.org/)

You can enable your own linked data service objects by writing them against the
following interface and adding them to the global `UriDereferencer` object. For
example:

```js
UriDereferencer.addService({
    // Get the name of this service.
    getName() {
        return 'My Service';
    },
    // Is the URI a match for this service?
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    // Get the resource URL of a URI. Typically the resource URL dereferences to
    // an RDF file (JSON-LD, XML) that represents the URI.
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `http://example.com/vocab/${match[1]}.jsonld`;
    },
    // Get the markup derived from the resource.
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        return `
        <dl>
            <dt>Label</dt>
            <dd>${json['label']}</dd>
            <dt>Description</dt>
            <dd>${json['description']}</dd>
        </dl>`;
    },
    // Get the URI match (not part of the interface, but useful anyway).
    getMatch(uri) {
        return uri.match(/^https?:\/\/example\.com\/vocab\/(.+)$/);
    }
});
```
