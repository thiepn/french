export function recordRuntimePerformance():void{
  const nav=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
  const shell=performance.getEntriesByName('french-vnext-shell-bootstrap')[0];
  window.dispatchEvent(new CustomEvent('french:vnext-performance',{detail:{shellMs:shell?.duration??null,domContentLoadedMs:nav?.domContentLoadedEventEnd??null,loadMs:nav?.loadEventEnd??null}}));
}
