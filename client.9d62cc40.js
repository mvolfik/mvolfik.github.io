import{r as i,h as f,e as c,f as l}from"./chunks/web.c8bd5a50.js";const u=t=>(n,o,r,{client:a})=>{if(window._$HY||(window._$HY={events:[],completed:new WeakSet,r:{}}),!t.hasAttribute("ssr"))return;const s=a==="only"?i:f;let e;s(()=>c(n,{...o,get children(){return r!=null&&(l.context&&(e=t.querySelector("astro-fragment")),e==null&&(e=document.createElement("astro-fragment"),e.innerHTML=r)),e}}),t)};export{u as default};