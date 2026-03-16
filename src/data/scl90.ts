// SCL-90 题目数据和因子映射
// 标准SCL-90量表包含90个题目，分为9个因子

export interface Question {
  id: number;
  text: string;
  factorId: string;
}

export interface Factor {
  id: string;
  name: string;
  questionIds: number[];
  description: string;
}

// 9个因子定义
export const factors: Factor[] = [
  {
    id: "somatization",
    name: "躯体化",
    questionIds: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
    description: "反映身体不适感，包括心血管、胃肠道、呼吸和其他系统的主诉不适。",
  },
  {
    id: "obsessive_compulsive",
    name: "强迫症状",
    questionIds: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
    description: "反映与经典强迫症状相联系的那些行为和思想，还包括一些认知障碍的行为征象。",
  },
  {
    id: "interpersonal_sensitivity",
    name: "人际关系敏感",
    questionIds: [6, 21, 34, 36, 37, 41, 61, 69, 73],
    description: "反映个人不自在感与自卑感，尤其是在与他人相比较时更为突出。",
  },
  {
    id: "depression",
    name: "抑郁",
    questionIds: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
    description: "反映与临床抑郁症状相联系的广泛概念，包括苦闷、失望、精力减退及生活兴趣丧失等。",
  },
  {
    id: "anxiety",
    name: "焦虑",
    questionIds: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
    description: "反映焦虑、紧张、惊恐及躯体性相关征象。",
  },
  {
    id: "hostility",
    name: "敌对",
    questionIds: [11, 24, 63, 67, 74, 81],
    description: "反映敌对的思想、感情及行为方面的表现。",
  },
  {
    id: "phobic_anxiety",
    name: "恐怖",
    questionIds: [13, 25, 47, 50, 70, 75, 82],
    description: "反映与传统恐惧症状定义相关的体验和反应。",
  },
  {
    id: "paranoid_ideation",
    name: "偏执",
    questionIds: [8, 18, 43, 68, 76, 83],
    description: "反映猜疑和关系妄想等偏执性思维的表现。",
  },
  {
    id: "psychoticism",
    name: "精神病性",
    questionIds: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
    description: "反映精神病性的表现，包括思维播散、被控制感等。",
  },
];

// 额外题目（不属于任何因子，但计入总分）: 19, 44, 59, 60, 64, 66, 89

