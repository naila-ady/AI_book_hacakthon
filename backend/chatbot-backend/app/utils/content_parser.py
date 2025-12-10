
import os
import typing as t
from markdown_it import MarkdownIt
from markdown_it.tree import SyntaxTreeNode
from mdit_py_plugins.front_matter import front_matter_plugin
import yaml

# A Chunk is a dictionary holding the content and its associated heading.
Chunk = t.TypedDict('Chunk', {'content': str, 'heading': str})

def parse_markdown_to_structured_chunks(
    file_path: str,
    encoding: str = "utf-8",
    min_chunk_size: int = 50,
) -> t.Tuple[t.Dict[str, t.Any], t.List[Chunk]]:
    """
    Parses a markdown file, extracts front matter, and splits the content
    into structured chunks based on headings.

    Each chunk includes the heading and the content under it.

    Args:
        file_path: Path to the markdown file.
        encoding: File encoding.
        min_chunk_size: Minimum number of characters for a chunk to be included.

    Returns:
        A tuple containing the front matter metadata (as a dict) and a list of chunks.
    """
    if not os.path.exists(file_path):
        return {}, []

    with open(file_path, "r", encoding=encoding) as f:
        content = f.read()

    # Setup markdown parser with front matter support
    md = MarkdownIt().use(front_matter_plugin)
    tokens = md.parse(content)
    
    metadata = {}
    if tokens and tokens[0].type == 'front_matter':
        try:
            metadata = yaml.safe_load(tokens[0].content)
        except yaml.YAMLError:
            metadata = {} # Keep metadata empty if front matter is malformed

    # Group tokens by section under each heading
    chunks: t.List[Chunk] = []
    current_heading = ""
    current_content = ""

    for token in tokens:
        if token.type == 'heading_open':
            # When a new heading is found, save the previous chunk if it's substantial
            if current_content.strip():
                if len(current_content) >= min_chunk_size:
                    chunks.append({'content': current_content.strip(), 'heading': current_heading})
                current_content = "" # Reset content for the new section
            
            # Set the new heading
            heading_text = tokens[tokens.index(token) + 1].content.strip()
            current_heading = heading_text
        
        elif token.type not in ['heading_open', 'heading_close', 'front_matter']:
            # Append all other content
            current_content += token.content if token.content else ''

    # Add the last chunk after the loop
    if current_content.strip():
         if len(current_content) >= min_chunk_size:
            chunks.append({'content': current_content.strip(), 'heading': current_heading})

    return metadata, chunks

def old_chunk_content(content: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
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