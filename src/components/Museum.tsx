"use client";
import { useEffect, useRef, useState } from "react";
import { Icon, LeafMark } from "./Icons";
import { ExhibitIndex } from "./ExhibitIndex";
import { GlobeView } from "./GlobeView";
import { useExplorer } from "@/hooks/useExplorer";

export function Museum(){
  const model=useExplorer();
  const [panel,setPanel]=useState<"about"|"guide"|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const closeCard=model.close;
  useEffect(()=>{
    function key(e:KeyboardEvent){if(e.key==="Escape"&&!dialog.current?.open)closeCard();}
    window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);
  },[closeCard]);
  useEffect(()=>{if(panel&&!dialog.current?.open)dialog.current?.showModal();},[panel]);
  function explore(id:string){
    model.select(id,true);
    if(window.matchMedia("(max-width: 760px)").matches)document.getElementById("observatory")?.scrollIntoView({block:"center"});
  }
  return <main className="museum" id="museum">
    <div className="sky" aria-hidden="true"/>
    <header className="topbar">
      <a className="brand" href="#museum" aria-label="Wonder Nature 首页" onClick={model.reset}><LeafMark/><span>Wonder Nature</span></a>
      
      <span className="status"><i/> 展馆开放 <span>/ OPEN</span></span>
    </header>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="exhibition"><i/> EXHIBITION <b>001</b> <span/> </div>
        <h1 id="hero-title">Garden<br/><em>Planet<span>.</span></em></h1>
        <h2>探索地球上的奇妙生命</h2>
        <p>一座生长在宇宙里的微型花园。<br/>转动星球，走进森林、花原与高地。</p>
        <div className="hero-actions"><button className="primary" onClick={()=>explore("01")} disabled={!model.ready}>开始探索 <Icon name="arrow" size={17}/></button>
        <button className="guide" onClick={()=>setPanel("guide")}><Icon name="book" size={16}/> 操作指南</button></div>
      </div>
      <GlobeView model={model}/>
      <nav className="hero-nav" aria-label="主导航"><a href="#museum" onClick={model.reset}>星球探索</a><a href="#exhibits">展点索引</a><button onClick={()=>setPanel("about")}>关于展馆</button></nav>
    </section>
    <ExhibitIndex select={explore} active={model.selected?.id} ready={model.ready}/>
    <footer><span><i/> WONDER NATURE <b>/</b> 数字自然博物馆 <b>·</b> v0.2.0</span><span>FIELD SERIES <b>·</b> VOL. 01</span></footer>
    <dialog ref={dialog} onClose={()=>setPanel(null)} onClick={e=>{if(e.target===dialog.current)dialog.current?.close();}}>
      <section className="dialog-content"><button className="dialog-close" aria-label="关闭弹窗" onClick={()=>dialog.current?.close()}><Icon name="cross"/></button>
      <div className="exhibition"><i/>{panel==="about"?"MUSEUM NOTES":"FIELD GUIDE"}</div>
      <h2>{panel==="about"?"关于奇妙自然":"观察指南"}</h2>
      {panel==="about"?<><p>Wonder Nature 是一座可以用手转动的数字自然博物馆。第一号展览「花园星球」收录了四处想象中的生境。</p><p>地貌、植被和标本插画均为原创程序绘制。展点使用模拟坐标，供体验交互，不代表植物的真实分布。</p><p>当前版本：v0.2.0 · 首页体验升级版。植物互动展品正在持续开发中。</p></>:<ul><li><b>旋转</b>鼠标拖动，或在星球上单指滑动。</li><li><b>缩放</b>滚动滚轮、双指捏合，或使用加减按钮。</li><li><b>观察</b>点击球面标记或索引卡片，打开生境介绍。</li><li><b>键盘</b>聚焦星球后用方向键旋转，＋ / − 缩放，Home 复位。Esc 关闭信息卡。</li></ul>}
      <button className="primary dialog-ok" onClick={()=>dialog.current?.close()}>返回展览 <Icon name="arrow" size={16}/></button></section>
    </dialog>
  </main>;
}
