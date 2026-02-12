import bittensor as bt
import time
import hashlib
from openarena.protocol import GeneralizationTask
from openarena.utils.crypto import verify_commitment

class Validator:
    def __init__(self, config=None):
        self.config = config or self.get_config()
        self.wallet = bt.wallet(config=self.config)
        self.subtensor = bt.subtensor(config=self.config)
        self.dendrite = bt.dendrite(wallet=self.wallet)
        self.metagraph = self.subtensor.metagraph(netuid=self.config.netuid)

        bt.logging.info(f"Validator initialized with wallet: {self.wallet}")

    def get_config(self):
        parser = bt.ArgumentParser()
        parser.add_argument('--netuid', type=int, default=1, help='The chain subnet uid.')
        bt.dendrite.add_args(parser)
        bt.subtensor.add_args(parser)
        bt.wallet.add_args(parser)
        return bt.config(parser)

    def run(self):
        bt.logging.info("Starting validator loop...")

        while True:
            try:
                # 1. Generate Task (Entropy Protocol)
                # VRF: Hash(BlockHeight + ValidatorKey + PrevBlockHash)
                block_height = self.subtensor.get_current_block()
                vrf_key = str(self.wallet.hotkey.ss58_address)
                # Fetch actual previous block hash for on-chain entropy
                prev_block_hash = self.subtensor.get_block_hash(block_height - 1)

                # Formal Entropy Seed Derivation
                entropy_seed = hashlib.sha256(f"{block_height}{vrf_key}{prev_block_hash}".encode()).hexdigest()

                bt.logging.info(f"Generated Entropy Seed: {entropy_seed}")
                bt.logging.info(f"Derivation: SHA256({block_height} + {vrf_key[:8]}... + {prev_block_hash[:8]}...)")

                # In production, this seed drives the Task Generator.
                # For this stub, we use a simple string reversal, but the seed is ready.
                query = f"Task_{step}_{entropy_seed[:8]}: Reverse this string"
                bt.logging.info(f"\n--- Step {step}: {query} ---")

                # Filter miners (mock: select top 10 or random)
                # For this stub, we just query all available axons in the metagraph
                # But to avoid timeout on large nets, let's pick 2 for testing or assume local execution.
                # If running locally with miner, we need to know miner's IP/Port.
                # Standard pattern: Query metagraph.axons
                miner_axons = self.metagraph.axons
                if not miner_axons:
                    bt.logging.warning("No miners found in metagraph. Waiting...")
                    time.sleep(10)
                    continue

                # 2. Commit Phase
                bt.logging.info("Phase 1: COMMIT")
                responses_commit = self.dendrite.query(
                    miner_axons,
                    GeneralizationTask(query=query, phase="commit"),
                    deserialize=True,
                    timeout=5
                )

                # Store commitments
                # Key: miner_hotkey, Value: commitment_hash
                commitments = {}
                for axon, synapse in zip(miner_axons, responses_commit):
                    if synapse.commitment:
                        bt.logging.info(f"Miner {axon.hotkey} committed: {synapse.commitment}")
                        commitments[axon.hotkey] = synapse.commitment
                    else:
                        bt.logging.warning(f"Miner {axon.hotkey} failed to commit.")

                # 3. Wait (Reveal Window)
                bt.logging.info("Waiting for reveal window (simulated 2s)...")
                time.sleep(2)

                # 4. Reveal Phase
                bt.logging.info("Phase 2: REVEAL")
                responses_reveal = self.dendrite.query(
                    miner_axons,
                    GeneralizationTask(query=query, phase="reveal"),
                    deserialize=True,
                    timeout=5
                )

                # 5. Verify and Score
                scores = []
                for axon, synapse in zip(miner_axons, responses_reveal):
                    hotkey = axon.hotkey
                    if hotkey not in commitments:
                        bt.logging.info(f"Miner {hotkey} ignored (no commitment).")
                        continue

                    commitment = commitments[hotkey]
                    answer = synapse.answer
                    salt = synapse.salt

                    if not answer or not salt:
                        bt.logging.info(f"Miner {hotkey} failed to reveal.")
                        continue

                    # Verify Commitment
                    is_valid = verify_commitment(commitment, answer, salt, hotkey)
                    if is_valid:
                        bt.logging.success(f"Miner {hotkey} VERIFIED! Answer: {answer}")
                        # Score: Check if answer is correct (reverse string)
                        # Mock Logic:
                        expected = query[::-1]
                        if answer == expected:
                            bt.logging.success(f"Miner {hotkey} CORRECT!")
                        else:
                            bt.logging.info(f"Miner {hotkey} WRONG Answer.")
                    else:
                        bt.logging.error(f"Miner {hotkey} CHEATING attempt! Hash mismatch.")

                time.sleep(12) # Wait for roughly one block time

            except KeyboardInterrupt:
                break
            except Exception as e:
                bt.logging.error(f"Error in validator loop: {e}")
                time.sleep(5)

if __name__ == "__main__":
    validator = Validator()
    validator.run()
