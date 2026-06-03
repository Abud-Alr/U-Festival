import fs from 'fs';
import path from 'path';

const acts = [
  ['armin', 'AB', '#1a1a2e', '#F03228'],
  ['martin', 'MG', '#0f3460', '#247BA0'],
  ['chefspecial', 'CS', '#533483', '#E3B505'],
  ['kensington', 'K', '#2d3436', '#636e72'],
  ['within_temptation', 'WT', '#1e272e', '#8854d0'],
  ['de_staat', 'DS', '#c23616', '#e84118'],
  ['spinvis', 'S', '#273c75', '#487eb0'],
  ['froukje', 'F', '#e84393', '#fd79a8'],
  ['eefje', 'EV', '#6c5ce7', '#a29bfe'],
  ['dotan', 'D', '#00b894', '#55efc4'],
  ['navarone', 'N', '#2f3640', '#F03228'],
];

fs.mkdirSync('assets/Acts', { recursive: true });
fs.mkdirSync('assets/Icons', { recursive: true });
fs.mkdirSync('assets/Content', { recursive: true });

acts.forEach(([id, init, c1, c2]) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)" rx="20"/><text x="100" y="118" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="72" font-weight="700">${init}</text></svg>`;
  fs.writeFileSync(path.join('assets/Acts', `${id}.svg`), svg);
});

const stages = [
  ['proton', 'Ponton', '#E91E63'],
  ['lake', 'The Lake', '#2196F3'],
  ['club', 'The Club', '#9C27B0'],
  ['hangar', 'Hangar', '#4CAF50'],
];
stages.forEach(([id, name, color]) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect width="400" height="200" fill="${color}" rx="12" opacity="0.9"/><text x="200" y="115" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="36" font-weight="700">${name}</text></svg>`;
  fs.writeFileSync(path.join('assets/Content', `${id}.svg`), svg);
});

const icons = {
  home: 'M10 20v-8h4V7l6-4 6 4v5h4v8H10z',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14h-2v-6h2v6zm0-8h-2V6h2v2z',
  music: 'M16 4v12.5a4 4 0 1 1-2-3.46V7H8v9.5a4 4 0 1 1-2-3.46V4h10z',
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',
};

Object.entries(icons).forEach(([name, d]) => {
  ['', '-active'].forEach((suffix) => {
    const fill = suffix ? '#F03228' : '#666666';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="${d}" fill="${fill}"/></svg>`;
    fs.writeFileSync(path.join('assets/Icons', `${name}${suffix}.svg`), svg);
  });
});

const flags = {
  dutch: '<rect width="30" height="20" fill="#21468B"/><rect y="6.67" width="30" height="6.67" fill="#FFF"/><rect y="13.33" width="30" height="6.67" fill="#AE1C28"/>',
  english: '<rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#FFF" stroke-width="3"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><rect x="12" width="6" height="20" fill="#FFF"/><rect y="7" width="30" height="6" fill="#FFF"/><rect x="13" width="4" height="20" fill="#C8102E"/><rect y="8" width="30" height="4" fill="#C8102E"/>',
};
Object.entries(flags).forEach(([name, content]) => {
  fs.writeFileSync(path.join('assets/Icons', `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">${content}</svg>`);
});

console.log('Assets generated successfully');
