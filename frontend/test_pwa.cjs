const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==================================================');
console.log('TESTING PWA & OFFLINE APPLICATION SHELL');
console.log('==================================================');

// 1. Verify manifest.json in public and dist
console.log('\n1. Verifying PWA Manifest...');
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
assert.ok(fs.existsSync(manifestPath), 'public/manifest.json must exist');

const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.strictEqual(manifestContent.display, 'standalone');
assert.strictEqual(manifestContent.theme_color, '#0F172A');
assert.ok(manifestContent.name.includes('VAAYANA') || manifestContent.name.includes('വായന'));
assert.ok(Array.isArray(manifestContent.icons) && manifestContent.icons.length > 0);
console.log('   ✓ manifest.json is valid with standalone display and Kerala theme color.');

// 2. Verify sw.js in public
console.log('\n2. Verifying Service Worker Shell Cache...');
const swPath = path.join(__dirname, 'public', 'sw.js');
assert.ok(fs.existsSync(swPath), 'public/sw.js must exist');

const swContent = fs.readFileSync(swPath, 'utf8');
assert.ok(swContent.includes('install'), 'Service worker must handle install event');
assert.ok(swContent.includes('activate'), 'Service worker must handle activate event');
assert.ok(swContent.includes('fetch'), 'Service worker must handle fetch event');
assert.ok(swContent.includes('navigate'), 'Service worker must handle SPA navigation fallback');
console.log('   ✓ Service worker implements app shell caching & offline navigation fallback.');

// 3. Verify index.html PWA tags
console.log('\n3. Verifying index.html Meta Tags...');
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert.ok(indexHtml.includes('rel="manifest"'), 'index.html must reference manifest.json');
assert.ok(indexHtml.includes('name="theme-color"'), 'index.html must define theme-color');
assert.ok(indexHtml.includes('apple-mobile-web-app-capable'), 'index.html must support standalone mobile/tablet mode');
console.log('   ✓ index.html has complete PWA & touch smartboard meta tags.');

// 4. Verify Production Build (dist/)
console.log('\n4. Verifying Production Distribution Shell...');
const distManifest = path.join(__dirname, 'dist', 'manifest.json');
const distSw = path.join(__dirname, 'dist', 'sw.js');
const distIndex = path.join(__dirname, 'dist', 'index.html');

assert.ok(fs.existsSync(distIndex), 'dist/index.html must exist');
assert.ok(fs.existsSync(distManifest), 'dist/manifest.json must be present in dist/');
assert.ok(fs.existsSync(distSw), 'dist/sw.js must be present in dist/');
console.log('   ✓ dist/ contains production offline shell ready for deployment.');

console.log('\n==================================================');
console.log('ALL PWA & OFFLINE SHELL VERIFICATION TESTS PASSED!');
console.log('==================================================');
