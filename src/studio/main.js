import './style.css';
import {projects, experience} from '../professional-details.js';
import {profile} from '../content.js';
import {createParticles} from './particles.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectArt = ['ledger','nodes','signal','grid','orbit'];
const cards = projects.map((p, i) => `
  <article class="project">
    <div class="project-visual visual-${projectArt[i % projectArt.length]}" aria-hidden="true">
      <span class="visual-index">${String(i+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span>
      <span class="visual-shape"><i></i><i></i><i></i></span>
      <span class="visual-caption">ISAAC ALMEIDA / SISTEMAS</span>
    </div>
    <div class="project-info">
      <span class="small-overline">${String(i+1).padStart(2,'0')} / TRABALHO SELECIONADO</span>
      <h3>${esc(p.shortTitle || p.title)}</h3>
      <p>${esc(p.text)}</p>
      <div class="project-footer"><span>${esc(p.tags?.split(' · ').slice(0,3).join(' / ') || 'SOFTWARE / SISTEMAS')}</span>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${esc(p.title)} no GitHub">Explorar projeto ↗</a>` : ''}</div>
    </div>
  </article>`).join('');

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="topo">
    <a class="brand" href="#topo" aria-label="Isaac Almeida, voltar ao início"><strong>I<span>✳</span>A</strong><span>ISAAC<br>ALMEIDA</span></a>
    <nav aria-label="Navegação principal"><a href="#projetos">Projetos</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav>
    <span class="header-location"><i></i> BRASIL · ABERTO A REMOTO</span>
  </header>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <canvas id="hero-particles" aria-hidden="true"></canvas>
      <div class="hero-rail left"><span>PORTFÓLIO / 2026</span><span>ENGENHARIA EM MOVIMENTO</span></div>
      <div class="hero-rail right"><span>ENGENHEIRO DE SOFTWARE</span><span>BASEADO NO BRASIL</span></div>
      <div class="hero-content"><p class="small-overline">OLÁ, EU SOU ISAAC ALMEIDA</p><h1 id="hero-title">Ideias em<br><em>movimento.</em></h1><p>Engenharia de software para transformar operações reais em experiências e sistemas melhores.</p><a class="text-link" href="#projetos">Conheça meu trabalho <span>↘</span></a></div>
      <div class="hero-bottom"><span>01 / 04</span><span>ROLE PARA EXPLORAR ↓</span><span>FULL-STACK · AUTOMAÇÃO · IA APLICADA</span></div>
    </section>
    <section class="intro section-wrap" id="sobre" aria-labelledby="intro-title"><div class="section-label">01 / SOBRE <i></i></div><div class="intro-content"><p class="small-overline">UM POUCO SOBRE MIM</p><h2 id="intro-title">Tecnologia com<br><span>contexto humano.</span></h2><p>Transformo processos complexos em sistemas claros, integrações confiáveis e ferramentas que as pessoas realmente usam.</p><p>Minha experiência em operações financeiras informa a maneira como projeto software: entendo o fluxo, cuido dos dados e automatizo o que precisa funcionar todos os dias.</p><div class="expertise"><span>BACKEND & APIs</span><span>FULL-STACK</span><span>AUTOMAÇÃO</span><span>IA APLICADA</span></div></div></section>
    <section class="work section-wrap" id="projetos" aria-labelledby="work-title"><div class="section-label">02 / PROJETOS <i></i></div><div class="work-header"><p class="small-overline">TRABALHO SELECIONADO / ${projects.length} PROJETOS</p><h2 id="work-title">Soluções para<br><span>problemas reais.</span></h2><p>De dados financeiros a produtos digitais: projetos que unem lógica, cuidado e utilidade.</p></div><div class="project-list">${cards}</div></section>
    <section class="journey section-wrap" aria-labelledby="journey-title"><div class="section-label">03 / TRAJETÓRIA <i></i></div><div class="journey-content"><div><p class="small-overline">EXPERIÊNCIA</p><h2 id="journey-title">Do negócio<br><span>ao código.</span></h2><p>Uma trajetória construída entre operações, produtos e engenharia.</p></div><div class="experience-list">${experience.slice(0,3).map((e,i)=>`<div class="experience-item"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(e.title)}</h3><p>${esc(e.date)}</p></div><span aria-hidden="true">↗</span></div>`).join('')}</div></div></section>
    <section class="contact section-wrap" id="contato" aria-labelledby="contact-title"><div class="section-label">04 / CONTATO <i></i></div><p class="small-overline">TEM UMA IDEIA EM MENTE?</p><h2 id="contact-title">Vamos criar algo<br><em>que importa.</em></h2><a class="contact-email" href="mailto:${esc(profile.email)}">${esc(profile.email)} <span>↗</span></a><div class="contact-bottom"><span>ISAAC ALMEIDA · BRASIL</span><div><a href="${esc(profile.github)}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="${esc(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a><a href="${esc(profile.cv)}" target="_blank" rel="noopener noreferrer">CURRÍCULO ↗</a><a href="./simples.html">VERSÃO TEXTO ↗</a></div></div></section>
  </main><footer class="site-footer"><span>© ${new Date().getFullYear()} ISAAC ALMEIDA</span><a href="#topo">VOLTAR AO TOPO ↑</a></footer>`;

createParticles(document.querySelector('#hero-particles'));
