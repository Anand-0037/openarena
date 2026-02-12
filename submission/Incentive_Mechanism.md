# OpenArena: Incentive Mechanism Design

## 1. Core Philosophy: Proof of Generalization

Unlike traditional subnets that reward _weight availability_ or _loss on a fixed dataset_, OpenArena rewards **Generalization**.
We define Generalization ($G$) as the ability of a miner $i$ to minimize loss $\mathcal{L}$ on a distribution $D_t$ that is disjoint from all prior distributions $\{D_0, ..., D_{t-1}\}$.

$$ G*i(t) = \mathbb{E}*{x \sim D_t} [ S(M_i(x), y^*) ] $$

## 2. The Reward Function ($R$)

The reward for miner $i$ at epoch $t$ is calculated as an aggregate of their performance across $K$ tasks.

$$ R*i = \sigma \left( \sum*{k=1}^{K} w*k \cdot \left( \alpha \cdot \underbrace{\mathcal{A}(y*{ik}, y^\*_k)}_{\text{Accuracy}} + \beta \cdot \underbrace{\mathcal{C}(c*{ik}, y*{ik})}_{\text{Calibration}} - \gamma \cdot \underbrace{\mathcal{L}(l_{ik})}\_{\text{Latency}} \right) \right) $$

### 2.1 Component Definitions

#### Accuracy ($\mathcal{A}$)

For Generative Tasks (e.g., Summarization), we use a semantic similarity metric (BERTScore) or Levenshtein Distance ($Lev$).
$$ \mathcal{A}_{text} = 1 - \frac{Lev(y_{ik}, y^_*k)}{\max(|y*{ik}|, |y^_\_k|)} $$

For Logic/Math Tasks, we use a binary score:
$$ \mathcal{A}_{logic} = \mathbb{I}(y_{ik} == y^\*\_k) $$

#### Calibration ($\mathcal{C}$)

We incentivize miners to know their own uncertainty using the **Brier Score**.
Miners submit a confidence $c_{ik} \in [0, 1]$.
$$ \mathcal{C} = 1 - (c*{ik} - \mathcal{A}*{logic})^2 $$
_Rationale_: A miner that is 100% confident but wrong is penalized heavily. A miner that is 50% confident and wrong is penalized less.

#### Latency ($\mathcal{L}$)

Speed is critical for real-world utility. We apply an exponential decay penalty based on the time delta $\Delta t$ relative to the fastest correct submission $t_{min}$.
$$ \mathcal{L} = e^{\lambda (t*{ik} - t*{min})} - 1 $$

## 3. Consensus Mechanism (Yuma)

The final weight $W_i$ set on the Bittensor blockchain is a consensus of the normalized rewards from all validators $v \in V$.

$$ W*i = \frac{\sum*{v \in V} S*v \cdot R*{vi}}{\sum*{j \in M} \sum*{v \in V} S*v \cdot R*{vj}} $$

Where $S_v$ is the stake of validator $v$ (V-Trust).
Miners with the highest $W_i$ receive the largest emission of $TAO.

## 4. Sustainability: The Efficiency Multiplier ($\mathcal{E}$)

To ensure long-term sustainability and prevent the subnet from becoming just "who has the most H100s", we introduce an **Efficiency Multiplier**.
This favors miners who achieve high accuracy with lower latency (proxy for model efficiency) and consistent uptime.

$$ R\_{final} = R_i \times \mathcal{E}\_i $$

Where $\mathcal{E}$ boosts miners who consistently solve "Flash Challenges" (sub-200ms tasks) which are impossible for API wrappers to route in time.

## 5. Anti-Gaming & Adversarial Hardening

### 5.1 The Commit-Reveal Scheme (Anti-Front-Running)

To prevent "Copycat Mining" (listening to the mempool), we strictly enforce a two-phase process:

1. **Commit Phase**: Miner $i$ submits $H_i = \text{SHA256}(y_{ik} || \text{salt} || \text{hotkey}_i)$.
2. **Reveal Phase**: Miner $i$ submits $y_{ik}, \text{salt}$.
3. **Verification**: Validator checks $H_i' == H_i$. If mismatch, $R_i = 0$.

### 5.2 Flash Challenges (Anti-Wrapper)

Validators randomly inject "Flash Tasks" with a strict $T_{max} = 200ms$.

- **Goal**: Filter out miners who are just wrapping GPT-4/Claude via API (network latency > 200ms).
- **Penalty**: Failure to respond in time $\to$ Score penalty $\gamma$ increases.

### 5.3 High-Entropy Generation (Anti-Lookup)

Tasks are generated procedurally with random seeds, ensuring $P(Task_t \in \text{TrainingSet}) \approx 0$.

- _Math_: Random coefficients.
- _Logic_: Randomly generated rulesets.
