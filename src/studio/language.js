import {projects,experience} from '../professional-details.js';

const copy={
  pt:{
    title:'Isaac Almeida — Engenharia de software',
    description:'Isaac Almeida — engenheiro de software brasileiro. Sistemas, integrações, automação e IA aplicada.',
    nav:['Projetos','Sobre','Contato'],
    heroEyebrow:'OLÁ, EU SOU ISAAC ALMEIDA',
    heroTitle:'Ideias em<br><em>movimento.</em>',
    heroText:'Engenharia de software para transformar operações reais em experiências e sistemas melhores.',
    heroLink:'Conheça meu trabalho <span>↘</span>',
    scroll:'ROLE PARA EXPLORAR ↓',
    labels:['01 / SOBRE','02 / PROJETOS','03 / TRAJETÓRIA','04 / CONTATO'],
    aboutEyebrow:'UM POUCO SOBRE MIM',
    aboutTitle:'Tecnologia com<br><span>contexto humano.</span>',
    about:[
      'Transformo processos complexos em sistemas claros, integrações confiáveis e ferramentas que as pessoas realmente usam.',
      'Minha experiência em operações financeiras informa a maneira como projeto software: entendo o fluxo, cuido dos dados e automatizo o que precisa funcionar todos os dias.'
    ],
    expertise:['BACKEND & APIs','FULL-STACK','AUTOMAÇÃO','IA APLICADA'],
    workEyebrow:'TRABALHO SELECIONADO / 5 PROJETOS',
    workTitle:'Soluções para<br><span>problemas reais.</span>',
    workText:'De dados financeiros a produtos digitais: projetos que unem lógica, cuidado e utilidade.',
    projectLabel:'TRABALHO SELECIONADO',
    projectLink:'Explorar projeto ↗',
    galleryHint:'ARRASTE OU ROLE PARA EXPLORAR',
    journeyEyebrow:'EXPERIÊNCIA',
    journeyTitle:'Do negócio<br><span>ao código.</span>',
    journeyText:'Uma trajetória construída entre operações, produtos e engenharia.',
    contactEyebrow:'TEM UMA IDEIA EM MENTE?',
    contactTitle:'Vamos criar algo<br><em>que importa.</em>',
    contactLinks:['GITHUB ↗','LINKEDIN ↗','CURRÍCULO ↗','VERSÃO TEXTO ↗'],
    top:'VOLTAR AO TOPO ↑',
    skip:'Ir para os projetos',
    projectAria:'Ver projeto no GitHub'
  },
  en:{
    title:'Isaac Almeida — Software Engineer',
    description:'Isaac Almeida — Brazilian software engineer. Systems, integrations, automation and applied AI.',
    nav:['Projects','About','Contact'],
    heroEyebrow:'HI, I’M ISAAC ALMEIDA',
    heroTitle:'Ideas in<br><em>motion.</em>',
    heroText:'Software engineering that turns real operations into better experiences and systems.',
    heroLink:'Explore my work <span>↘</span>',
    scroll:'SCROLL TO EXPLORE ↓',
    labels:['01 / ABOUT','02 / PROJECTS','03 / JOURNEY','04 / CONTACT'],
    aboutEyebrow:'A LITTLE ABOUT ME',
    aboutTitle:'Technology with<br><span>human context.</span>',
    about:[
      'I turn complex processes into clear systems, reliable integrations and tools people actually use.',
      'My background in financial operations shapes how I build software: understand the workflow, protect the data and automate what needs to work every day.'
    ],
    expertise:['BACKEND & APIs','FULL-STACK','AUTOMATION','APPLIED AI'],
    workEyebrow:'SELECTED WORK / 5 PROJECTS',
    workTitle:'Solutions for<br><span>real problems.</span>',
    workText:'From financial data to digital products: projects that combine logic, care and utility.',
    projectLabel:'SELECTED WORK',
    projectLink:'Explore project ↗',
    galleryHint:'DRAG OR SCROLL TO EXPLORE',
    journeyEyebrow:'EXPERIENCE',
    journeyTitle:'From business<br><span>to code.</span>',
    journeyText:'A path built across operations, products and engineering.',
    contactEyebrow:'HAVE AN IDEA IN MIND?',
    contactTitle:'Let’s build something<br><em>that matters.</em>',
    contactLinks:['GITHUB ↗','LINKEDIN ↗','RÉSUMÉ ↗','TEXT VERSION ↗'],
    top:'BACK TO TOP ↑',
    skip:'Skip to projects',
    projectAria:'View project on GitHub'
  }
};
const projectSummariesEn=[
  'A research and execution system for financial markets. It combines data, models, signals and local AI with auditable risk rules. Paper execution is separate from live mode, which requires explicit configuration.',
  'A Java and Spring Boot engine that reconciles OFX and CSV statements with internal entries by amount, type and date. It uses a one-day tolerance, stores import history and serves a dashboard connected to the API.',
  'A Java and Spring Boot API that receives transactions as JSON and appends date, type, category, description and amount to Google Sheets through a service account.',
  'Private screen sharing for up to five viewers using WebRTC, role-based invites and optional voice calls. Includes connection and quality diagnostics.',
  'A local .NET assembly explorer powered by ILSpy. It shows types, methods, reconstructed C#, IL and metadata through static analysis without executing the inspected file.'
];

