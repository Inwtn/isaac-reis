export function buildCaseChapters(content){
 const project=content.cards?.[0];if(project?.sections)return {kind:'project',title:project.title,label:'SELECTED WORK / CASE STUDY',tags:project.tags,url:project.url,liveUrl:project.liveUrl,date:project.date,chapters:[{title:'At a glance',paragraphs:[project.text]},...project.sections]};
 const job=content.experience?.[0];if(job)return {kind:'experience',title:job.title.split(' · ')[1]||job.title,label:'PROFESSIONAL JOURNEY / FIELD NOTES',tags:job.tags,date:job.date,role:job.title.split(' · ')[0],chapters:[{title:'The role',paragraphs:[job.text]},{title:'Scope & ownership',bullets:job.responsibilities?.slice(0,3)||[]},{title:'Work delivered',bullets:job.responsibilities?.slice(3)||[]},{title:'Tools & perspective',paragraphs:[`Role: ${job.title}. Based in ${job.location||'Brazil'}. ${job.date}.`],tags:job.tags}]};
 return null;
}
