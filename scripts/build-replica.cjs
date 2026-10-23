/* Local reconstruction from the public shipped reference; provenance is retained. */
const fs=require('node:fs'),crypto=require('node:crypto'),{modules}=require('./reference-inventory.cjs');
const root='assets/replica/',html=fs.readFileSync('research/rea/reference-home.html','utf8');
const flight=[...html.matchAll(/<script>(self\.__next_f\.push\(([\s\S]*?)\))<\/script>/g)].map(m=>{try{return JSON.parse(m[2])[1]||'';}catch{return '';}}).join('');
fs.writeFileSync('research/rea/reference-flight.txt',flight);
console.log('scene props',flight.slice(flight.indexOf('"$La"')-50,flight.indexOf('"$La"')+700));
const projectStart=flight.indexOf('"projects":['),projectEnd=flight.indexOf(']}]',projectStart);
// Parse the exact JSON array, rather than executing any flight payload.
let at=projectStart+'"projects":'.length,depth=0,quoted=false,escaped=false,end=at;
for(;end<flight.length;end++){const c=flight[end];if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;}else if(c==='"')quoted=true;else if(c==='['||c==='{')depth++;else if(c===']'||c==='}'){depth--;if(depth===0){end++;break;}}}
const projects=JSON.parse(flight.slice(at,end));
fs.writeFileSync(root+'projects.js','window.REFERENCE_PROJECTS='+JSON.stringify(projects)+';\n');
const selected={
 '3ibpsju79_13l.js':[8560],
 '1stl4ykwpf_a2.js':[77310,43796,91287,17543,35117],
 '1tzay28hfjym9.js':[56810,68213],
 '0w7o8fu3bnjrw.js':[38332,41169]
};
const provenance=[];let generated='/* Shipped reference modules: https://ingrassiadaniel.it/. See PROVENANCE.json. */\n(function(){\n';
for(const [file,ids] of Object.entries(selected)){
 const source=fs.readFileSync('research/rea/site/'+file,'utf8');
 for(const m of modules('research/rea/site/'+file).filter(m=>m.ids.some(id=>ids.includes(id)))){
  let factory=m.source;
  if(m.ids.includes(17543))factory=factory.replaceAll('"/"===window.location.pathname','window.__replicaHome!==false');
  if(m.ids.includes(68213))factory=factory.slice(0,-1)+';e.s(["VideoSurface",0,f]);}';
  generated+='Replica.register('+JSON.stringify(m.ids)+','+factory+');\n';
  provenance.push({source:'https://ingrassiadaniel.it/_next/static/chunks/'+file,sha256:crypto.createHash('sha256').update(source).digest('hex'),module_ids:m.ids,character_range:[m.start,m.end],adaptation:m.ids.includes(17543)?'Home route detection supports file URLs.':m.ids.includes(68213)?'Expose existing VideoSurface component.':'None.'});
 }
}
generated+='})();\n';fs.writeFileSync(root+'reference-modules.js',generated);
const data={};for(const file of ['portrait.bin','italy.bin'])data[file]='data:application/octet-stream;base64,'+fs.readFileSync(root+file).toString('base64');
fs.writeFileSync(root+'particle-data.js','window.REFERENCE_PARTICLES='+JSON.stringify(data)+';\n');
let css=['2ys3583y_e1d2.css','0n7-j1hprxd9w.css','1iun641xkmkhc.css'].map(f=>fs.readFileSync(root+f,'utf8')).join('\n')+'\n'+[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
css=css.replaceAll('/noise.jpg','noise.jpg').replace(/(?:\.\.\/media\/|\/_next\/static\/media\/)([^)"']+\.woff2)/g,'$1');fs.writeFileSync(root+'site.css',css);
let body=html.slice(html.indexOf('<body>')+6,html.indexOf('<script src="/_next/static/chunks/3ivcc6t1s04dh.js" id="_R_"'));
body=body.replaceAll('Daniel Ingrassia','Isaac Reis').replaceAll('Creative Frontend Developer','Software Engineer').replaceAll('hello@ingrassiadaniel.it','isaacreis.dev@gmail.com').replaceAll('https://www.linkedin.com/in/daniel-ingrassia-71a874188/','https://www.linkedin.com/in/isaacalmeida-dev/').replace(' - VAT/P.IVA 04872350279','').replace('href="/"','href="#top"').replace('href="/cookie-policy"','href="assets/Isaac-Reis-CV-EN.pdf"').replace('This website doesn’t use cookies. Wanna know more?','View résumé ↗');
// The page is static HTML; selected scene modules run without a Next server.
const result='<!DOCTYPE html>\n<html lang="en" class="inter_tight_de2c1803-module__J3wvYq__variable"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#222124"><title>Isaac Reis | Software Engineer</title><meta name="description" content="Isaac Reis — Software Engineer. Creative development and interactive experiences."><link rel="preload" as="font" href="assets/replica/ab57efd000576a30-s.p.3fofz6dws3mg0.woff2" type="font/woff2" crossorigin><link rel="stylesheet" href="assets/replica/site.css?v=exact-1"><link rel="stylesheet" href="replica.css?v=exact-1"><script src="replica-runtime.js?v=exact-1" defer></script><script src="assets/replica/reference-modules.js?v=exact-1" defer></script><script src="assets/replica/particle-data.js?v=exact-1" defer></script><script src="assets/replica/projects.js?v=exact-1" defer></script><script src="replica.js?v=exact-1" defer></script></head><body id="top">'+body+'<div id="project-page" hidden></div></body></html>\n';
fs.writeFileSync('index.html',result);
fs.writeFileSync(root+'PROVENANCE.json',JSON.stringify({reference:'https://ingrassiadaniel.it/',purpose:'User-requested local visual replica. Reference projects and portrait remain reference material.',collected:'2026-10-23',modules:provenance,assets:JSON.parse(fs.readFileSync('research/rea/replica-assets.json'))},null,2));
console.log('Built static reference composition; projects:',projects.map(p=>({slug:p.slug,title:p.title,video:p.video,year:p.year})));