// 90个题目
export const questions: Question[] = [
  { id: 1, text: "头痛", factorId: "somatization" },
  { id: 2, text: "神经过敏，心中不踏实", factorId: "anxiety" },
  { id: 3, text: "头脑中有不必要的想法或字句盘旋", factorId: "obsessive_compulsive" },
  { id: 4, text: "头昏或昏倒", factorId: "somatization" },
  { id: 5, text: "对异性的兴趣减退", factorId: "depression" },
  { id: 6, text: "对旁人责备求全", factorId: "interpersonal_sensitivity" },
  { id: 7, text: "感到别人能控制您的思想", factorId: "psychoticism" },
  { id: 8, text: "责怪别人制造麻烦", factorId: "paranoid_ideation" },
  { id: 9, text: "忘记性大", factorId: "obsessive_compulsive" },
  { id: 10, text: "担心自己的衣饰整齐及仪态的端正", factorId: "obsessive_compulsive" },
  { id: 11, text: "容易烦恼和激动", factorId: "hostility" },
  { id: 12, text: "胸痛", factorId: "somatization" },
  { id: 13, text: "害怕空旷的场所或街道", factorId: "phobic_anxiety" },
  { id: 14, text: "感到自己的精力下降，活动减慢", factorId: "depression" },
  { id: 15, text: "想结束自己的生命", factorId: "depression" },
  { id: 16, text: "听到旁人听不到的声音", factorId: "psychoticism" },
  { id: 17, text: "发抖", factorId: "anxiety" },
  { id: 18, text: "感到大多数人都不可信任", factorId: "paranoid_ideation" },
  { id: 19, text: "胃口不好", factorId: "additional" },
  { id: 20, text: "容易哭泣", factorId: "depression" },
  { id: 21, text: "同异性相处时感到害羞不自在", factorId: "interpersonal_sensitivity" },
  { id: 22, text: "感到受骗，中了圈套或有人想抓住您", factorId: "depression" },
  { id: 23, text: "无缘无故地突然感到害怕", factorId: "anxiety" },
  { id: 24, text: "自己不能控制地大发脾气", factorId: "hostility" },
  { id: 25, text: "怕单独出门", factorId: "phobic_anxiety" },
  { id: 26, text: "经常责怪自己", factorId: "depression" },
  { id: 27, text: "腰痛", factorId: "somatization" },
  { id: 28, text: "感到难以完成任务", factorId: "obsessive_compulsive" },
  { id: 29, text: "感到孤独", factorId: "depression" },
  { id: 30, text: "感到苦闷", factorId: "depression" },
  { id: 31, text: "过分担忧", factorId: "depression" },
  { id: 32, text: "对事物不感兴趣", factorId: "depression" },
  { id: 33, text: "感到害怕", factorId: "anxiety" },
  { id: 34, text: "您的感情容易受到伤害", factorId: "interpersonal_sensitivity" },
  { id: 35, text: "旁人能知道您的私下想法", factorId: "psychoticism" },
  { id: 36, text: "感到别人不理解您、不同情您", factorId: "interpersonal_sensitivity" },
  { id: 37, text: "感到人们对您不友好，不喜欢您", factorId: "interpersonal_sensitivity" },
  { id: 38, text: "做事必须做得很慢以保证做得正确", factorId: "obsessive_compulsive" },
  { id: 39, text: "心跳得很厉害", factorId: "anxiety" },
  { id: 40, text: "恶心或胃部不舒服", factorId: "somatization" },
  { id: 41, text: "感到比不上他人", factorId: "interpersonal_sensitivity" },
  { id: 42, text: "肌肉酸痛", factorId: "somatization" },
  { id: 43, text: "感到有人在监视您、谈论您", factorId: "paranoid_ideation" },
  { id: 44, text: "难以入睡", factorId: "additional" },
  { id: 45, text: "做事必须反复检查", factorId: "obsessive_compulsive" },
  { id: 46, text: "难以做出决定", factorId: "obsessive_compulsive" },
  { id: 47, text: "怕乘电车、公共汽车、地铁或火车", factorId: "phobic_anxiety" },
  { id: 48, text: "呼吸有困难", factorId: "somatization" },
  { id: 49, text: "一阵阵发冷或发热", factorId: "somatization" },
  { id: 50, text: "因为感到害怕而避开某些东西、场合或活动", factorId: "phobic_anxiety" },
  { id: 51, text: "脑子变空了", factorId: "obsessive_compulsive" },
  { id: 52, text: "身体发麻或刺痛", factorId: "somatization" },
  { id: 53, text: "喉咙有梗塞感", factorId: "somatization" },
  { id: 54, text: "感到前途没有希望", factorId: "depression" },
  { id: 55, text: "不能集中注意力", factorId: "obsessive_compulsive" },
  { id: 56, text: "感到身体的某一部分软弱无力", factorId: "somatization" },
  { id: 57, text: "感到紧张或容易紧张", factorId: "anxiety" },
  { id: 58, text: "感到手或脚发重", factorId: "somatization" },
  { id: 59, text: "想到死亡的事", factorId: "additional" },
  { id: 60, text: "吃得太多", factorId: "additional" },
  { id: 61, text: "当别人看着您或谈论您时感到不自在", factorId: "interpersonal_sensitivity" },
  { id: 62, text: "有一些不属于您自己的想法", factorId: "psychoticism" },
  { id: 63, text: "有想打人或伤害他人的冲动", factorId: "hostility" },
  { id: 64, text: "醒得太早", factorId: "additional" },
  { id: 65, text: "必须反复洗手、点数目或触摸某些东西", factorId: "obsessive_compulsive" },
  { id: 66, text: "睡得不稳不深", factorId: "additional" },
  { id: 67, text: "有想摔坏或破坏东西的冲动", factorId: "hostility" },
  { id: 68, text: "有一些别人没有的想法或念头", factorId: "paranoid_ideation" },
  { id: 69, text: "感到对别人神经过敏", factorId: "interpersonal_sensitivity" },
  { id: 70, text: "在商店或电影院等人多的地方感到不自在", factorId: "phobic_anxiety" },
  { id: 71, text: "感到任何事情都很困难", factorId: "depression" },
  { id: 72, text: "一阵阵恐惧或惊恐", factorId: "anxiety" },
  { id: 73, text: "感到在公共场合吃东西很不舒服", factorId: "interpersonal_sensitivity" },
  { id: 74, text: "经常与人争论", factorId: "hostility" },
  { id: 75, text: "单独一人时神经很紧张", factorId: "phobic_anxiety" },
  { id: 76, text: "别人对您的成绩没有做出恰当的评价", factorId: "paranoid_ideation" },
  { id: 77, text: "即使和别人在一起也感到孤单", factorId: "psychoticism" },
  { id: 78, text: "感到坐立不安心神不定", factorId: "anxiety" },
  { id: 79, text: "感到自己没有什么价值", factorId: "depression" },
  { id: 80, text: "感到熟悉的东西变成陌生或不像是真的", factorId: "anxiety" },
  { id: 81, text: "大叫或摔东西", factorId: "hostility" },
  { id: 82, text: "害怕会在公共场合昏倒", factorId: "phobic_anxiety" },
  { id: 83, text: "感到别人想占您的便宜", factorId: "paranoid_ideation" },
  { id: 84, text: "为一些有关性的想法而很苦恼", factorId: "psychoticism" },
  { id: 85, text: "您认为应该因为自己的过错而受到惩罚", factorId: "psychoticism" },
  { id: 86, text: "感到要赶快把事情做完", factorId: "anxiety" },
  { id: 87, text: "感到自己的身体有严重问题", factorId: "psychoticism" },
  { id: 88, text: "从未感到和其他人很亲近", factorId: "psychoticism" },
  { id: 89, text: "感到自己有罪", factorId: "additional" },
  { id: 90, text: "感到自己的脑子有毛病", factorId: "psychoticism" },
];

