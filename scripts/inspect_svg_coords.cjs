const fs = require('fs');
const path = require('path');
const svgPath = path.join(__dirname, '..', 'Examples', 'kaart_festival_markers.svg');
const text = fs.readFileSync(svgPath, 'utf8');
const re = /<(circle|rect|path|image|g|text|use|polygon|polyline|ellipse|line)[^>]*>/g;
let m; let items = [];
while ((m = re.exec(text))) {
  const tag = m[1];
  const s = m[0];
  if (/id=|class=|transform=|cx=|cy=|x=|y=/.test(s)) {
    items.push({ tag, str: s });
  }
}
console.log('found', items.length);
items.slice(0,200).forEach(i => console.log(i.tag + ' ' + i.str));
