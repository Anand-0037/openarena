import time
import typing
import bittensor as bt
from openarena.protocol import GeneralizationTask
from openarena.utils.crypto import hash_commitment, generate_salt
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

class Miner:
    def __init__(self, config=None):
        self.config = config or self.get_config()
        self.wallet = bt.wallet(config=self.config)
        self.subtensor = bt.subtensor(config=self.config)
        self.metagraph = self.subtensor.metagraph(netuid=self.config.netuid)
        self.axon = bt.axon(wallet=self.wallet, config=self.config)

        # Local storage for commit-reveal (In-memory for MVP)
        # Key: query_hash, Value: (answer, salt)
        self.commitments: typing.Dict[str, typing.Tuple[str, str]] = {}

        # Load Model (Optimized for 4-bit/8-bit if available, here standard for compatibility)
        bt.logging.info("Loading LLM model...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # Using a lightweight model for demonstration/functionality; replaceable with larger models.
        self.tokenizer = AutoTokenizer.from_pretrained("gpt2")
        self.model = AutoModelForCausalLM.from_pretrained("gpt2").to(self.device)
        self.tokenizer.pad_token = self.tokenizer.eos_token

        bt.logging.info(f"Miner initialized with wallet: {self.wallet} on device: {self.device}")

    def get_config(self):
        parser = bt.ArgumentParser()
        parser.add_argument('--netuid', type=int, default=1, help='The chain subnet uid.')
        bt.axon.add_args(parser)
        bt.subtensor.add_args(parser)
        bt.wallet.add_args(parser)
        return bt.config(parser)

    def forward(self, synapse: GeneralizationTask) -> GeneralizationTask:
        """
        The Miner's forward function.
        Handles both 'commit' and 'reveal' phases.
        """
        bt.logging.info(f"Received synapse from: {synapse.dendrite.hotkey} | Phase: {synapse.phase}")

        if synapse.phase == "commit":
            # 1. Generate Answer (Real LLM Inference)
            try:
                inputs = self.tokenizer(synapse.query, return_tensors="pt").to(self.device)
                outputs = self.model.generate(**inputs, max_new_tokens=50, pad_token_id=self.tokenizer.eos_token_id)
                answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            except Exception as e:
                bt.logging.error(f"Inference failed: {e}")
                answer = "Error during inference"

            # 2. Generate Salt
            salt = generate_salt()

            # 3. Store for later reveal
            # We use the query as the key. In production, use a more unique ID.
            self.commitments[synapse.query] = (answer, salt)

            # 4. Compute Commitment
            commitment = hash_commitment(answer, salt, self.wallet.hotkey.ss58_address)

            synapse.commitment = commitment
            bt.logging.info(f"Committed: {commitment}")

        elif synapse.phase == "reveal":
            # 1. Retrieve stored answer/salt
            if synapse.query in self.commitments:
                answer, salt = self.commitments[synapse.query]
                synapse.answer = answer
                synapse.salt = salt
                bt.logging.info(f"Revealed: {answer} (Salt: {salt})")

                # Cleanup (Optional: keep for a bit?)
                del self.commitments[synapse.query]
            else:
                bt.logging.error(f"No commitment found for query: {synapse.query}")

        return synapse

    def run(self):
        # Attach the forward function to the axon
        self.axon.attach(
            forward_fn=self.forward,
            blacklist_fn=self.blacklist,
            priority_fn=self.priority,
        )

        # Serve the axon
        bt.logging.info(f"Serving axon on port {self.config.axon.port}")
        self.axon.serve(netuid=self.config.netuid, subtensor=self.subtensor)

        # Start the axon
        bt.logging.info(f"Starting axon...")
        self.axon.start()

        # Keep the miner running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.axon.stop()
            bt.logging.info("Miner stopped.")

    def blacklist(self, synapse: GeneralizationTask) -> typing.Tuple[bool, str]:
        # Implement blacklist logic (e.g., allow specific hotkeys)
        return False, "Allowed"

    def priority(self, synapse: GeneralizationTask) -> float:
        # Implement priority logic (e.g., stake-based)
        return 0.0

if __name__ == "__main__":
    miner = Miner()
    miner.run()
