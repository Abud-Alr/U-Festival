import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '..', 'public', 'qr-code.svg');

// The URL the QR code points to — the qr-landing page
const appUrl = 'https://u-festival.nl/qr-landing.html';

async function generate() {
  const svg = await QRCode.toString(appUrl, {
    type: 'svg',
    width: 280,
    margin: 2,
    color: {
      dark: '#1A1A1A',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });

  fs.writeFileSync(outputPath, svg, 'utf-8');
  console.log(`✅ QR code generated → ${outputPath}`);
}

generate().catch(console.error);
