import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    // if no value, quit it!
    if(!this.value) {
      return searchResults.style.display = 'none';
    }

    // show the search results
    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if(res.data.length) {
          return searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
        }
        // notify user nothing came back
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
      })
      .catch(err => {
        console.error(err);
      });
  });

  // handle keyboard inputs
  searchInput.on('keyup', (e) => {
    // if key != ArrowUp, ArrowDown, or Enter, Fuck them!
    if(!['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) return;
    // Do shit!
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    
    if (e.key === 'ArrowDown' && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.key === 'ArrowDown') {
      next = items[0];
    } else if (e.key === 'ArrowUp' && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.key === 'ArrowUp') {
      next = items[items.length - 1];
    } else if (e.key === 'Enter' && current.href) {
      return window.location = current.href;
    }

    if(current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;