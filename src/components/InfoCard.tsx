import { type Exhibit } from "@/data/exhibits";
import { stories } from "@/data/exhibitStories";
import { Icon } from "./Icons";

export function InfoCard({item,onClose}:{item:Exhibit;onClose:()=>void}){
  const story=stories[item.id];
  return <aside className="info-card" aria-label={item.name+" · 展区介绍"} aria-live="polite">
    <div className="info-art" style={{color:item.color}}><img src={"/art/"+item.plate+".svg"} alt={item.name+"主题插画"}/><small>FIELD NOTE {item.id}</small></div>
    <div className="info-copy"><div className="kicker">DEMO EXHIBIT · 演示展区</div><h3>{item.name}</h3><em>{item.english} / {item.habitat}</em><p>{item.note}</p>
      {story&&<div className="nature-fact"><strong>自然现象 / {story.phenomenon}</strong><p>{story.fact}</p></div>}
      <small>模拟坐标，不代表真实植物分布</small><button className="continue-explore" onClick={onClose}>继续探索星球 <Icon name="arrow" size={14}/></button></div>
    <button className="info-close" aria-label="关闭展区介绍" onClick={onClose}><Icon name="cross" size={15}/></button>
  </aside>;
}
