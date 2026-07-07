import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { FaUpload, FaFileCsv, FaDatabase, FaDownload, FaExclamationCircle } from 'react-icons/fa';

// Predefined high-quality demo data for instantaneous testing and visual excellence
export const DEMO_PROBLEMS = [
  { ID: "1", Title: "Two Sum", Difficulty: "Easy", Acceptance: "52.3%", Frequency: "98.5%", URL: "https://leetcode.com/problems/two-sum/" },
  { ID: "2", Title: "Add Two Numbers", Difficulty: "Medium", Acceptance: "43.1%", Frequency: "85.2%", URL: "https://leetcode.com/problems/add-two-numbers/" },
  { ID: "3", Title: "Longest Substring Without Repeating Characters", Difficulty: "Medium", Acceptance: "34.8%", Frequency: "91.0%", URL: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { ID: "4", Title: "Median of Two Sorted Arrays", Difficulty: "Hard", Acceptance: "39.5%", Frequency: "76.4%", URL: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { ID: "5", Title: "Longest Palindromic Substring", Difficulty: "Medium", Acceptance: "33.2%", Frequency: "82.1%", URL: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { ID: "11", Title: "Container With Most Water", Difficulty: "Medium", Acceptance: "54.6%", Frequency: "88.9%", URL: "https://leetcode.com/problems/container-with-most-water/" },
  { ID: "15", Title: "3Sum", Difficulty: "Medium", Acceptance: "34.1%", Frequency: "87.5%", URL: "https://leetcode.com/problems/3sum/" },
  { ID: "20", Title: "Valid Parentheses", Difficulty: "Easy", Acceptance: "41.0%", Frequency: "95.3%", URL: "https://leetcode.com/problems/valid-parentheses/" },
  { ID: "21", Title: "Merge Two Sorted Lists", Difficulty: "Easy", Acceptance: "64.2%", Frequency: "90.1%", URL: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { ID: "22", Title: "Generate Parentheses", Difficulty: "Medium", Acceptance: "73.5%", Frequency: "79.8%", URL: "https://leetcode.com/problems/generate-parentheses/" },
  { ID: "23", Title: "Merge k Sorted Lists", Difficulty: "Hard", Acceptance: "51.8%", Frequency: "81.2%", URL: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { ID: "33", Title: "Search in Rotated Sorted Array", Difficulty: "Medium", Acceptance: "40.5%", Frequency: "84.3%", URL: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { ID: "42", Title: "Trapping Rain Water", Difficulty: "Hard", Acceptance: "61.2%", Frequency: "86.0%", URL: "https://leetcode.com/problems/trapping-rain-water/" },
  { ID: "46", Title: "Permutations", Difficulty: "Medium", Acceptance: "78.4%", Frequency: "72.5%", URL: "https://leetcode.com/problems/permutations/" },
  { ID: "53", Title: "Maximum Subarray", Difficulty: "Medium", Acceptance: "50.8%", Frequency: "80.4%", URL: "https://leetcode.com/problems/maximum-subarray/" },
  { ID: "70", Title: "Climbing Stairs", Difficulty: "Easy", Acceptance: "52.9%", Frequency: "89.0%", URL: "https://leetcode.com/problems/climbing-stairs/" },
  { ID: "98", Title: "Validate Binary Search Tree", Difficulty: "Medium", Acceptance: "32.8%", Frequency: "75.1%", URL: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { ID: "121", Title: "Best Time to Buy and Sell Stock", Difficulty: "Easy", Acceptance: "53.8%", Frequency: "94.5%", URL: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { ID: "124", Title: "Binary Tree Maximum Path Sum", Difficulty: "Hard", Acceptance: "39.9%", Frequency: "70.2%", URL: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { ID: "139", Title: "Word Break", Difficulty: "Medium", Acceptance: "46.7%", Frequency: "73.8%", URL: "https://leetcode.com/problems/word-break/" },
  { ID: "146", Title: "LRU Cache", Difficulty: "Medium", Acceptance: "42.5%", Frequency: "92.4%", URL: "https://leetcode.com/problems/lru-cache/" },
  { ID: "200", Title: "Number of Islands", Difficulty: "Medium", Acceptance: "58.4%", Frequency: "91.8%", URL: "https://leetcode.com/problems/number-of-islands/" },
  { ID: "206", Title: "Reverse Linked List", Difficulty: "Easy", Acceptance: "76.1%", Frequency: "93.0%", URL: "https://leetcode.com/problems/reverse-linked-list/" },
  { ID: "238", Title: "Product of Array Except Self", Difficulty: "Medium", Acceptance: "65.8%", Frequency: "87.0%", URL: "https://leetcode.com/problems/product-of-array-except-self/" },
  { ID: "295", Title: "Find Median from Data Stream", Difficulty: "Hard", Acceptance: "51.8%", Frequency: "78.0%", URL: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { ID: "300", Title: "Longest Increasing Subsequence", Difficulty: "Medium", Acceptance: "55.2%", Frequency: "80.9%", URL: "https://leetcode.com/problems/longest-increasing-subsequence/" }
];

export default function CSVUploader({ onDataLoaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndProcessData = (results) => {
    setError('');
    const { data, meta } = results;

    if (!data || data.length === 0) {
      setError('The uploaded CSV file appears to be empty.');
      return;
    }

    // Required columns and their mapping rules
    const requiredCols = ['ID', 'URL', 'Title', 'Difficulty', 'Acceptance', 'Frequency'];
    const fields = meta.fields || [];

    const columnMapping = {};
    const missingCols = [];

    requiredCols.forEach((reqCol) => {
      const normalizedReq = reqCol.toLowerCase();
      
      const matchedField = fields.find((f) => {
        const cleanField = f.trim().toLowerCase();
        // 1. Exact match
        if (cleanField === normalizedReq) return true;
        // 2. Specialized substring rules
        if (normalizedReq === 'id' && cleanField === 'id') return true;
        if (normalizedReq === 'url' && (cleanField.includes('url') || cleanField.includes('link'))) return true;
        if (normalizedReq === 'title' && (cleanField.includes('title') || cleanField.includes('name'))) return true;
        if (normalizedReq === 'difficulty' && (cleanField.includes('difficulty') || cleanField.includes('diff'))) return true;
        if (normalizedReq === 'acceptance' && cleanField.startsWith('accept')) return true;
        if (normalizedReq === 'frequency' && (cleanField.startsWith('frequ') || cleanField.startsWith('freq'))) return true;
        return false;
      });

      if (matchedField) {
        columnMapping[reqCol] = matchedField;
      } else {
        missingCols.push(reqCol);
      }
    });

    if (missingCols.length > 0) {
      setError(`Missing required columns: ${missingCols.join(', ')}`);
      return;
    }

    // Standardize data keys to expected column names
    const formattedData = data
      .filter((row) => {
        // Clean out rows where Title or ID is empty
        return row[columnMapping['ID']] && row[columnMapping['Title']];
      })
      .map((row) => ({
        ID: String(row[columnMapping['ID']]).trim(),
        URL: String(row[columnMapping['URL']]).trim(),
        Title: String(row[columnMapping['Title']]).trim(),
        Difficulty: String(row[columnMapping['Difficulty']]).trim(),
        Acceptance: String(row[columnMapping['Acceptance']]).trim(),
        Frequency: String(row[columnMapping['Frequency']]).trim(),
      }));

    if (formattedData.length === 0) {
      setError('No valid problem rows found in the CSV file.');
      return;
    }

    onDataLoaded(formattedData);
  };

  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Invalid file type. Please upload a CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: validateAndProcessData,
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const loadDemo = () => {
    onDataLoaded(DEMO_PROBLEMS);
  };

  const downloadSample = () => {
    const csvContent = Papa.unparse([
      { ID: "1", URL: "https://leetcode.com/problems/two-sum/", Title: "Two Sum", Difficulty: "Easy", Acceptance: "52.3%", Frequency: "98.5%" },
      { ID: "2", URL: "https://leetcode.com/problems/add-two-numbers/", Title: "Add Two Numbers", Difficulty: "Medium", Acceptance: "43.1%", Frequency: "85.2%" },
      { ID: "4", URL: "https://leetcode.com/problems/median-of-two-sorted-arrays/", Title: "Median of Two Sorted Arrays", Difficulty: "Hard", Acceptance: "39.5%", Frequency: "76.4%" }
    ]);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leetrack_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent sm:text-4xl">
          Welcome to LeetTrack
        </h2>
        <p className="mt-2 text-zinc-400 max-w-md mx-auto">
          Upload your LeetCode problem CSV data to visualize your stats, track solved items, and filter challenges.
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all duration-300 group flex flex-col items-center justify-center min-h-[220px] ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="p-4 bg-zinc-800/80 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
          <FaUpload className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
        </div>

        <p className="mt-4 text-base font-semibold text-zinc-200">
          Drag & drop your CSV file here, or <span className="text-indigo-400 font-medium group-hover:underline">browse</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500 font-mono">
          Required columns: ID, Title, Difficulty, Acceptance, Frequency, URL
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-sm animate-fade-in">
          <FaExclamationCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={loadDemo}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2"
        >
          <FaDatabase className="w-4 h-4" />
          Load Demo Data
        </button>

        <button
          onClick={downloadSample}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaDownload className="w-4 h-4" />
          Download Sample CSV
        </button>
      </div>
    </div>
  );
}
