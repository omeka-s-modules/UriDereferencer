# URI Dereferencer

Dereferences URIs when viewing items, media, and item sets.

## Dereferenceable URIs

Dereferenceable URIs are the backbone of [Linked Data](https://en.wikipedia.org/wiki/Linked_data).
They can be looked up (dereferenced) to provide useful information about the resource
that the URI identifies, which in turn refers to other URIs, and so on.

This module looks up URIs on the page and provides users a snapshot of linked data
without having to navigate away from the page. It will automatically dereference
all "URI" data type values that match a registered service. If you want your custom
data type values to be dereferenceable, you must add the `uri-value-link` class
to the anchor tag containing the URI.

## Linked data services

Linked data services are JavaScript objects that are responsible for dereferencing
URIs and returning information about the resource. This module already comes with
a handful of services:

- [DBpedia](https://wiki.dbpedia.org/)
- [Geonames](https://www.geonames.org/)
- [Getty Vocabularies](https://www.getty.edu/research/tools/vocabularies/)
- [LC Linked Data Service](http://id.loc.gov/)
- [OCLC VIAF](https://www.oclc.org/en/viaf.html)
- [OCLC FAST](http://fast.oclc.org/)
- [RDA Value Vocabularies](http://www.rdaregistry.info/termList/)
- [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page)
- [Gemeentegeschiedenis](https://www.gemeentegeschiedenis.nl/)

# Copyright

URIDereferencer is Copyright © 2019-present Corporation for Digital Scholarship, Vienna, Virginia, USA http://digitalscholar.org

The Corporation for Digital Scholarship distributes the Omeka source code
under the GNU General Public License, version 3 (GPLv3). The full text
of this license is given in the license file.

The Omeka name is a registered trademark of the Corporation for Digital Scholarship.

Third-party copyright in this distribution is noted where applicable.

All rights not expressly granted are reserved.
