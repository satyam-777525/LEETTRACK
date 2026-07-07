import React, { useState, useRef } from 'react';
import { FaSyncAlt, FaUser, FaCheck, FaExclamationCircle, FaSpinner, FaInfoCircle, FaCopy, FaFileUpload } from 'react-icons/fa';

export default function LeetCodeSync({ onSyncSolved, onSyncAllSolved }) {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'full'
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'info', message: string }
  const fileInputRef = useRef(null);

  const consoleSnippet = `fetch('https://leetcode.com/api/problems/all/').then(r=>r.json()).then(d=>{const s=d.stat_status_pairs.filter(p=>p.status==='ac').map(p=>p.stat.question_id);const b=new Blob([JSON.stringify(s)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='leetcode_solved.json';a.click();});`;

  const handleSyncRecent = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username.trim()}/acSubmission?limit=100`);
      if (!res.ok) {
        throw new Error('User not found or API rate-limited');
      }

      const data = await res.json();
      
      let submissions = [];
      if (Array.isArray(data)) {
        submissions = data;
      } else if (data && Array.isArray(data.submission)) {
        submissions = data.submission;
      } else if (data && Array.isArray(data.submissions)) {
        submissions = data.submissions;
      }

      if (submissions.length === 0) {
        setStatus({
          type: 'error',
          message: `No solved submissions found for "${username}". LeetCode only exposes the 20 most recent solved questions publicly.`,
        });
        setLoading(false);
        return;
      }

      const { matchedCount, totalCount } = onSyncSolved(submissions);
      const titlesList = submissions.map(s => `"${s.title}"`).join(', ');
      
      if (matchedCount > 0) {
        setStatus({
          type: 'success',
          message: `Successfully synced! Matched ${matchedCount} out of ${totalCount} recent solved problems from your profile.`,
        });
      } else {
        setStatus({
          type: 'info',
          message: `Synced successfully! However, 0 of your ${totalCount} recent solved problems matched the current CSV. Fetched items: [ ${titlesList} ].`,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Unable to fetch LeetCode profile. Verify username or try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(consoleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus(null);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const solvedIdsArray = JSON.parse(event.target.result);
        if (!Array.isArray(solvedIdsArray)) {
          throw new Error('Expected file to contain a JSON array of solved question IDs.');
        }

        const count = onSyncAllSolved(solvedIdsArray);

        setStatus({
          type: 'success',
          message: `Successfully synced! Marked ${count} matching problems as solved from your uploaded progress.`,
        });
      } catch (err) {
        setStatus({
          type: 'error',
          message: `Failed to import JSON: ${err.message}`,
        });
      }
    };
    
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-6 backdrop-blur-md animate-fade-in space-y-6">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-850 pb-4 gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
            <FaSyncAlt className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            LeetCode Sync Dashboard
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Sync your progress from LeetCode.com automatically or import all solved history.
          </p>
        </div>

        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850 text-[11px] font-semibold self-start sm:self-auto">
          <button
            onClick={() => { setActiveTab('recent'); setStatus(null); }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-zinc-800 text-indigo-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Quick Sync (Recent 20)
          </button>
          <button
            onClick={() => { setActiveTab('full'); setStatus(null); }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'full'
                ? 'bg-zinc-800 text-indigo-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Full Sync (All Solved)
          </button>
        </div>
      </div>

      {/* Tab Content: Quick Sync */}
      {activeTab === 'recent' && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in">
          <div className="flex-grow">
            <h4 className="text-sm font-semibold text-zinc-300">Sync Recent Activity</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Retrieves the 20 most recent solved questions from your public LeetCode profile without logging in.
            </p>
          </div>

          <form onSubmit={handleSyncRecent} className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <FaUser className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="LeetCode Username"
                className="w-48 sm:w-60 pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-850 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-750 disabled:text-indigo-400 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-3 h-3" />
                  Syncing...
                </>
              ) : (
                'Sync Solved'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Full Sync */}
      {activeTab === 'full' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Import All Solved Problems</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Due to LeetCode security restrictions, private profile statistics are not public. Follow these 4 easy steps to fetch your complete solved log:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step List */}
            <div className="space-y-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-850/80">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-indigo-400 shrink-0 text-[10px] mt-0.5">1</span>
                <span className="text-zinc-300">Open <a href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">leetcode.com/problemset<FaSyncAlt className="w-2 h-2" /></a> (log in first).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-indigo-400 shrink-0 text-[10px] mt-0.5">2</span>
                <span className="text-zinc-300">Open browser developer console by pressing <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">F12</kbd> or <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Ctrl+Shift+I</kbd>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-indigo-400 shrink-0 text-[10px] mt-0.5">3</span>
                <span className="text-zinc-300 text-left">Copy the snippet to the right, paste it into the console, and press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Enter</kbd>. It will automatically download a file named <code className="text-amber-400 font-semibold font-mono">leetcode_solved.json</code>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-indigo-400 shrink-0 text-[10px] mt-0.5">4</span>
                <span className="text-zinc-300">Upload the downloaded JSON file below:</span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="flex flex-col justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-850">
              <div>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Developer Console Code</span>
                <div className="relative mt-1.5">
                  <pre className="p-3 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap max-h-24 border border-zinc-850">
                    {consoleSnippet}
                  </pre>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopySnippet}
                className={`mt-3 w-full py-2 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  copiedSnippet
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300'
                }`}
              >
                {copiedSnippet ? (
                  <>
                    <FaCheck className="w-3 h-3" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <FaCopy className="w-3 h-3" />
                    Copy Code Snippet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <div className="flex items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full py-3.5 border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-950/40 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-zinc-350 hover:text-white"
            >
              <FaFileUpload className="w-4 h-4 text-indigo-400" />
              Upload leetcode_solved.json File
            </button>
          </div>
        </div>
      )}

      {/* Status Notifications */}
      {status && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-fade-in ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : status.type === 'info'
              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {status.type === 'success' ? (
            <FaCheck className="w-3.5 h-3.5 shrink-0" />
          ) : status.type === 'info' ? (
            <FaInfoCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <FaExclamationCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
