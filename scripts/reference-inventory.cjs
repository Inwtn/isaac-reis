const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{createRequire}=require('node:module');
let parser;
try{parser=require('@babel/parser');}catch{
 const reaPackage=process.env.REA_PACKAGE_JSON||path.join(os.homedir(),'.codex','tools','rea','node_modules','rea-agents','package.json');
 if(!fs.existsSync(reaPackage))throw Error('Build requires @babel/parser 8.0.4 or an installed REA package. The prebuilt site does not require rebuilding.');
 parser=createRequire(fs.realpathSync(reaPackage))('@babel/parser');
}
function modules(file){
 const source=fs.readFileSync(file,'utf8'),ast=parser.parse(source,{sourceType:'script'}),result=[];
 const array=ast.program.body[0].expression.arguments[0].elements;
 let ids=[];for(const node of array.slice(1)){if(node.type==='NumericLiteral')ids.push(node.value);else if(node.type==='ArrowFunctionExpression'){result.push({ids,source:source.slice(node.start,node.end),start:node.start,end:node.end});ids=[];}}
 return result;
}
if(require.main===module){
 for(const f of ['1stl4ykwpf_a2.js','1tzay28hfjym9.js','0w7o8fu3bnjrw.js'])for(const m of modules('research/rea/site/'+f))console.log(f,m.ids,m.start,m.end,m.source.slice(0,130));
 const source=fs.readFileSync('research/rea/reference-home.html','utf8');
 const local=[...new Set([...source.matchAll(/(?:src|href)="(\/_next\/[^"?]+(?:\.css|\.woff2))"/g)].map(m=>m[1]))];
 const videos=[...new Set([...source.matchAll(/https:\/\/cdn\.sanity\.io\/files\/[^"\\\s<>]+\.mp4/g)].map(m=>m[0]))];
 const assets=[...local.map(url=>({url:'https://ingrassiadaniel.it'+url,path:url.split('/').pop()})),...['portrait.bin','italy.bin','noise.jpg'].map(path=>({url:'https://ingrassiadaniel.it/'+path,path})),...videos.map(url=>({url,path:url.split('/').pop()}))];
 fs.writeFileSync('research/rea/replica-assets.json',JSON.stringify(assets,null,2));console.log('assets',assets);
}
module.exports={modules};
