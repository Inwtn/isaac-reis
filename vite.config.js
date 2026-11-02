import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{rollupOptions:{input:{portfolio:'index.html',valley:'valley.html',simple:'simples.html'}}}});
