import hashlib
import secrets

def generate_salt(length: int = 16) -> str:
    """Generates a random hex salt."""
    return secrets.token_hex(length)

def hash_commitment(answer: str, salt: str, miner_hotkey: str) -> str:
    """
    Creates a SHA256 commitment hash.
    Format: SHA256(answer + salt + miner_hotkey)
    """
    data = f"{answer}{salt}{miner_hotkey}".encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def verify_commitment(commitment: str, answer: str, salt: str, miner_hotkey: str) -> bool:
    """Verifies that the answer and salt match the commitment."""
    expected_hash = hash_commitment(answer, salt, miner_hotkey)
    return secrets.compare_digest(expected_hash, commitment)
