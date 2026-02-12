import bittensor as bt
from typing import Optional, List, Literal
import pydantic

class GeneralizationTask(bt.Synapse):
    """
    The GeneralizationTask Synapse.

    Validators send this to Miners with a 'query' and a 'phase'.
    Miners respond based on the phase:
    - 'commit': Return 'commitment' (hash).
    - 'reveal': Return 'answer' and 'salt'.
    """

    # The Challenge
    query: str = pydantic.Field(
        ...,
        title="Query",
        description="The task to be solved."
    )

    phase: Literal["commit", "reveal"] = pydantic.Field(
        "commit",
        title="Phase",
        description="The phase of the protocol: 'commit' or 'reveal'."
    )

    # The Commit Phase
    commitment: Optional[str] = pydantic.Field(
        None,
        title="Commitment",
        description="SHA256(answer + salt + miner_hotkey). Sent in 'commit' phase."
    )

    # The Reveal Phase
    answer: Optional[str] = pydantic.Field(
        None,
        title="Answer",
        description="The actual solution. Sent in 'reveal' phase."
    )

    salt: Optional[str] = pydantic.Field(
        None,
        title="Salt",
        description="A random salt string. Sent in 'reveal' phase."
    )

    required_hash_fields: List[str] = pydantic.Field(
        ["query", "phase"],
        title="Required Hash Fields",
        description="Fields required to compute the hash of this Synapse."
    )