export function initLanguage({projectSummaries,experienceLabels}){
  const buttons=[...document.querySelectorAll('[data-lang]')];
  const text=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value};
  const html=(selector,value)=>{const node=document.querySelector(selector);if(node)node.innerHTML=value};
  function apply(lang){
    const c=copy[lang];
    document.documentElement.lang=lang==='pt'?'pt-BR':'en';
    document.title=c.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',c.description);
    localStorage.setItem('isaac-portfolio-language',lang);
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    document.querySelectorAll('.site-header nav a').forEach((node,i)=>node.textContent=c.nav[i]);
    document.querySelector('.site-header nav')?.setAttribute('aria-label',lang==='pt'?'Navegação principal':'Main navigation');
    document.querySelector('.language-switch')?.setAttribute('aria-label',lang==='pt'?'Idioma':'Language');
    document.querySelector('.brand')?.setAttribute('aria-label',lang==='pt'?'Isaac Almeida, voltar ao início':'Isaac Almeida, back to top');
    text('.hero-content .small-overline',c.heroEyebrow);
    html('#hero-title',c.heroTitle);
    text('.hero-content>p:not(.small-overline)',c.heroText);
    html('.hero-content .text-link',c.heroLink);
    text('.hero-bottom span:nth-child(2)',c.scroll);
    document.querySelectorAll('.section-label').forEach((node,i)=>node.innerHTML=c.labels[i]+' <i></i>');
    text('.intro .small-overline',c.aboutEyebrow);
    html('#intro-title',c.aboutTitle);
    document.querySelectorAll('.intro-content>p:not(.small-overline)').forEach((node,i)=>node.textContent=c.about[i]);
    document.querySelectorAll('.expertise span').forEach((node,i)=>node.textContent=c.expertise[i]);
    text('.work-header .small-overline',c.workEyebrow);
    html('#work-title',c.workTitle);
    text('.work-header>p:last-child',c.workText);
    document.querySelectorAll('.project').forEach((card,i)=>{
      textIn(card,'.project-info .small-overline',String(i+1).padStart(2,'0')+' / '+c.projectLabel);
      textIn(card,'.project-info>p',lang==='pt'?projectSummaries[i]:projectSummariesEn[i]);
      textIn(card,'.project-footer a',c.projectLink);
      card.querySelector('.project-footer a')?.setAttribute('aria-label',c.projectAria+': '+projects[i].title);
    });
    text('.gallery-footer>span:first-child',c.galleryHint);
    text('.journey .small-overline',c.journeyEyebrow);
    html('#journey-title',c.journeyTitle);
    text('.journey-content>div>p:last-child',c.journeyText);
    document.querySelectorAll('.experience-item').forEach((row,i)=>{
      textIn(row,'h3',lang==='pt'?experienceLabels[i][0]:experience[i].title);
      textIn(row,'p',lang==='pt'?experienceLabels[i][1]:experience[i].date);
    });
    text('.contact .small-overline',c.contactEyebrow);
    html('#contact-title',c.contactTitle);
    document.querySelectorAll('.contact-bottom a').forEach((node,i)=>node.textContent=c.contactLinks[i]);
    text('.contact-bottom>span',lang==='pt'?'ISAAC ALMEIDA · BRASIL':'ISAAC ALMEIDA · BRAZIL');
    text('.site-footer a',c.top);
    text('.skip-link',c.skip);
  }
  function textIn(parent,selector,value){const node=parent.querySelector(selector);if(node)node.textContent=value}
  buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.lang)));
  const stored=localStorage.getItem('isaac-portfolio-language');
  apply(stored==='pt'||stored==='en'?stored:(navigator.language.toLowerCase().startsWith('pt')?'pt':'en'));
}
