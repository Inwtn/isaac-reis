// Verify the installed REA server over its real MCP stdio transport.
const {spawn}=require('node:child_process');const fs=require('node:fs'),path=require('node:path');
const directory=path.resolve(process.argv[2]||'research/rea');fs.mkdirSync(directory,{recursive:true});
const cli=process.env.REA_CLI||path.join(require('node:os').homedir(),'.codex','tools','rea','node_modules','rea-agents','scripts','rea.mjs');
const child=spawn(process.execPath,[cli,'mcp'],{stdio:['pipe','pipe','pipe'],windowsHide:true});
let serial=0,buffer='',stderr='';const pending=new Map();
child.stderr.on('data',data=>{stderr=(stderr+data.toString()).slice(-8000);});
child.stdout.on('data',data=>{buffer+=data.toString();let line;while((line=buffer.indexOf('\n'))>=0){const raw=buffer.slice(0,line);buffer=buffer.slice(line+1);if(!raw.trim())continue;let message;try{message=JSON.parse(raw);}catch{continue;}const job=pending.get(message.id);if(job){pending.delete(message.id);clearTimeout(job.timer);message.error?job.reject(new Error(JSON.stringify(message.error))):job.resolve(message.result);}}});
child.on('error',error=>{for(const job of pending.values()){clearTimeout(job.timer);job.reject(error);}pending.clear();});
function request(method,params,timeout=45000){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(new Error('MCP timeout: '+method+' '+stderr));},timeout);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});}
async function main(){try{
 const initialization=await request('initialize',{protocolVersion:'2025-11-25',capabilities:{},clientInfo:{name:'codex-rea-validation',version:'1.0.0'}});
 child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
 const catalog=await request('tools/list',{});fs.writeFileSync(path.join(directory,'initialize.json'),JSON.stringify(initialization,null,2));fs.writeFileSync(path.join(directory,'tools.json'),JSON.stringify(catalog,null,2));
 console.log(JSON.stringify({server:initialization.serverInfo,protocol:initialization.protocolVersion,toolCount:catalog.tools.length,relevantTools:catalog.tools.filter(t=>/web_page|web_bundle|javascript_application|browser_targets|web_scripts|evidence|trace_application/.test(t.name)).map(t=>t.name)}));
 if(catalog.tools.some(t=>t.name==='binary_session')){const result=await request('tools/call',{name:'binary_session',arguments:{}});fs.writeFileSync(path.join(directory,'session-check.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({tool:'binary_session',isError:!!result.isError,resultSaved:true}));}
 if(process.argv[3]){
  const calls=JSON.parse(fs.readFileSync(process.argv[3],'utf8').replace(/^\uFEFF/,''));for(const call of calls){if(!catalog.tools.some(t=>t.name===call.name))throw Error('Unadvertised tool '+call.name);const result=await request('tools/call',{name:call.name,arguments:call.arguments},450000);fs.writeFileSync(path.join(directory,call.output||call.name+'.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({tool:call.name,isError:!!result.isError,resultSaved:true}));}
 }
}finally{child.stdin.end();child.kill();}}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
