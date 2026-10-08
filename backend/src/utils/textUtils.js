'use strict';

/**
 * Computes an estimated reading time for a given text.
 * Assumes an average reading speed of 200 words per minute.
 * @param {string} text - The content to measure
 * @returns {number} Estimated reading time in minutes (minimum 1)
 */
const computeReadTime = (text) => {
  const WORDS_PER_MINUTE = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

/**
 * Derives a short plain-text excerpt from Markdown content.
 * Strips common Markdown syntax before truncating.
 * @param {string} content - Raw Markdown string
 * @param {number} maxLength - Maximum characters (default 180)
 * @returns {string} Cleaned excerpt
 */
const deriveExcerpt = (content, maxLength = 180) => {
  const plain = content
    .replace(/#{1,6}\s+/g, '')      // Remove heading markers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.+?)\*/g, '$1')     // Remove italic markers
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '') // Remove code blocks
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')   // Keep link text
    .replace(/\n+/g, ' ')            // Collapse newlines
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
};

module.exports = { computeReadTime, deriveExcerpt };
