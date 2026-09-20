const fs = require('fs');
let code = fs.readFileSync('src/pdf/ProposalDocument.jsx', 'utf8');

// Fix page 1 to 5
code = code.replace(/<Page backgroundImage=\{formData\.pageBackgrounds\?\.\[''\]\} id="page-(\d)" isEditor=\{isEditor\}([\s\n]*)onBackgroundChange=\{onBackgroundChange\}>/g, 
  '<Page backgroundImage={formData.pageBackgrounds?.[\'page-$1\']} id="page-$1" isEditor={isEditor} onBackgroundChange={onBackgroundChange}>');

// Fix page 6 to 10 which have dynamic IDs
code = code.replace(/<Page backgroundImage=\{formData\.backgroundImage\} id=\{formData\.isLoan \? "page-(\d)" : "page-(\d)"\}>/g, (match, p1, p2) => {
  return `<Page backgroundImage={formData.pageBackgrounds?.[formData.isLoan ? 'page-${p1}' : 'page-${p2}']} id={formData.isLoan ? 'page-${p1}' : 'page-${p2}'} isEditor={isEditor} onBackgroundChange={onBackgroundChange}>`;
});

fs.writeFileSync('src/pdf/ProposalDocument.jsx', code);
console.log('Fixed pages.');
