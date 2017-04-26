const modeFromExt = {
    '.c': 'c_cpp',
    '.coffee': 'coffee',
    '.css': 'css',
    '.cpp': 'c_cpp',
    '.c++': 'c_cpp',
    '.go': 'golang',
    '.h': 'c_cpp',
    '.html': 'html',
    '.java': 'java',
    '.js': 'javascript',
    '.json': 'json',
    '.jsp': 'jsp',
    '.pl': 'perl',
    '.php': 'php',
    '.py': 'python',
    '.rb': 'ruby',
    '.ts': 'typescript',
    '.xml': 'xml',
    '.yml': 'yaml',
    '.yaml': 'yaml',
};
exports.getModeFromExt = function getModeFromExt(extname) {
    return modeFromExt[extname] || 'text';
};
