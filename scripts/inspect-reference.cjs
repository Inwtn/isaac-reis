const fs=require('node:fs');
const source=fs.readFileSync('research/rea/reference-home.html','utf8');
console.log('TAGS\n'+[...source.matchAll(/<(?:link|script|img|video|source)\b[^>]*>/g)].map(m=>m[0]).join('\n'));
console.log('PUBLIC\n'+[...new Set([...source.matchAll(/\/[A-Za-z0-9_./-]+\.(?:bin|webm|mp4|webp|png|jpg|svg|css|woff2?)/g)].map(m=>m[0]))].join('\n'));
for(const file of ['3ibpsju79_13l.js','1stl4ykwpf_a2.js','1tzay28hfjym9.js']){
 const text=fs.readFileSync('research/rea/site/'+file,'utf8');
 console.log(file,'imports',[...new Set([...text.matchAll(/\b\w\.i\((\d+)\)/g)].map(m=>m[1]))],text.slice(0,100));
}
for(const file of fs.readdirSync('research/rea').filter(f=>/^project-.*\.html$/.test(f))){
 const page=fs.readFileSync('research/rea/'+file,'utf8');
 console.log(file,'media',[...page.matchAll(/<(?:link|img|video|source)\b[^>]*>/g)].map(x=>x[0]).filter(x=>/stylesheet|img|video|source/.test(x)).join('\n'));
 console.log('MAIN',page.slice(page.indexOf('<main'),page.indexOf('<main')+2500));
}
