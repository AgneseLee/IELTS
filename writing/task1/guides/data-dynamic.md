# Task 1 Notes：Dynamic Data Charts

> Use when the chart shows meaningful change over time.

Navigation: [Task 1 hub](../README.md) · [Static charts](data-static.md)

## Writing Route

1. Identify the common direction and main exception.
2. Group lines or categories by behaviour, not display order.
3. Support trends with start, end, peak, low or reversal data.

---

## Trend Language

### 趋势动词 × 程度副词（成对记，不要拆开）

| 程度 | 上升 | 下降 |
|---|---|---|
| 剧烈 | surge / soar / rocket | plummet / plunge / collapse |
| 明显 | rise / climb / increase | fall / drop / decline |
| 缓慢 | edge up / creep up | ease / dip / slip |
| 平稳 | remain stable / level off / plateau | — |
| 波动 | fluctuate / oscillate | — |
| 反弹 | rebound / recover | — |

核心句型：
- `X soared from A to B between [year] and [year].`
- `X edged up marginally, reaching only Y by [year].`
- `X fluctuated throughout the period, ultimately settling at Y.`

**"不变"的两种表达（可互换）：**
- `maintained its original share at 8%` — 强调份额/比例（适合百分比数据）
- `remained at its original level of 8%` — 强调水平/数值（更通用）
- `remained stable at around 8%` — 最简洁，最常用

#### 程度副词选词指南（看幅度再选词）

| 变化幅度 | 副词 | 形容词 |
|---|---|---|
| <5% / 极微小 | negligibly | negligible |
| 5–15% / 轻微 | marginally / slightly | marginal / slight |
| 15–30% / 适度 | moderately / gradually | moderate / gradual |
| 30–50% / 显著 | substantially / considerably | substantial / considerable |
| >50% / 剧烈 | dramatically / sharply | dramatic / sharp |

**常见错误**：用 `slightly` 描述大幅变化。
- ✗ `dropped slightly from 6,000 to 3,000` ← 减少了50%，不是"slightly"
- ✓ `dropped considerably from 6,000 to 3,000`
- ✓ `dropped slightly from 5,200 to 5,000` ← 这才是 slightly

**口诀**：写 `slightly` 前先问自己——变化超过15%了吗？超过就换词。

---

## Dynamic Charts

### Line graph：实用句型

#### 变化率专用名词（y 轴为 % change 时）

| 词 | 用法 |
|---|---|
| `rate of change` | 最通用，替换 price/figure |
| `percentage change` | 强调单位 |
| `growth rate` | 仅用于正值区间 |

#### 峰谷与稳定

| 句型 | 例句 |
|---|---|
| `having peaked at X in [month], ...` | `Zinc followed a similar pattern, having peaked at 3% in February.` |
| `stabilised at around X%` | `Its rate of change stabilised at around -1% between July and October.` |
| `declined dramatically, plummeting to X` | `Nickel declined dramatically, plummeting to -3% in June.` |

#### 比较与收敛

| 句型 | 例句 |
|---|---|
| `a level comparable to X and Y` | `...recovering to 1% by December — a level comparable to Zinc and Copper.` |
| `followed a broadly similar pattern` | `Zinc's rate of change followed a broadly similar pattern.` |
| `decelerated compared to their X levels` | `The rates of change decelerated compared to their January levels.` |
| `converged at approximately X%` | `By December, all three metals converged at approximately 1–2%.` |

---

### 多线图分组原则

按**行为模式**分组，不按系列顺序：

- 稳定组（如 Copper）→ 段2
- 波动组（如 Nickel + Zinc）→ 段3，内部再比较

✗ 错误做法：Copper 段、Nickel 段、Zinc 段（三段各自描述，缺比较）
✓ 正确做法：Copper 段（稳定）+ Nickel & Zinc 段（波动 + 对比）

### Participation：活动参与人数

| 错误 | 修正 | 原因 |
|---|---|---|
| `participants who enroll in five different activities` | `participation in five different activities` / `people taking part in five different activities` | 图表统计参与人数，不一定是“报名人数”；且历史数据应使用过去时 |
| `recorded the highest participants` | `recorded the highest number of participants` | `participants` 是人，排名的是其“数量” |
| `climbed up from 16 to 20` | `climbed from 16 to 20` | `climb` 已含“向上”，`up` 冗余 |
| `maintained steady growth` | `grew steadily` / `maintained a steady upward trend` | `maintain growth` 在此不自然；动词与名词搭配要完整 |

**数据精度与平均值：**
- 折线终点位于 20 以下时，写 `about 18` 或 `just under 20`，不要直接写成 20。
- 图中未直接给出平均值时，优先报告范围、起终点或峰谷；自行估算平均值会弱化趋势描述的精确性。

**`opposite pattern` 的完整结构：**
- ✗ `This was an almost opposite pattern occurred in table tennis.`
- ✓ `An almost opposite pattern occurred in table tennis.`
- ✓ `Table tennis followed an almost opposite pattern.`

### Ownership：电器拥有率与家务时间

| 错误 | 修正 | 原因 |
|---|---|---|
| `the distribution of households with electrical appliances` | `the percentages of households that owned three electrical appliances` | 图表显示的是拥有率/百分比，不是笼统 distribution |
| `the figure of refrigerator` | `refrigerator ownership` / `the proportion of households with refrigerators` | 单个电器趋势可用 ownership，避免 `figure of + 名词` |
| `began with zero` | `stood at zero` / `no households had...` | 描述起始数值更自然 |
| `the portion of vacuum cleaner` | `vacuum cleaner ownership` | `portion of` 不适合直接接电器名 |

### Absolute numbers：店铺开关等

| 错误 | 修正 | 原因 |
|---|---|---|
| `allocation for new shops` | `number of shop openings` | 店铺开关数量是绝对数量，不是预算分配 |
| `the closing number` | `the number of closures` | 名词修饰顺序不自然 |
| `peaked at the highest position` | `peaked at about 7,100` | `peak at` 后直接接数值 |
