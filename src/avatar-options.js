export const avatarChoices={
 skin:[['Warm beige','#e0aa87'],['Light','#f2cfad'],['Golden','#c98f60'],['Brown','#9b6446'],['Deep brown','#654332']],
 hairColor:[['Black','#202126'],['Brown','#694531'],['Blond','#d2ae64'],['Auburn','#a75b3c'],['Silver','#a4a8ac']],
 shirt:[['Charcoal','#24272c'],['Cream','#e2d8bd'],['Forest','#42634c'],['Blue','#476e93'],['Purple','#775889'],['Terracotta','#ac6248']],
 pants:[['Black','#303238'],['Denim','#46647d'],['Brown','#74563f'],['Olive','#596244'],['Light grey','#aaa79d']],
 shoes:[['White','#f4f0df'],['Black','#343638'],['Brown','#966645'],['Red','#ad5748']]
};
export const hairStyles=[['buzz','Buzz cut'],['short','Short'],['curly','Curly'],['long','Long'],['bald','Bald']];
export const avatarModels=[['male','Male'],['female','Female']];
export const DEFAULT_AVATAR={model:'male',name:'Explorer',skin:'#e0aa87',hairColor:'#202126',shirt:'#24272c',pants:'#303238',shoes:'#f4f0df',hairStyle:'buzz',glasses:true,beard:true};
const KEY='isaacs-valley-avatar-v1';
export function normalizeAvatar(value={}){value=value&&typeof value==='object'?value:{};const result={...DEFAULT_AVATAR};if(value.model==='female'){result.model='female';result.beard=false;result.hairStyle='long';}for(const key of Object.keys(avatarChoices))if(avatarChoices[key].some(([,color])=>color===value[key]))result[key]=value[key];if(hairStyles.some(([id])=>id===value.hairStyle))result.hairStyle=value.hairStyle;for(const key of ['glasses','beard'])if(typeof value[key]==='boolean')result[key]=value[key];if(typeof value.name==='string')result.name=value.name.trim().slice(0,24)||DEFAULT_AVATAR.name;if(result.model==='female')result.beard=false;return result;}
export function readAvatar(){try{return normalizeAvatar(JSON.parse(localStorage.getItem(KEY)));}catch{return {...DEFAULT_AVATAR};}}
export function saveAvatar(value){const avatar=normalizeAvatar(value);try{localStorage.setItem(KEY,JSON.stringify(avatar));}catch{}return avatar;}

export function selectAvatarModel(value,model){const look=normalizeAvatar(value);return normalizeAvatar({...look,model,beard:model==='female'?false:look.beard,hairStyle:model==='female'&&look.hairStyle==='buzz'?'long':look.hairStyle});}
