import time
import json
import random
import hashlib
from typing import List, Dict

# Mock Protocol
class Synapse:
    def __init__(self, query: str):
        self.query = query
        self.answer = None
        self.salt = None
        self.commitment = None
        self.miner_id = None
        self.score = 0.0

# Mock Validator
class Validator:
    def __init__(self, uid, name):
        self.uid = uid
        self.name = name

    def generate_task(self) -> str:
        ops = ['+', '-', '*']
        a, b = random.randint(10, 99), random.randint(1, 9)
        op = random.choice(ops)
        return f"{a} {op} {b}"

    def solve_ground_truth(self, task: str) -> str:
        return str(eval(task))

    def evaluate(self, task: str, synapse: Synapse) -> float:
        # Check Commitment
        expected_hash = hashlib.sha256(f"{synapse.answer}{synapse.salt}{synapse.miner_id}".encode()).hexdigest()
        if synapse.commitment != expected_hash:
             # Malformed/Fake commit
            return 0.0

        ground_truth = self.solve_ground_truth(task)
        if synapse.answer == ground_truth:
            return 1.0
        return 0.0

# Mock Miner (Base Class)
class MockMiner:
    def __init__(self, uid: int, name: str):
        self.uid = uid
        self.name = name
        self.mempool = [] # Simulating visibility of others' commits

    def commit(self, task: str) -> tuple:
        # Default honest behavior
        answer = str(eval(task))
        salt = str(random.randint(1000, 9999))
        commitment = hashlib.sha256(f"{answer}{salt}{self.uid}".encode()).hexdigest()
        return commitment, answer, salt

    def reveal(self, task: str, answer: str, salt: str) -> dict:
        return {"answer": answer, "salt": salt}

# Malicious Miner: The Front-Runner (Copycat)
class FrontRunnerMiner(MockMiner):
    def commit(self, task: str) -> tuple:
        # Tries to copy, but can't see the salt/answer until Reveal phase.
        # This simulates the failure of front-running in Commit-Reveal.
        # He submits a random hash hoping to get lucky or replay an old one.
        fake_ans = "0"
        salt = "0000"
        commitment = hashlib.sha256(f"{fake_ans}{salt}{self.uid}".encode()).hexdigest()
        return commitment, fake_ans, salt

# Simulation Loop
def run_simulation(epochs=15):
    validator = Validator(0, "Validator_Main")

    miners = [
        MockMiner(0, "Miner_Alphazero (Honest)"),
        MockMiner(1, "Miner_GPT4 (Honest)"),
        FrontRunnerMiner(2, "Miner_Copycat (Malicious)"),
        MockMiner(3, "Miner_Lazy (Random)"),
    ]

    leaderboard_data = []

    # Weight Tracking
    miner_weights = {m.uid: 0.5 for m in miners} # Start equal

    print(f"--- Starting Adversarial Simulation ({epochs} Epochs) ---")

    for epoch in range(epochs):
        task = validator.generate_task()
        print(f"\n[Epoch {epoch+1}] New Task: {task}")

        # Phase 1: Commit
        commits = {}
        secrets = {}
        for miner in miners:
            com, ans, salt = miner.commit(task)
            commits[miner.uid] = com
            secrets[miner.uid] = (ans, salt)

            # Simulate Copycat trying to peek (but only seeing hashes)
            if isinstance(miner, FrontRunnerMiner):
                 print(f"  > {miner.name} is scanning mempool... only sees hashes.")

        # Phase 2: Reveal
        epoch_scores = {}
        for miner in miners:
            synapse = Synapse(task)
            synapse.miner_id = miner.uid
            synapse.commitment = commits[miner.uid]

            # Miner reveals
            revealed = miner.reveal(task, *secrets[miner.uid])
            synapse.answer = revealed['answer']
            synapse.salt = revealed['salt']

            # Validator scores
            score = validator.evaluate(task, synapse)

            # Additional logic for "Lazy" miner
            if miner.name == "Miner_Lazy (Random)":
                synapse.answer = str(random.randint(0,100))
                score = validator.evaluate(task, synapse) # Re-evaluate with wrong answer

            epoch_scores[miner.uid] = score

            # Update Moving Average Weights (Yuma-lite)
            alpha = 0.2
            miner_weights[miner.uid] = (1 - alpha) * miner_weights[miner.uid] + (alpha * score)

            status = "Verified" if score > 0 else "Failed/Slashed"
            print(f"  > {miner.name}: {status} (Score: {score:.2f})")

            leaderboard_data.append({
                "epoch": epoch,
                "miner": miner.name,
                "score": miner_weights[miner.uid], # Plotting Weight Convergence
                "latency": random.uniform(0.1, 0.5)
            })

    # Export
    with open("leaderboard_data.json", "w") as f:
        json.dump(leaderboard_data, f, indent=2)

    print("\n--- Simulation Complete. Weights Converged. ---")

if __name__ == "__main__":
    run_simulation()
