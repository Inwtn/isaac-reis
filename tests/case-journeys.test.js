import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCaseChapters} from '../src/horizon/case-model.js';
import {projects,experience} from '../src/professional-details.js';
test('case journeys retain every project explanation, including the third StreamHub project',()=>{assert(projects.some(p=>p.url==='https://github.com/Inwtn/streamhub'));for(const project of projects){const model=buildCaseChapters({cards:[project]});const rendered=JSON.stringify(model.chapters);assert(rendered.includes(project.text));for(const section of project.sections){for(const text of [...section.paragraphs||[],...section.steps||[],...section.bullets||[]])assert(rendered.includes(text),project.title+': lost content');}}});
test('career journeys preserve all original responsibilities and dates',()=>{for(const job of experience){const model=buildCaseChapters({experience:[job]});const text=JSON.stringify(model);assert(text.includes(job.date));assert(text.includes(job.text));for(const item of job.responsibilities)assert(text.includes(item),job.title+': lost responsibility');}});
