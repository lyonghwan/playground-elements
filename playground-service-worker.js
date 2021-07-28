!function(){"use strict";
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const e=Symbol("Comlink.proxy"),t=Symbol("Comlink.endpoint"),n=Symbol("Comlink.releaseProxy"),s=Symbol("Comlink.thrown"),r=e=>"object"==typeof e&&null!==e||"function"==typeof e,a=new Map([["proxy",{canHandle:t=>r(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return i(e,t),[n,[n]]},deserialize:e=>(e.start(),l(e,[],undefined))}],["throw",{canHandle:e=>r(e)&&s in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(Error(e.value.message),e.value);throw e.value}}]]);function i(t,n=self){n.addEventListener("message",(function r(a){if(!a||!a.data)return;const{id:c,type:l,path:u}=Object.assign({path:[]},a.data),h=(a.data.argumentList||[]).map(f);let g;try{const n=u.slice(0,-1).reduce(((e,t)=>e[t]),t),s=u.reduce(((e,t)=>e[t]),t);switch(l){case"GET":g=s;break;case"SET":n[u.slice(-1)[0]]=f(a.data.value),g=!0;break;case"APPLY":g=s.apply(n,h);break;case"CONSTRUCT":g=function(t){return Object.assign(t,{[e]:!0})}(new s(...h));break;case"ENDPOINT":{const{port1:e,port2:n}=new MessageChannel;i(t,n),g=function(e,t){return p.set(e,t),e}(e,[e])}break;case"RELEASE":g=void 0;break;default:return}}catch(e){g={value:e,[s]:0}}Promise.resolve(g).catch((e=>({value:e,[s]:0}))).then((e=>{const[t,s]=d(e);n.postMessage(Object.assign(Object.assign({},t),{id:c}),s),"RELEASE"===l&&(n.removeEventListener("message",r),o(n))}))})),n.start&&n.start()}function o(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function c(e){if(e)throw Error("Proxy has been released and is not useable")}function l(e,s=[],r=function(){}){let a=!1;const i=new Proxy(r,{get(t,r){if(c(a),r===n)return()=>h(e,{type:"RELEASE",path:s.map((e=>e.toString()))}).then((()=>{o(e),a=!0}));if("then"===r){if(0===s.length)return{then:()=>i};const t=h(e,{type:"GET",path:s.map((e=>e.toString()))}).then(f);return t.then.bind(t)}return l(e,[...s,r])},set(t,n,r){c(a);const[i,o]=d(r);return h(e,{type:"SET",path:[...s,n].map((e=>e.toString())),value:i},o).then(f)},apply(n,r,i){c(a);const o=s[s.length-1];if(o===t)return h(e,{type:"ENDPOINT"}).then(f);if("bind"===o)return l(e,s.slice(0,-1));const[p,d]=u(i);return h(e,{type:"APPLY",path:s.map((e=>e.toString())),argumentList:p},d).then(f)},construct(t,n){c(a);const[r,i]=u(n);return h(e,{type:"CONSTRUCT",path:s.map((e=>e.toString())),argumentList:r},i).then(f)}});return i}function u(e){const t=e.map(d);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const p=new WeakMap;function d(e){for(const[t,n]of a)if(n.canHandle(e)){const[s,r]=n.serialize(e);return[{type:"HANDLER",name:t,value:s},r]}return[{type:"RAW",value:e},p.get(e)||[]]}function f(e){switch(e.type){case"HANDLER":return a.get(e.name).deserialize(e.value);case"RAW":return e.value}}function h(e,t,n){return new Promise((s=>{const r=[,,,,].fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===r&&(e.removeEventListener("message",t),s(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:r},t),n)}))}
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
class g{constructor(){this.settled=!1,this.promise=new Promise(((e,t)=>{this._resolve=e,this._reject=t}))}resolve(e){this.settled=!0,this._resolve(e)}reject(e){this.settled=!0,this._reject(e)}}
/**
     * @license
     * Copyright 2021 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const m=new Map,v={setFileAPI(e,t){let n=m.get(t);(void 0===n||n.settled)&&(n=new g,m.set(t,n)),n.resolve(e)}};
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */self.addEventListener("fetch",(e=>{const t=e.request.url;if(t.startsWith(self.registration.scope)){const{filePath:n,sessionId:s}=(e=>{const t=self.registration.scope,n=e.substring(t.length).split("?")[0],s=n.indexOf("/");let r,a;return-1===s?console.warn("Invalid sample file URL: "+e):(r=n.slice(0,s),a=n.slice(s+1)),{sessionId:r,filePath:a}})(t);void 0!==s&&e.respondWith((async(e,t,n)=>{const s=await(async e=>{let t=m.get(e);if(void 0!==t)return t.promise;const n=await(async e=>{for(const t of await self.clients.matchAll({includeUncontrolled:!0})){const n=new URL(t.url).hash;if(new URLSearchParams(n.slice(1)).get("playground-session-id")===e)return t}})(e);if(void 0===n)return;return t=new g,m.set(e,t),n.postMessage({type:5}),t.promise})(n);if(void 0===s)return new Response("Playground project not available",{status:503});const r=await s.getFile(t);if("status"in r){const{body:e,status:t}=r;return new Response(e,{status:t})}const{content:a,contentType:i}=r,o=new Headers;return o.set("Origin-Agent-Cluster","?1"),i&&o.set("Content-Type",i),new Response(a,{headers:o})})(0,n,s))}})),self.addEventListener("activate",(e=>{e.waitUntil(self.clients.claim())})),self.addEventListener("install",(()=>{self.skipWaiting()})),self.addEventListener("message",(e=>{if(2===e.data.type){const t={type:4,version:"0.11.0"};e.data.port.postMessage(t),i(v,e.data.port)}}))}();
