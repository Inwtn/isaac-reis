import './style.css';
import {profile,chapters} from './content.js';
import {sectionHTML} from './panels.js';
document.querySelector('main').innerHTML=`<a href="./index.html">← Explore the valley</a><h1>${profile.name}</h1><p>Software Engineer · Brazil</p><nav aria-label="Portfolio sections">${chapters.map(c=>`<a href="#${c.id}">${c.name}</a>`).join('')}</nav>${chapters.map(c=>`<section id="${c.id}"><h2>${c.name}</h2>${sectionHTML(c)}</section>`).join('')}`;
