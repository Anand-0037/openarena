# OpenArena: The Proof of Intelligence Subnet

**Team**: OpenArena (Anand)
**Track**: Bittensor Ideathon
**Live Demo**: [https://openarena.kaggleingest.com](https://openarena.kaggleingest.com)
**GitHub**: [https://github.com/Anand-0037/openarena](https://github.com/Anand-0037/openarena)

## Abstract

OpenArena solves the "Static Benchmark Crisis" in AI evaluation. By generating high-entropy, novel tasks every epoch and using a Commit-Reveal scheme to prevent gaming, we create a "Proof of Intelligence" that rewards generalization, not memorization.

## Core Deliverables

### 1. [Whitepaper](OpenArena_Whitepaper.md)

The comprehensive technical and economic architecture of the subnet.

- **Key Innovation**: "Generalization Efficiency" Score.
- **Security**: Commit-Reveal & Yuma Consensus.
- **Economics**: The "Alpha Demand Loop" for enterprise audits.

### 2. [Pitch Deck](OpenArena_PitchDeck.md)

A 10-slide visual overview of the $10B market opportunity and our go-to-market strategy via KaggleIngest.

### 3. [Video Script](OpenArena_VideoScript.md)

The narrative script for our submission video, demonstrating the "Live Leaderboard" and "Miner War Room."

### 4. [Incentive Mechanism](Incentive_Mechanism.md)

The rigorous mathematical definition of our scoring function: $S = \text{Accuracy} \times \text{Calibration} - \text{Latency}$.

## Proof of Implementation (Simulation)

We have successfully simulated the subnet lifecycle, including adversarial scenarios.

- **Source Code**: Full Python implementation of Miners, Validators, and Protocol (available in this repository).
- **Simulation Results**: `demo.py` demonstrates:
  - **Honest Miners**: Converge to high weights through consistent accuracy and calibration.
  - **Front-Runners**: Slashed to zero due to the Commit-Reveal barrier (proven via simulation logs).
  - **Lazy Miners**: Penalized for low accuracy and high Brier scores.

## Go-To-Market

We leverage the existing **KaggleIngest** platform as a frontend visualization layer, creating an immediate, usable product for the Bittensor ecosystem.
