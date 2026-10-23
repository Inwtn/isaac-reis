/* Small DOM adapter for the selected, effect-only public reference components.
   It does not load Next.js, analytics, or the original site's server. */
(function(){
  'use strict';
  var factories={},cache={},effects=null,cleanups=[];
  function register(ids,factory){var record={factory:factory,ids:ids,started:false};ids.forEach(function(id){factories[id]=record;cache[id]={};});}
  function load(id){
    if(Object.prototype.hasOwnProperty.call(builtins,id))return builtins[id];
    var record=factories[id];if(!record)throw Error('Missing local reference module '+id);
    if(!record.started){record.started=true;record.factory({
      i:load,
      s:function(values,target){var destination=cache[target||record.ids[0]];for(var i=0;i<values.length;i+=3){var name=values[i],mode=values[i+1],value=values[i+2];if(mode===0)destination[name]=value;else if(mode===1)Object.defineProperty(destination,name,{get:value,enumerable:true});else throw Error('Unsupported export mode '+mode);}},
      v:function(value){cache[record.ids[0]].default=value;}
    });}
    return cache[id];
  }
  function child(parent,value){if(value==null||typeof value==='boolean')return;if(Array.isArray(value)){value.forEach(function(v){child(parent,v);});return;}parent.appendChild(value&&value.nodeType?value:document.createTextNode(String(value)));}
  function jsx(type,props){
    props=props||{};if(typeof type==='function')return type(props);
    var node=type===Fragment?document.createDocumentFragment():document.createElement(type);
    Object.keys(props).forEach(function(key){var value=props[key];if(key==='children')child(node,value);else if(key==='ref'){if(typeof value==='function')value(node);else if(value)value.current=node;}else if(key==='style')Object.assign(node.style,value);else if(key==='className')node.className=value||'';else if(key==='key'){}else if(/^on[A-Z]/.test(key)&&typeof value==='function')node.addEventListener(key.slice(2).toLowerCase(),value);else if(value!=null&&value!==false)node.setAttribute(key,value===true?'':String(value));});
    return node;
  }
  function Fragment(){}
  var hooks={
    useRef:function(value){return {current:value};},
    useEffect:function(callback){if(!effects)throw Error('Effect outside local mount');effects.push(callback);},
    forwardRef:function(render){return function(props){return render(props,props.ref);};},
    useImperativeHandle:function(ref,factory){if(ref)ref.current=factory();}
  };
  var builtins={71645:hooks,43476:{jsx:jsx,jsxs:jsx,Fragment:Fragment},18566:{usePathname:function(){return '/';},useRouter:function(){return {push:function(url){location.href=url;}};}},22016:{default:'a'},74263:{useExit:function(){return {isExiting:false,startExit:function(){}};}}};
  function mount(id,props,target,exportName){
    var previous=effects;effects=[];var pending=effects,node;
    try{node=load(id)[exportName||'default'](props||{});if(target&&node)target.replaceWith(node);}finally{effects=previous;}
    pending.forEach(function(effect){var cleanup=effect();if(typeof cleanup==='function')cleanups.push(cleanup);});return node;
  }
  window.Replica={register:register,load:load,mount:mount,dispose:function(){cleanups.splice(0).reverse().forEach(function(cleanup){cleanup();});}};
})();
