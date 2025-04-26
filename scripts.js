// Main script file - now just imports the modular script files
// This maintains backwards compatibility with any pages still using scripts.js directly

// Note: This file simply serves as an entry point for all scripts
// The actual functionality has been moved to dedicated script files:
// - shared.js: Contains theme management and common utilities
// - projects.js: Contains projects page specific functionality 
// - documentation.js: Contains documentation page specific functionality

console.log('Loading all scripts from modular architecture...');

// The individual script files will automatically run their initialization code
// when they are included in the HTML pages