"use client";
import { useEffect, useRef, useState } from "react";
import type { Explorer } from "@/hooks/useExplorer";
import { exhibits } from "@/data/exhibits";
import { InfoCard } from "./InfoCard";
import { Icon } from "./Icons";
import type { CSSProperties } from "react";

export function GlobeView({model}:{model:Explorer}){
  const {controls,setReady,setZoom,interact}=model;
  const stage=useRef<HTMLDivElement>(null),terrain=useRef<HTMLCanvasElement>(null),fallback=useRef<HTMLCanvasElement>(null),leaves=useRef<HTMLCanvasElement>(null);
  const pins=useRef<Array<HTMLButtonElement | null>>([]);
  const [failed,setFailed]=useState(false),[attempt,retry]=useState(0);
  useEffect(()=>{
    let active=true; let local:typeof controls.current=null;
    const target=stage.current!;
    setReady(false);setFailed(false);
    Promise.all([import("@/globe/scene"),import("@/globe/assets").then(m=>m.getAssets())]).then(([{createScene},assets])=>{
      if(!active)return;
      local=createScene({stage:target,terrain:terrain.current!,fallback:fallback.current!,canopy:leaves.current!,pins:pins.current,onZoom:setZoom,onInteract:interact},assets);
      controls.current=local;setReady(true);
    }).catch(()=>{if(active)setFailed(true);});
    const lost=(e:Event)=>{e.preventDefault();if(active)retry(v=>v+1);};
    const glCanvas=terrain.current!;glCanvas.addEventListener("webglcontextlost",lost);
    return ()=>{active=false;local?.dispose();controls.current=null;glCanvas.removeEventListener("webglcontextlost",lost);};
  },[controls,setReady,setZoom,interact,attempt]);
  return <div className="observatory" id="observatory">
    <div className="figure-label"><i/> FIG. 01 <b>/</b> ORBITAL VIEW</div>
    <div ref={stage} className="planet-stage" aria-label="交互式花园星球，可拖动或使用方向键旋转，加减键缩放" tabIndex={0} aria-busy={!model.ready&&!failed}>
      <canvas ref={terrain} aria-hidden="true"/><canvas ref={fallback} hidden aria-hidden="true"/><canvas ref={leaves} aria-hidden="true"/>
      {exhibits.map((e,i)=><button key={e.id} ref={v=>{pins.current[i]=v;}} hidden className={"map-pin"+(model.selected?.id===e.id?" chosen":"")} style={{"--pin":e.color} as CSSProperties} onClick={()=>model.select(e.id,false)} aria-pressed={model.selected?.id===e.id} aria-label={"探索 "+e.name}>
        <span className="pin-dot"/><span className="pin-caption"><b>{e.id}</b> {e.name}</span>
      </button>)}
    </div>
    {!model.ready&&<div className="scene-loading" role="status">{failed?<><span>星球素材加载失败</span><button onClick={()=>retry(v=>v+1)}>重新加载</button></>:<><i/> 正在展开花园星球</>}</div>}
    <div className="view-toolbar">
      <span className="gesture"><Icon name="hand" size={15}/><span className="desktop-tip">{model.touched?"拖动旋转 · 滚轮缩放":"拖动地球，开始探索"}</span><span className="mobile-tip">单指旋转 · 双指缩放</span></span>
      <div className="zoom-group"><button disabled={!model.ready||model.zoom<=72} aria-label="缩小地球" onClick={()=>controls.current?.zoomBy(1/1.16)}><Icon name="minus" size={14}/></button>
      <output aria-label="缩放比例">{model.zoom}%</output>
      <button disabled={!model.ready||model.zoom>=240} aria-label="放大地球" onClick={()=>controls.current?.zoomBy(1.16)}><Icon name="plus" size={14}/></button>
      <i/><button aria-label="复位视角" disabled={!model.ready} onClick={model.reset}><Icon name="reset" size={14}/></button></div>
    </div>
    {model.selected&&<InfoCard item={model.selected} onClose={model.close}/>}
  </div>;
}
