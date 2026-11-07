import type { CSSProperties } from "react";

const shapes={
  arrow: "M5 12h14m-6-6 6 6-6 6",
  diagonal:"M6 18 18 6M7 6h11v11",
  cross:"m6 6 12 12M18 6 6 18",
  plus:"M5 12h14M12 5v14", minus:"M5 12h14",
  reset:"M4 10a8 8 0 1 1 .7 6M4 4v6h6",
  book:"M3 5.5c3-1 6-.3 9 1.5 3-1.8 6-2.5 9-1.5v13c-3-1-6-.3-9 1.5-3-1.8-6-2.5-9-1.5ZM12 7v13",
  hand:"M8 12V6.4a1.45 1.45 0 0 1 2.9 0v4.4-6.1a1.45 1.45 0 0 1 2.9 0v6.1-4.3a1.45 1.45 0 0 1 2.9 0v4.3-2.2a1.45 1.45 0 0 1 2.9 0v6.2c0 3.4-2.3 5.9-6.1 5.9h-.6c-2 0-3.6-1-4.8-2.6L4.4 13a1.45 1.45 0 0 1 2.2-1.8L8 12.5",
  orbit:"M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM2.6 17.5c1.2 2.1 6.4.4 11.1-2.4s8.7-6.6 7.4-8.6",
  grid:"M3.5 3.5h6.3v6.3H3.5zM14.2 3.5h6.3v6.3h-6.3zM3.5 14.2h6.3v6.3H3.5zM14.2 14.2h6.3v6.3h-6.3z",
  info:"M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6M12 7v.1",
} as const;
export function Icon({name,size=18,style}:{name:keyof typeof shapes;size?:number;style?:CSSProperties}){
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={shapes[name]}/></svg>;
}
export function LeafMark(){
  return <svg aria-hidden="true" width="35" height="35" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round"><path d="M8 31Q5 9 32 7Q33 33 8 31Z M8 31 29 10M15 24l-1-7M20 19l7-1"/><ellipse cx="20" cy="21" rx="18" ry="6" transform="rotate(-38 20 21)"/></svg>;
}
