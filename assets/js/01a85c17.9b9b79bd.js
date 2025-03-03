"use strict";(self.webpackChunkinstructor_resources=self.webpackChunkinstructor_resources||[]).push([[8209],{569:(e,t,a)=>{a.d(t,{A:()=>U});var s=a(6540),n=a(4164),r=a(1410),i=a(6682),l=a(539),o=a(3750),c=a(3115),m=a(9303),u=a(4848);function d(e){let{year:t,yearGroupHeadingClassName:a,children:s}=e;return(0,u.jsxs)("div",{role:"group",children:[(0,u.jsx)(m.A,{as:"h3",className:a,children:t}),s]})}function g(e){let{items:t,yearGroupHeadingClassName:a,ListComponent:s}=e;if((0,c.p)().blog.sidebar.groupByYear){const e=(0,o.Ki)(t);return(0,u.jsx)(u.Fragment,{children:e.map((e=>{let[t,n]=e;return(0,u.jsx)(d,{year:t,yearGroupHeadingClassName:a,children:(0,u.jsx)(s,{items:n})},t)}))})}return(0,u.jsx)(s,{items:t})}const h=(0,s.memo)(g),p="sidebar_re4s",b="sidebarItemTitle_pO2u",f="sidebarItemList_Yudw",x="sidebarItem__DBe",j="sidebarItemLink_mo7H",N="sidebarItemLinkActive_I1ZP",v="yearGroupHeading_rMGB",C=e=>{let{items:t}=e;return(0,u.jsx)(o.OU,{items:t,ulClassName:(0,n.A)(f,"clean-list"),liClassName:x,linkClassName:j,linkActiveClassName:N})};function k(e){let{sidebar:t}=e;const a=(0,o.Gx)(t.items);return(0,u.jsx)("aside",{className:"col col--3",children:(0,u.jsxs)("nav",{className:(0,n.A)(p,"thin-scrollbar"),"aria-label":(0,l.T)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"}),children:[(0,u.jsx)("div",{className:(0,n.A)(b,"margin-bottom--md"),children:t.title}),(0,u.jsx)(h,{items:a,ListComponent:C,yearGroupHeadingClassName:v})]})})}const A=(0,s.memo)(k);var y=a(3065);const P="yearGroupHeading_QT03",_=e=>{let{items:t}=e;return(0,u.jsx)(o.OU,{items:t,ulClassName:"menu__list",liClassName:"menu__list-item",linkClassName:"menu__link",linkActiveClassName:"menu__link--active"})};function w(e){let{sidebar:t}=e;const a=(0,o.Gx)(t.items);return(0,u.jsx)(h,{items:a,ListComponent:_,yearGroupHeadingClassName:P})}function B(e){return(0,u.jsx)(y.GX,{component:w,props:e})}const G=(0,s.memo)(B);function O(e){let{sidebar:t}=e;const a=(0,i.l)();return t?.items.length?"mobile"===a?(0,u.jsx)(G,{sidebar:t}):(0,u.jsx)(A,{sidebar:t}):null}function U(e){const{sidebar:t,toc:a,children:s,...i}=e,l=t&&t.items.length>0;return(0,u.jsx)(r.A,{...i,children:(0,u.jsx)("div",{className:"container margin-vert--lg",children:(0,u.jsxs)("div",{className:"row",children:[(0,u.jsx)(O,{sidebar:t}),(0,u.jsx)("main",{className:(0,n.A)("col",{"col--7":l,"col--9 col--offset-1":!l}),children:s}),a&&(0,u.jsx)("div",{className:"col col--2",children:a})]})})})}},3750:(e,t,a)=>{a.d(t,{in:()=>c,OU:()=>P,Ki:()=>y,kJ:()=>b,x:()=>l,e7:()=>m,J_:()=>f,Gx:()=>A});var s=a(6540),n=a(6849),r=a(9062),i=a(4848);function l(){const e=(0,r.A)(),t=e?.data?.blogMetadata;if(!t)throw new Error("useBlogMetadata() can't be called on the current route because the blog metadata could not be found in route context");return t}const o=s.createContext(null);function c(e){let{children:t,content:a,isBlogPostPage:n=!1}=e;const r=function(e){let{content:t,isBlogPostPage:a}=e;return(0,s.useMemo)((()=>({metadata:t.metadata,frontMatter:t.frontMatter,assets:t.assets,toc:t.toc,isBlogPostPage:a})),[t,a])}({content:a,isBlogPostPage:n});return(0,i.jsx)(o.Provider,{value:r,children:t})}function m(){const e=(0,s.useContext)(o);if(null===e)throw new n.dV("BlogPostProvider");return e}var u=a(9030),d=a(797);const g=e=>new Date(e).toISOString();function h(e){const t=e.map(x);return{author:1===t.length?t[0]:t}}function p(e,t,a){return e?{image:j({imageUrl:t(e,{absolute:!0}),caption:`title image for the blog post: ${a}`})}:{}}function b(e){const{siteConfig:t}=(0,d.A)(),{withBaseUrl:a}=(0,u.hH)(),{metadata:{blogDescription:s,blogTitle:n,permalink:r}}=e,i=`${t.url}${r}`;return{"@context":"https://schema.org","@type":"Blog","@id":i,mainEntityOfPage:i,headline:n,description:s,blogPost:e.items.map((e=>function(e,t,a){const{assets:s,frontMatter:n,metadata:r}=e,{date:i,title:l,description:o,lastUpdatedAt:c}=r,m=s.image??n.image,u=n.keywords??[],d=`${t.url}${r.permalink}`,b=c?g(c):void 0;return{"@type":"BlogPosting","@id":d,mainEntityOfPage:d,url:d,headline:l,name:l,description:o,datePublished:i,...b?{dateModified:b}:{},...h(r.authors),...p(m,a,l),...u?{keywords:u}:{}}}(e.content,t,a)))}}function f(){const e=l(),{assets:t,metadata:a}=m(),{siteConfig:s}=(0,d.A)(),{withBaseUrl:n}=(0,u.hH)(),{date:r,title:i,description:o,frontMatter:c,lastUpdatedAt:b}=a,f=t.image??c.image,x=c.keywords??[],j=b?g(b):void 0,N=`${s.url}${a.permalink}`;return{"@context":"https://schema.org","@type":"BlogPosting","@id":N,mainEntityOfPage:N,url:N,headline:i,name:i,description:o,datePublished:r,...j?{dateModified:j}:{},...h(a.authors),...p(f,n,i),...x?{keywords:x}:{},isPartOf:{"@type":"Blog","@id":`${s.url}${e.blogBasePath}`,name:e.blogTitle}}}function x(e){return{"@type":"Person",...e.name?{name:e.name}:{},...e.title?{description:e.title}:{},...e.url?{url:e.url}:{},...e.email?{email:e.email}:{},...e.imageURL?{image:e.imageURL}:{}}}function j(e){let{imageUrl:t,caption:a}=e;return{"@type":"ImageObject","@id":t,url:t,contentUrl:t,caption:a}}var N=a(6347),v=a(6289),C=a(1861),k=a(214);function A(e){const{pathname:t}=(0,N.zy)();return(0,s.useMemo)((()=>e.filter((e=>function(e,t){return!(e.unlisted&&!(0,k.ys)(e.permalink,t))}(e,t)))),[e,t])}function y(e){const t=(0,C.$z)(e,(e=>`${new Date(e.date).getFullYear()}`)),a=Object.entries(t);return a.reverse(),a}function P(e){let{items:t,ulClassName:a,liClassName:s,linkClassName:n,linkActiveClassName:r}=e;return(0,i.jsx)("ul",{className:a,children:t.map((e=>(0,i.jsx)("li",{className:s,children:(0,i.jsx)(v.A,{isNavLink:!0,to:e.permalink,className:n,activeClassName:r,children:e.title})},e.permalink)))})}},3953:(e,t,a)=>{a.d(t,{A:()=>l});a(6540);var s=a(4164),n=a(6289);const r={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var i=a(4848);function l(e){let{permalink:t,label:a,count:l,description:o}=e;return(0,i.jsxs)(n.A,{href:t,title:o,className:(0,s.A)(r.tag,l?r.tagWithCount:r.tagRegular),children:[a,l&&(0,i.jsx)("span",{children:l})]})}},4941:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});a(6540);var s=a(4164),n=a(539);const r=()=>(0,n.T)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});var i=a(1082),l=a(204),o=a(569),c=a(3953),m=a(9303);const u={tag:"tag_Nnez"};var d=a(4848);function g(e){let{letterEntry:t}=e;return(0,d.jsxs)("article",{children:[(0,d.jsx)(m.A,{as:"h2",id:t.letter,children:t.letter}),(0,d.jsx)("ul",{className:"padding--none",children:t.tags.map((e=>(0,d.jsx)("li",{className:u.tag,children:(0,d.jsx)(c.A,{...e})},e.permalink)))}),(0,d.jsx)("hr",{})]})}function h(e){let{tags:t}=e;const a=function(e){const t={};return Object.values(e).forEach((e=>{const a=function(e){return e[0].toUpperCase()}(e.label);t[a]??=[],t[a].push(e)})),Object.entries(t).sort(((e,t)=>{let[a]=e,[s]=t;return a.localeCompare(s)})).map((e=>{let[t,a]=e;return{letter:t,tags:a.sort(((e,t)=>e.label.localeCompare(t.label)))}}))}(t);return(0,d.jsx)("section",{className:"margin-vert--lg",children:a.map((e=>(0,d.jsx)(g,{letterEntry:e},e.letter)))})}var p=a(7220);function b(e){let{tags:t,sidebar:a}=e;const n=r();return(0,d.jsxs)(i.e3,{className:(0,s.A)(l.G.wrapper.blogPages,l.G.page.blogTagsListPage),children:[(0,d.jsx)(i.be,{title:n}),(0,d.jsx)(p.A,{tag:"blog_tags_list"}),(0,d.jsxs)(o.A,{sidebar:a,children:[(0,d.jsx)(m.A,{as:"h1",children:n}),(0,d.jsx)(h,{tags:t})]})]})}}}]);