export type Exhibit = {
  id: string;
  name: string;
  english: string;
  plate: string;
  color: string;
  latitude: number;
  longitude: number;
  habitat: string;
  note: string;
};

// Imaginary locations on the generated surface. These are not occurrence records.
export const exhibits: readonly Exhibit[] = [
  { id: "01", name: "雾林蕨谷", english: "Fern Valley", plate: "fern", color: "#b5d787", latitude: 8, longitude: 70, habitat: "林下生境", note: "沿着羽状的叶片观察，一片蕨叶还分出许多小羽片。这里用层层展开的叶形，模拟潮湿林下的植被。" },
  { id: "02", name: "琥珀花原", english: "Amber Meadow", plate: "poppy", color: "#e2a077", latitude: 48, longitude: 145, habitat: "开阔花原", note: "从星球上看，暖色的花冠连成一小片亮斑。放大观察花瓣的弧度，再看看它们和周围草地的疏密变化。" },
  { id: "03", name: "紫雾高地", english: "Violet Highlands", plate: "lupine", color: "#b6a0d5", latitude: -15, longitude: 138, habitat: "高地花坡", note: "紫色的小花沿一条花轴向上排列。这个展点用高低错落的花序，表现山坡上成簇的植被。" },
  { id: "04", name: "青叶荒漠", english: "Agave Basin", plate: "agave", color: "#8dc6ba", latitude: 4, longitude: -109, habitat: "干旱盆地", note: "从上方看，厚实的叶片由中心向外旋开。转动星球，比较莲座状叶丛与蕨谷的羽状轮廓。" }
];
