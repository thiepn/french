import './styles/base.css';
import { createShell } from './core/shell';
import { createRouter } from './core/router';
import { beginBackgroundStartup } from './core/startup';

performance.mark('french-vnext-bootstrap-start');
const app=document.querySelector<HTMLElement>('#app');
if(!app) throw new Error('French vNext root is missing.');
const shell=createShell(app);
createRouter(shell).start();

requestAnimationFrame(()=>{
  document.documentElement.dataset.shellReady='true';
  performance.mark('french-vnext-shell-ready');
  performance.measure('french-vnext-shell-bootstrap','french-vnext-bootstrap-start','french-vnext-shell-ready');
  void beginBackgroundStartup(shell);
});

const registerOfflineShell=()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('/service-worker.js').catch(error=>console.warn('French offline shell registration failed',error));};
if(document.readyState==='complete')setTimeout(registerOfflineShell,0);else window.addEventListener('load',()=>setTimeout(registerOfflineShell,0),{once:true});
