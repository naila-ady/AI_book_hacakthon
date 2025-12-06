import React, { JSX, useState } from 'react';
import styles from './styles.module.css';
import { useHistory } from '@docusaurus/router';

interface SearchResult {
  title: string;
  url: string;
}

const mockSearchResults: SearchResult[] = [
  { title: 'Introduction to Physical AI', url: '/docs/physical-ai/introduction' },
  { title: 'Basics of Humanoid Robotics', url: '/docs/humanoid-robotics/basics' },
  // Add more mock results as your book content grows
];

function SearchBar(): JSX.Element {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const history = useHistory();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 1) {
      const filteredResults = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  const navigateToResult = (url: string) => {
    history.push(url);
    setQuery(''); // Clear search bar on navigation
    setResults([]);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      {query.length > 1 && results.length > 0 && (
        <ul className={styles.searchResults}>
          {results.map((result) => (
            <li key={result.url} onClick={() => navigateToResult(result.url)}>
              {result.title}
            </li>
          ))}
        </ul>
      )}
      {query.length > 1 && results.length === 0 && (
        <ul className={styles.searchResults}>
          <li>No results found.</li>
        </ul>
      )}
    </div>
  );
}

export default SearchBar;