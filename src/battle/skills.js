const getSkillsForType = (type) => {
  const skills = {
    FireTypeSkills: [
      {
        name: "Flame Burst",
        category: "Attack",
        power: 70,
        effect: null,
        successRate: null,
      },
      {
        name: "Fire Shield",
        category: "Defense",
        power: null,
        effect: null,
        successRate: null,
      },
      {
        name: "Healing Warmth",
        category: "Recovery",
        power: 50,
        effect: null,
        successRate: null,
      },
      {
        name: "Blazing Inferno",
        category: "Special",
        power: 90,
        effect: "Burn",
        successRate: 50,
      },
    ],
    defaultSkills: [
      {
        name: "たたかう",
        category: "Attack",
        power: 70,
        effect: null,
        successRate: null,
      },
      {
        name: "まもる",
        category: "Defense",
        power: null,
        effect: null,
        successRate: null,
      },
      {
        name: "かいふく",
        category: "Recovery",
        power: 50,
        effect: null,
        successRate: null,
      },
      {
        name: "とくしゅ",
        category: "Special",
        power: 90,
        effect: "Burn",
        successRate: 50,
      },
    ],
  };

  // タイプの最初の文字を大文字に変換し、残りはそのままにしてキー名を生成
  const skillType = type.charAt(0).toUpperCase() + type.slice(1);
  const skillKey = `${skillType}TypeSkills`;
  console.log(skillKey);
  return skills[skillKey] || skills['defaultSkills'];
};

export { getSkillsForType };
