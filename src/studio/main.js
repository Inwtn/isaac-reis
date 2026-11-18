import './style.css';
import './visuals.css';
import './experience.css';
import {projects, experience} from '../professional-details.js';
import {profile} from '../content.js';
import {createParticles} from './particles.js';
import {initLanguage} from './language.js';
import {initGallery} from './gallery.js';
import {initCursor} from './cursor.js';
import {initLoop} from './loop.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectArt = ['ledger','nodes','signal','grid','orbit'];
const projectSummaries = [
  'Sistema de pesquisa e operação para mercados financeiros. Combina dados, modelos, sinais e IA local com regras de risco auditáveis. A execução simulada é separada do modo real, que exige configuração explícita.',
  'Motor Java e Spring Boot que concilia extratos OFX e CSV com lançamentos internos por valor, tipo e data. Usa tolerância de um dia, persiste o histórico e oferece dashboard conectado à API.',
  'API Java e Spring Boot que recebe transações em JSON e acrescenta data, tipo, categoria, descrição e valor a uma planilha Google Sheets por conta de serviço.',
  'Compartilhamento privado de tela para até cinco espectadores, com WebRTC, convites por função e chamadas de voz opcionais. Inclui diagnósticos de conexão e qualidade.',
  'Explorador local de assemblies .NET com ILSpy. Mostra tipos, métodos, C# reconstruído, IL e metadados por análise estática, sem executar o arquivo inspecionado.'
];
const experienceLabels = [
  ['Engenheiro de Software · 3D LAB','Set 2026 — presente'],
  ['Desenvolvedor de Software · Automação backend','Dez 2025 — Jun 2026'],
  ['Analista Financeiro · Benericks Cocktail Co','Jan 2020 — Jan 2025']
];
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
      <p>${esc(projectSummaries[i] || p.text)}</p>
      <div class="project-footer"><span>${esc(p.tags?.split(' · ').slice(0,3).join(' / ') || 'SOFTWARE / SISTEMAS')}</span>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${esc(p.title)} no GitHub">Explorar projeto ↗</a>` : ''}</div>
    </div>
  </article>`).join('');

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="topo">
    <a class="brand" href="#topo" aria-label="Isaac Almeida, voltar ao início"><strong>I<span>✳</span>A</strong><span>ISAAC<br>ALMEIDA</span></a>
    <nav aria-label="Navegação principal"><a href="#projetos">Projetos</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav>
    <div class="language-switch" role="group" aria-label="Idioma"><button type="button" data-lang="pt" aria-pressed="true">PT</button><span>/</span><button type="button" data-lang="en" aria-pressed="false">EN</button></div>
  </header>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <canvas id="hero-particles" aria-hidden="true"></canvas>
      <div class="hero-content"><p class="small-overline">OLÁ, EU SOU ISAAC ALMEIDA</p><h1 id="hero-title">Ideias em<br><em>movimento.</em></h1><p>Engenharia de software para transformar operações reais em experiências e sistemas melhores.</p><a class="text-link" href="#projetos">Conheça meu trabalho <span>↘</span></a></div>
      <div class="hero-bottom"><span></span><span>ROLE PARA EXPLORAR ↓</span><span></span></div>
    </section>
    <section class="intro section-wrap" id="sobre" aria-labelledby="intro-title"><div class="section-label">01 / SOBRE <i></i></div><div class="intro-content"><p class="small-overline">UM POUCO SOBRE MIM</p><h2 id="intro-title">Tecnologia com<br><span>contexto humano.</span></h2><p>Transformo processos complexos em sistemas claros, integrações confiáveis e ferramentas que as pessoas realmente usam.</p><p>Minha experiência em operações financeiras informa a maneira como projeto software: entendo o fluxo, cuido dos dados e automatizo o que precisa funcionar todos os dias.</p><div class="expertise"><span>BACKEND & APIs</span><span>FULL-STACK</span><span>AUTOMAÇÃO</span><span>IA APLICADA</span></div></div></section>
    <section class="work" id="projetos" aria-labelledby="work-title"><div class="work-stage"><div class="section-label">02 / PROJETOS <i></i></div><div class="work-header"><p class="small-overline">TRABALHO SELECIONADO / ${projects.length} PROJETOS</p><h2 id="work-title">Soluções para<br><span>problemas reais.</span></h2><p>De dados financeiros a produtos digitais: projetos que unem lógica, cuidado e utilidade.</p></div><div class="gallery-window"><div class="project-list">${cards}</div></div><div class="gallery-footer"><span>ARRASTE OU ROLE PARA EXPLORAR</span><span class="gallery-count">01 / ${String(projects.length).padStart(2,'0')}</span><span class="gallery-bar"><i></i></span></div></div></section>
    <section class="journey section-wrap" aria-labelledby="journey-title"><div class="section-label">03 / TRAJETÓRIA <i></i></div><div class="journey-content"><div><p class="small-overline">EXPERIÊNCIA</p><h2 id="journey-title">Do negócio<br><span>ao código.</span></h2><p>Uma trajetória construída entre operações, produtos e engenharia.</p></div><div class="experience-list">${experience.slice(0,3).map((e,i)=>`<div class="experience-item"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(experienceLabels[i]?.[0] || e.title)}</h3><p>${esc(experienceLabels[i]?.[1] || e.date)}</p></div><span aria-hidden="true">↗</span></div>`).join('')}</div></div></section>
    <section class="contact section-wrap" id="contato" aria-labelledby="contact-title"><div class="section-label">04 / CONTATO <i></i></div><p class="small-overline">TEM UMA IDEIA EM MENTE?</p><h2 id="contact-title">Vamos criar algo<br><em>que importa.</em></h2><a class="contact-email" href="mailto:${esc(profile.email)}">${esc(profile.email)} <span>↗</span></a><div class="contact-bottom"><span>ISAAC ALMEIDA · BRASIL</span><div><a href="${esc(profile.github)}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="${esc(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a><a href="${esc(profile.cv)}" target="_blank" rel="noopener noreferrer">CURRÍCULO ↗</a><a href="./simples.html">VERSÃO TEXTO ↗</a></div></div></section>
  </main><footer class="site-footer"><span>© ${new Date().getFullYear()} ISAAC ALMEIDA</span><a href="#topo">VOLTAR AO TOPO ↑</a></footer>`;

createParticles(document.querySelector('#hero-particles'));
initLanguage({projectSummaries,experienceLabels});
initGallery();
initCursor();
initLoop();
