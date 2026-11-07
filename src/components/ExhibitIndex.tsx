import { exhibits } from "@/data/exhibits";
import { stories } from "@/data/exhibitStories";
import type { CSSProperties } from "react";
export function ExhibitIndex({select,active,ready}:{select:(id:string)=>void;active?:string;ready:boolean}){
  return <section className="catalog" id="exhibits" aria-labelledby="index-title">
    <div className="section-head"><div><span className="index-kicker"><i/> FIELD INDEX</span><h2 id="index-title">从这里，走进自然</h2></div><span className="catalog-meta"><strong>{String(exhibits.length).padStart(2,"0")}</strong> 个演示展区</span></div>
    <div className="exhibit-grid">{exhibits.map(e=><button key={e.id} disabled={!ready} className={"exhibit-card"+(active===e.id?" active":"")} onClick={()=>select(e.id)} style={{"--accent":e.color} as CSSProperties} aria-pressed={active===e.id} aria-label={"探索 "+e.name}>
      <span className="spec-number"><i/> FIELD NOTE / {e.id}</span>
      <img className="spec-plate" alt="" src={"/art/botanical/"+e.plate+".webp"}/>
      <span className="spec-text"><strong>{e.name}</strong><em>{e.english}</em><span className="spec-teaser">{stories[e.id]?.teaser}</span></span>
    </button>)}</div>
  </section>;
}
