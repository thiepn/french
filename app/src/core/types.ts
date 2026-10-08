export const ROUTE_IDS=['home','learn','review','read','words','listen','speak','conversation','progress','settings'] as const;
export type RouteId=(typeof ROUTE_IDS)[number];
export interface ShellApi{main:HTMLElement;setActiveRoute(route:RouteId):void;setStatus(message:string):void;}
export interface RouteContext{main:HTMLElement;route:RouteId;signal:AbortSignal;navigate(route:RouteId):void;}
export interface RouteModule{mount(context:RouteContext):void|Promise<void>;}
