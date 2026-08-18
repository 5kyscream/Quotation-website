const fs = require('fs');

const cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(':root {', `:root {\n  --color-border-light: rgba(255, 255, 255, 0.1);\n  --color-border-medium: rgba(255, 255, 255, 0.2);\n  --color-bg-subtle: rgba(255, 255, 255, 0.02);\n  --color-bg-hover: rgba(255, 255, 255, 0.05);\n  --color-bg-card: rgba(255, 255, 255, 0.08);\n`);
css += `\nbody.light-mode {\n  --color-midnight: #f5f0e8;\n  --color-navy: #ffffff;\n  --color-white: #1A1A2E;\n  --color-muted-blue: #505d6e;\n  --color-teal: #009682;\n  --color-border-light: rgba(0, 0, 0, 0.1);\n  --color-border-medium: rgba(0, 0, 0, 0.2);\n  --color-bg-subtle: rgba(0, 0, 0, 0.02);\n  --color-bg-hover: rgba(0, 0, 0, 0.05);\n  --color-bg-card: rgba(0, 0, 0, 0.08);\n}\n`;

css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'var(--color-border-light)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.2\)/g, 'var(--color-border-medium)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.02\)/g, 'var(--color-bg-subtle)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.03\)/g, 'var(--color-bg-subtle)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.04\)/g, 'var(--color-bg-hover)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'var(--color-bg-hover)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.06\)/g, 'var(--color-border-light)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'var(--color-bg-card)');
fs.writeFileSync(cssPath, css);

const pdfPath = 'src/pdf/ProposalDocument.jsx';
let pdf = fs.readFileSync(pdfPath, 'utf8');
pdf = pdf.replace(/rgba\(255,255,255,0\.1\)/g, 'var(--color-border-light)');
pdf = pdf.replace(/rgba\(255,255,255,0\.02\)/g, 'var(--color-bg-subtle)');
pdf = pdf.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--color-bg-hover)');
pdf = pdf.replace(/rgba\(255,255,255,0\.08\)/g, 'var(--color-bg-card)');
fs.writeFileSync(pdfPath, pdf);

const formPath = 'src/pages/ProposalForm.jsx';
let form = fs.readFileSync(formPath, 'utf8');
form = form.replace(/rgba\(255,255,255,0\.1\)/g, 'var(--color-border-light)');
form = form.replace(/transform:\s*'scale\(0\.7\)'(?:,\s*transformOrigin:\s*'top center',\s*height:\s*'fit-content')?/g, 'zoom: 0.7');
fs.writeFileSync(formPath, form);

console.log('Migration complete');
