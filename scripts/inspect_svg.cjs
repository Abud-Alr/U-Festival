const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'Examples', 'kaart_festival_markers.svg');
const text = fs.readFileSync(p, 'utf8');
const lines = text.split(/\r?\n/);
const matches = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (
    line.includes('<text') ||
    line.includes('x=') ||
    line.includes('y=') ||
    line.includes('translate(') ||
    line.includes('circle') ||
    line.includes('ellipse') ||
    line.includes('polygon') ||
    line.includes('path class="st4"') ||
    line.includes('rect class="st13"') ||
    line.includes('marker_')
  ) {
    matches.push(`${i + 1} ${line.trim()}`);
    if (matches.length >= 200) break;
  }
}
console.log(matches.join('\n'));