export const scaleOptions = [
  { value: 1, label: "无", description: "自觉无该项症状" },
  { value: 2, label: "很轻", description: "自觉有该项症状，但不太明显" },
  { value: 3, label: "中度", description: "自觉有该项症状，对受检者有一定影响" },
  { value: 4, label: "偏重", description: "自觉该项症状较重，对受检者有相当程度的影响" },
  { value: 5, label: "严重", description: "自觉该项症状的频度和强度都十分严重" },
];

export interface FactorResult {
  factorId: string;
  name: string;
  score: number; // 因子均分
  description: string;
  level: "normal" | "mild" | "moderate" | "severe";
  interpretation: string;
}

export interface TestResult {
  totalScore: number;
  totalAverage: number; // 总均分 = 总分 / 90
  positiveItems: number; // 阳性项目数（>=2分的题目数）
  positiveAverage: number; // 阳性症状均分
  factorResults: FactorResult[];
  overallLevel: "normal" | "mild" | "moderate" | "severe";
  suggestion: string;
}

function getFactorLevel(score: number): "normal" | "mild" | "moderate" | "severe" {
  if (score < 2) return "normal";
  if (score < 3) return "mild";
  if (score < 4) return "moderate";
  return "severe";
}

function getFactorInterpretation(name: string, level: string): string {
  const interpretations: Record<string, Record<string, string>> = {
    normal: {
      default: `${name}方面未见明显异常，状态良好。`,
    },
    mild: {
      default: `${name}方面存在轻微症状，建议保持关注，适当进行自我调适。`,
    },
    moderate: {
      default: `${name}方面存在中等程度的症状，建议寻求心理咨询师的帮助。`,
    },
    severe: {
      default: `${name}方面存在较严重的症状，强烈建议尽快寻求专业心理或医疗帮助。`,
    },
  };
  return interpretations[level]?.default || "";
}

export function calculateResults(answers: Record<number, number>): TestResult {
  // Ensure all 90 questions have a score (default to 1 if missing)
  const allScores: number[] = [];
  for (let i = 1; i <= 90; i++) {
    allScores.push(answers[i] || 1);
  }

  const totalScore = allScores.reduce((sum, v) => sum + v, 0);
  const totalAverage = Math.round((totalScore / 90) * 100) / 100;
  const positiveItems = allScores.filter((v) => v >= 2).length;
  const positiveSum = allScores.filter((v) => v >= 2).reduce((sum, v) => sum + v, 0);
  const positiveAverage = positiveItems > 0 ? Math.round((positiveSum / positiveItems) * 100) / 100 : 0;

  const factorResults: FactorResult[] = factors.map((factor) => {
    const factorScores = factor.questionIds.map((qId) => answers[qId] || 1);
    const score = factorScores.reduce((sum, v) => sum + v, 0) / factor.questionIds.length;
    const level = getFactorLevel(score);
    return {
      factorId: factor.id,
      name: factor.name,
      score: Math.round(score * 100) / 100,
      description: factor.description,
      level,
      interpretation: getFactorInterpretation(factor.name, level),
    };
  });

  const maxLevel = factorResults.reduce((max, f) => {
    const order = { normal: 0, mild: 1, moderate: 2, severe: 3 };
    return order[f.level] > order[max] ? f.level : max;
  }, "normal" as "normal" | "mild" | "moderate" | "severe");

  let suggestion: string;
  if (totalScore <= 160 && maxLevel === "normal") {
    suggestion = "您的心理健康状况总体良好。请继续保持健康的生活方式和积极的心态。";
  } else if (maxLevel === "mild" || (totalScore > 160 && totalScore <= 200)) {
    suggestion =
      "您存在一些轻微的心理不适症状。建议保持规律的作息、适度运动，必要时可以考虑寻求心理咨询支持。";
  } else if (maxLevel === "moderate" || (totalScore > 200 && totalScore <= 250)) {
    suggestion =
      "您目前存在中等程度的心理困扰，建议尽早预约专业心理咨询师进行进一步评估和干预。";
  } else {
    suggestion =
      "您目前存在较为严重的心理困扰，强烈建议您立即寻求专业的心理或精神科医疗帮助。如有紧急情况，请拨打心理援助热线：400-161-9995。";
  }

  return {
    totalScore,
    totalAverage,
    positiveItems,
    positiveAverage,
    factorResults,
    overallLevel: maxLevel,
    suggestion,
  };
}
