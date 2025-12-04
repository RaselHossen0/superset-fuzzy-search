/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ReactNode } from 'react';

/**
 * Highlights matching text in a string based on a search query.
 * Uses fuzzy matching to find similar substrings.
 * 
 * @param text - The text to search within
 * @param query - The search query to highlight
 * @returns ReactNode with highlighted matches wrapped in <mark> tags
 */
export function highlightText(text: string | number | null | undefined, query: string): ReactNode {
  if (!query || query.length < 2 || text === null || text === undefined) {
    return text;
  }

  const textStr = String(text);
  const queryLower = query.toLowerCase();
  const textLower = textStr.toLowerCase();

  // Find the best matching substring using simple fuzzy matching
  const matchIndex = textLower.indexOf(queryLower);
  
  if (matchIndex !== -1) {
    // Exact substring match found
    const before = textStr.slice(0, matchIndex);
    const match = textStr.slice(matchIndex, matchIndex + query.length);
    const after = textStr.slice(matchIndex + query.length);
    
    return (
      <>
        {before}
        <mark style={{ 
          backgroundColor: '#fff3cd', 
          padding: '0 2px',
          borderRadius: '2px',
          fontWeight: 600,
        }}>
          {match}
        </mark>
        {after}
      </>
    );
  }

  // Try fuzzy matching - find similar substrings
  // This uses a simple approach: find substrings that share characters with the query
  const words = textStr.split(/\s+/);
  let hasMatch = false;
  
  const highlightedWords = words.map((word, index) => {
    const wordLower = word.toLowerCase();
    
    // Check if the word is similar to the query (simple fuzzy check)
    // Count matching characters
    let matchingChars = 0;
    for (const char of queryLower) {
      if (wordLower.includes(char)) {
        matchingChars++;
      }
    }
    
    // If more than 60% of query chars match, highlight the word
    const similarity = matchingChars / queryLower.length;
    
    if (similarity >= 0.6 && wordLower.length >= 2) {
      hasMatch = true;
      return (
        <span key={index}>
          {index > 0 ? ' ' : ''}
          <mark style={{ 
            backgroundColor: '#fff3cd', 
            padding: '0 2px',
            borderRadius: '2px',
            fontWeight: 600,
          }}>
            {word}
          </mark>
        </span>
      );
    }
    
    return (
      <span key={index}>
        {index > 0 ? ' ' : ''}{word}
      </span>
    );
  });

  return hasMatch ? <>{highlightedWords}</> : textStr;
}

export default highlightText;

