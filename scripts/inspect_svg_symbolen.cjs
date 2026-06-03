const fs = require('fs');
const path = require('path');
const svgPath = path.join(__dirname, '..', 'Examples', 'kaart_festival_markers.svg');
const text = fs.readFileSync(svgPath, 'utf8');
const markerStart = text.indexOf('id="Symbolen"');
if (markerStart === -1) {
  console.error('Symbolen not found');
  process.exit(1);
}
const section = text.slice(markerStart, markerStart + 30000);
const circleRegex = /<circle[^>]*>/g;
const circles = [];
for (const match of section.matchAll(circleRegex)) {
  const tag = match[0];
  const cx = /cx="([^"]+)"/.exec(tag)?.[1];
  const cy = /cy="([^"]+)"/.exec(tag)?.[1];
  const r = /r="([^"]+)"/.exec(tag)?.[1];
  const cls = /class="([^"]+)"/.exec(tag)?.[1];
  circles.push({cx, cy, r, cls});
}
const grouped = circles.reduce((acc, c) => {
  const key = `${c.cls || 'none'}|${c.r || 'none'}`;
  acc[key] = acc[key] || [];
  acc[key].push(c);
  return acc;
}, {});
Object.entries(grouped).forEach(([key, items]) => {
  console.log(`${key} => ${items.length}`);
  items.slice(0, 15).forEach((item, idx) => console.log(`  ${idx+1}: cx=${item.cx} cy=${item.cy} r=${item.r}`));
});
console.log('total circles', circles.length);
