import fs from 'node:fs';
import {profile,chapters} from '../src/content.js';
import {sectionHTML} from '../src/panels.js';
const content=`<a href="./index.html">← Explore the valley</a><h1>${profile.name}</h1><p>Software Engineer · Brazil</p><nav aria-label="Portfolio sections">${chapters.map(c=>`<a href="#${c.id}">${c.name}</a>`).join('')}</nav>${chapters.map(c=>`<section id="${c.id}"><h2>${c.name}</h2>${sectionHTML(c)}</section>`).join('')}`;
fs.writeFileSync('simples.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Isaac Reis, Software Engineer: Java and Spring Boot projects, professional experience, skills and contact."><title>Isaac Reis · Text portfolio</title><link rel="icon" href="./gato.svg"></head><body><main class="simple-page">${content}</main><script type="module" src="/src/simple.js"></script></body></html>`);
