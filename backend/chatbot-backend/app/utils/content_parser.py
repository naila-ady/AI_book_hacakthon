import os

def parse_markdown_file(file_path: str) -> str:
    """
    Reads a markdown file and returns its content.
    """
    if not os.path.exists(file_path):
        return ""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return content

def chunk_content(content: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Splits content into chunks with a specified size and overlap.
    A more sophisticated implementation would handle markdown structure.
    """
    chunks = []
    if not content:
        return chunks

    words = content.split()
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
        if i < 0: # Handle cases where chunk_size < overlap, or overlap is too large
            i = 0 # Ensure we always move forward

    return chunks