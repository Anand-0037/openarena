import hashlib
import random
import secrets

def hash_commitment(answer: str, salt: str, miner_hotkey: str) -> str:
    data = f"{answer}{salt}{miner_hotkey}".encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def test_full_protocol_lifecycle():
    # Setup
    miner_hotkey = "5F3sa2TJAUVfwsj5hbPxr3rV8g9pJjS6XjT99...MockKey"
    query = "Solve this math problem: 123 + 45"
    expected_answer = "168"

    # Miner Side: Commit Phase
    actual_answer = "168"
    salt = secrets.token_hex(16)
    commitment = hash_commitment(actual_answer, salt, miner_hotkey)

    print(f"Commitment: {commitment}")

    # Validator Side: Verify Commitment
    # Miner reveals (actual_answer, salt)
    revealed_answer = actual_answer
    revealed_salt = salt

    recomputed_hash = hash_commitment(revealed_answer, revealed_salt, miner_hotkey)
    assert recomputed_hash == commitment, "Commitment hash mismatch!"

    # Scoring
    if revealed_answer == expected_answer:
        score = 1.0
    else:
        score = 0.0

    assert score == 1.0, f"Expected score 1.0 but got {score}"
    print("Protocol lifecycle test PASSED!")

if __name__ == "__main__":
    test_full_protocol_lifecycle()
