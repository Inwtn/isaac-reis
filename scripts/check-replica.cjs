const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync('index.html','utf8');
for(const file of ['replica-runtime.js','replica.js','assets/replica/reference-modules.js','assets/replica/particle-data.js','assets/replica/projects.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const file=match[1].split('?')[0];if(!/^(https?:|mailto:|data:)/.test(file))assert(fs.existsSync(file),'Missing local file: '+file);}
assert(!html.includes('cloudflareinsights'),'No original analytics');assert(!html.includes('self.__next_f'),'No Next server payload executed');
const scope={console,document:{}};scope.window=scope;vm.createContext(scope);
for(const file of ['replica-runtime.js','assets/replica/reference-modules.js','assets/replica/projects.js','assets/replica/particle-data.js'])vm.runInContext(fs.readFileSync(file,'utf8'),scope,{filename:file});
for(const id of [90072,8560,17543,91287,77310,35117,68213,41169])assert(Object.keys(scope.Replica.load(id)).length,'Module exports load: '+id);
assert.equal(scope.REFERENCE_PROJECTS.length,4);
for(const project of scope.REFERENCE_PROJECTS){const file=path.join('assets/replica',project.video.split('/').pop());assert(fs.statSync(file).size>1000000,'Project video is present: '+project.slug);}
for(const file of ['portrait.bin','italy.bin']){const bytes=fs.readFileSync('assets/replica/'+file);assert.equal(bytes.toString('ascii',0,4),'PPT1');assert.equal(bytes.length,12+bytes.readUInt32LE(4)*8);const encoded=scope.REFERENCE_PARTICLES[file].split(',')[1];assert(Buffer.from(encoded,'base64').equals(bytes),'Embedded particles equal the source file');}
const style=fs.readFileSync('assets/replica/site.css','utf8');assert(style.includes('--background:#222124'));assert(style.includes('Inter Tight'));assert(style.includes('project-content-module'));
assert(html.includes('Isaac Reis'));assert(html.includes('isaacreis.dev@gmail.com'));
console.log('PASS syntax, local assets, eight module namespaces, four videos, particle integrity, reference styles and local identity.');
console.log('Browser rendering, video textures, navigation and visual equivalence still require browser verification.');
