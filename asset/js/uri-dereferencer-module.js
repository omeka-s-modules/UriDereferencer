document.addEventListener('DOMContentLoaded', function(event) {
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        if (UriDereferencer.isDereferenceable(uriValue.href)) {
            // The data markup container.
            const container = document.createElement('div');
            container.className = 'uri-dereferencer-markup';

            // The toggle button.
            const toggleButton = document.createElement('button');
            toggleButton.className = 'uri-dereferencer-toggle';
            toggleButton.innerHTML = '-';
            toggleButton.style.display = 'none';
            toggleButton.onclick = function() {
                if ('none' === container.style.display) {
                    container.style.display = 'block';
                    this.innerHTML = '-';
                } else {
                    container.style.display = 'none';
                    this.innerHTML = '+';
                }
            };

            // The fetch button.
            const fetchButton = document.createElement('button');
            fetchButton.className = 'uri-dereferencer-fetch';
            fetchButton.innerHTML = '+';
            fetchButton.onclick = async function() {
                container.innerHTML = await UriDereferencer.dereference(uriValue.href);
                this.remove();
                toggleButton.style.display = 'inline';
            };

            uriValue.parentNode.appendChild(fetchButton);
            uriValue.parentNode.appendChild(toggleButton);
            uriValue.parentNode.appendChild(container);
        }
    }
});
