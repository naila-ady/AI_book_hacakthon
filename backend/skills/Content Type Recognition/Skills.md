# Content Type Recognition Skill

## Purpose
The Content Type Recognition skill is designed to automatically identify the type of content uploaded by the user, with a primary focus on PDF documents. This allows for seamless integration with specialized processing skills, such as the `pdf-skill`, to provide an enhanced user experience and streamline workflows.

## Workflow
When a user uploads a PDF file, the system will automatically detect the content type as PDF and trigger the `pdf-skill` for further processing.

### Trigger Mechanism
Upon file upload, a content type recognition module analyzes the file's characteristics (e.g., MIME type, file extension, internal signatures). If the content is identified as a PDF, the `pdf-skill` is automatically activated.

### Example CLI Activation Log
```bash
<command-message>Content Type Recognition: Detecting content type...</command-message>
<command-message>Content Type Recognition: PDF detected. Activating pdf-skill...</command-message>
<command-message>The "pdf" skill is loading</command-message>
```

## Extraction Steps (for PDF content)
Once the `pdf-skill` is activated, it performs a series of structured extraction steps to gather comprehensive information from the uploaded PDF document:

### 1. Metadata Extraction
- **Purpose:** To retrieve intrinsic information about the PDF document.
- **Details:** Extracts data such as author, creation date, modification date, number of pages, and document title.

### 2. Title Extraction
- **Purpose:** To identify the primary title of the document.
- **Details:** Attempts to extract the most relevant title from the document's metadata or by analyzing prominent text elements on the first few pages.

### 3. Text Content Extraction
- **Purpose:** To extract all readable text from the PDF.
- **Details:** Converts each page's content into plain text, preserving the order and structure as much as possible. This text is then available for further analysis, search, or summarization.

### 4. Page Count
- **Purpose:** To determine the total number of pages in the PDF.
- **Details:** Provides an accurate count of all pages within the document, essential for pagination and progress tracking.

### 5. Summaries Generation
- **Purpose:** To provide concise overviews of the document's content.
- **Details:** Generates various summaries, including:
    - **Overall Summary:** A high-level overview of the entire document.
    - **Sectional Summaries:** Summaries for individual chapters or major sections.
    - **Key Points:** Bulleted lists of the most critical information or findings.

## CLI Activation Examples

### User Uploads a PDF
When a user uploads a file, the CLI will display logs similar to the following upon successful content type recognition and skill activation:

```bash
User: /upload my_document.pdf
<command-message>Content Type Recognition: Detecting content type for my_document.pdf...</command-message>
<command-message>Content Type Recognition: PDF detected. Activating pdf-skill...</command-message>
<command-message>The "pdf" skill is loading</command-message>
<command-message>pdf-skill: Processing my_document.pdf...</command-message>
# Output from pdf-skill (e.g., metadata, summary, etc.)
```

### Direct Skill Invocation (for context)
While typically auto-triggered, the underlying skill can also be explicitly invoked for testing or specific scenarios:

```bash
User: /skill pdf --file my_document.pdf
<command-message>The "pdf" skill is loading</command-message>
<command-message>pdf-skill: Processing my_document.pdf...</command-message>
# Output from pdf-skill
```