# Task 1 Notes：Dynamic Data Charts

> Use when the chart shows meaningful change over time.

Navigation: [Task 1 hub](../README.md) · [Static charts](data-static.md)

## Writing Route

1. Identify the common direction and main exception.
2. Group lines or categories by behaviour, not display order.
3. Support trends with start, end, peak, low or reversal data.

---

## 冲 7.5 的两个关键改进

### 1. Introduction — 真正改写，不要抄题目

✗ `The graph illustrates the number of shop closures and openings between 2011 and 2018.`
✓ `The line graph illustrates how the number of new shop openings and closures changed in one country over a seven-year period from 2011 to 2018.`

改写三步：① 指明图表类型（line graph / bar chart / pie chart）② 用 `how... changed` 替换 `illustrates the number of` ③ `over a seven-year period` 替换 `between X and Y`

### 2. Overall — 去掉具体数据，抓分析视角

Overall 段不放具体数字，那是 body 的工作。Overall 讲**规律和对比**。

✗ `While the number of openings began with the lion's share at 8,500 in 2011...` ← 有具体数字
✓ `Most notably, the two categories reversed their relative positions over the period, with openings initially dominant but ultimately surpassed by closures by 2018.`

关键句型：`reversed their relative positions` — 比单纯说 "surpassed" 更有分析感，直接拉高分数。

---


### Overall 段公式

`Overall, [整体方向A] while/whereas [对比方向B]. By [终点年], [最显著的结果].`

共用表达：[衔接词](data-static.md#cohesion) · [占比、数值与数据名词](data-static.md#data--comparison-language)

---

## Trend Language

### 多组数值与峰值

**救命词 `respectively`**：
> `Leisure and housing soared from 9% and 10% to 22% and 19%, respectively.`

**描述多组数据的峰值与变化：**
- `recorded the two highest figures` — 记录了最高的两个数值（绝对数量，不用 proportion）
  > `The lowest two brackets recorded the two highest figures of 28m and 30m in 2011.`
- `recorded peaks of X and Y in [year]` — 在某年分别达到峰值（配合 respectively）
  > `...recorded peaks of 28m and 30m in 2011, before dropping to 28m and 29m by 2015, respectively.`

注意：`peaks of X` 引入数值；`peaked at X` 描述单一峰值 — 两者均正确，场景不同。

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

#### 环比变化率：线下降不等于价格下降

当纵轴表示 `percentage change compared with the previous month` 时，线条显示的是**变化率**而不是实际价格：

- 变化率从 `6%` 降到 `1%`：价格仍较上月上涨，只是 `the rate of increase slowed`；不能直接写 `the price fell`。
- 变化率为 `0%`：价格与上月相同。
- 变化率为 `-3%`：价格较上月下降 3%，可写 `the price fell by 3% compared with the previous month`。

因此，描述线本身时优先用 `the rate of change fell to...`；只有数值跌破零后，才能据此说当月实际价格下降。

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

### 变化幅度与“增长率”不要混用

图表只给出人数或数值时，通常比较的是**绝对变化幅度**，不要自行写成 `rate`：

- ✗ `Table tennis soared at the highest rate.`
- ✓ `Table tennis recorded the strongest growth.`
- ✓ `Table-tennis participation saw the largest increase.`

排名始终领先时用 `remained the most popular` 或 `consistently recorded the highest figure`。`overtook` 只用于原本落后、后来反超的交叉走势。

### Ownership：电器拥有率与家务时间

| 错误 | 修正 | 原因 |
|---|---|---|
| `the distribution of households with electrical appliances` | `the percentages of households that owned three electrical appliances` | 图表显示的是拥有率/百分比，不是笼统 distribution |
| `the figure of refrigerator` | `refrigerator ownership` / `the proportion of households with refrigerators` | 单个电器趋势可用 ownership，避免 `figure of + 名词` |
| `began with zero` | `stood at zero` / `no households had...` | 描述起始数值更自然 |
| `the portion of vacuum cleaner` | `vacuum cleaner ownership` | `portion of` 不适合直接接电器名 |

### Languages：跨年份语言能力占比

类别标签要区分国家和语言，并让“变化”的主语指向比例而不是人群本身：

- ✗ `the Germany-only group` → ✓ `students speaking German` / `the German-only category`
- ✗ `students speaking Spanish rose to 35%` → ✓ `the proportion of students speaking Spanish rose to 35%`
- ✗ `the percentage of no-other-language group` → ✓ `the percentage of students speaking no other language`
- 并列类别用 `each accounted for X%`，不要写 `occupied both X%`。

### Absolute numbers：店铺开关等

| 错误 | 修正 | 原因 |
|---|---|---|
| `allocation for new shops` | `number of shop openings` | 店铺开关数量是绝对数量，不是预算分配 |
| `the closing number` | `the number of closures` | 名词修饰顺序不自然 |
| `peaked at the highest position` | `peaked at about 7,100` | `peak at` 后直接接数值 |

### 就业数量：单位、排名与历史区间

- ✗ `6 millions` → ✓ `6 million jobs`：具体数字后 `million` 不加 s；泛指才用 `millions of jobs`。
- ✗ `Agriculture remained the lowest number since 1980.` → ✓ `Agriculture had the fewest jobs from 1980 onwards.`：行业不是数字；比较岗位数用 `had the fewest jobs`，封闭的历史区间用过去时。
- ✗ `during the former two decades` → ✓ `over the first two decades`：表示全时期最初的二十年用 `first`。
- ✗ `remained unchanged in 2000` → ✓ `remained unchanged from 1980 to 2000` / `remained unchanged until 2000`：描述平台期须明确区间或承接前文起点。
- `Employment peaked at 20 million in 1980, up from 15 million in 1960.`：`up from` 可在报告峰值后补充较早的起点。
- `Healthcare caught up with retail at approximately 16 million jobs.`：`caught up with` 表示由落后到追平；不同于表示反超的 `overtook`。
