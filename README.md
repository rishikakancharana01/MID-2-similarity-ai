# Similarity AI — Intelligent Document Analysis
> **Academic Project:** Semantic Document Search & Grounded Question Answering  
> **Architecture:** Bi-Encoder Dense Retrieval (`all-MiniLM-L6-v2`) + scikit-learn Cosine Similarity + FastAPI + React & Tailwind CSS.

---

## 📌 Project Overview

**Similarity AI** is a production-grade web application built to solve semantic information retrieval across documents. Unlike traditional lexical search (like `Ctrl+F` or BM25) which only finds exact character matches, Similarity AI maps questions and document excerpts into a shared 384-dimensional dense vector space using **Sentence Transformers**. It computes true mathematical **cosine similarity**, ranks matching passages in strict descending order, and produces evidence-grounded answers with verifiable citations.

### Key Capabilities
- **Multi-Format Ingestion**: Supports `.pdf` (preserving page numbers via PyMuPDF), `.docx` (Microsoft Word paragraphs and tables), and `.txt` (UTF-8/CP1252 auto-detection).
- **Overlapping Semantic Chunking**: Prevents context loss across paragraph boundaries with sliding-window chunking.
- **Real Vector Similarity**: Uses `all-MiniLM-L6-v2` and `sklearn.metrics.pairwise.cosine_similarity`. Zero fake or hardcoded scores.
- **Evidence-Grounded Answers**: Extracts direct findings from top passages without hallucinating outside facts. Explicitly alerts the user when evidence is insufficient.
- **Modern User Interface**: Responsive React 18 dashboard built with Vite, TypeScript, Tailwind CSS, Lucide icons, and React Router.
- **Session-Based Analysis History**: Preserves recent queries and results in browser session cache without persisting sensitive document data.

---

## 🗂️ Project Structure

```text
MID-2 SIMILARITY UI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application & endpoints
│   │   ├── schemas.py              # Pydantic data schemas
│   │   ├── document_parser.py      # PDF, DOCX, TXT parsers & chunker
│   │   ├── similarity_engine.py    # SentenceTransformers & cosine similarity
│   │   └── answer_generator.py     # Deterministic evidence synthesizer
│   ├── sample_documents/
│   │   ├── sample_ai_research.txt  # Ready-to-test academic abstract
│   │   └── sample_renewable_energy.txt # Ready-to-test report
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_backend.py         # Automated pytest test cases
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── ProcessingIndicator.tsx
│   │   │   ├── AnswerCard.tsx
│   │   │   ├── PassageCard.tsx
│   │   │   └── PipelineDiagram.tsx
│   │   ├── pages/                  # Application views
│   │   │   ├── LandingPage.tsx     # Homepage with visual hero & features
│   │   │   ├── DashboardPage.tsx   # Two-column upload & query interface
│   │   │   ├── ResultsPage.tsx     # Ranked passages & grounded answer
│   │   │   ├── HistoryPage.tsx     # Session history with clear modal
│   │   │   └── HowItWorksPage.tsx  # Interactive educational pipeline
│   │   ├── context/
│   │   │   └── AnalysisContext.tsx # Central state & history manager
│   │   ├── services/
│   │   │   └── api.ts              # FastAPI HTTP client
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── App.tsx                 # React Router setup
│   │   ├── main.tsx                # React entrypoint
│   │   └── index.css               # Tailwind CSS setup
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide (Windows PowerShell)

Follow these exact steps in Windows PowerShell to install dependencies and run both servers.

### Prerequisites
1. **Python 3.10+** (verify with `python --version`)
2. **Node.js 18+** & npm (verify with `node -v` and `npm -v`)

---

### Step 1: Start the Python FastAPI Backend

Open a new PowerShell terminal and run:

```powershell
# 1. Navigate to the project root directory
cd "c:\Users\HP\OneDrive\Desktop\MID-2 SIMILARITY UI"

# 2. Create a virtual environment (recommended)
python -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 4. Install backend dependencies
pip install -r backend\requirements.txt

# 5. Start the FastAPI backend server
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Verification:** Open your browser and visit [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health). You should see `{"status":"healthy","model_name":"all-MiniLM-L6-v2",...}`.

---

### Step 2: Start the React Frontend

Open a **second PowerShell terminal** and run:

```powershell
# 1. Navigate to the frontend directory
cd "c:\Users\HP\OneDrive\Desktop\MID-2 SIMILARITY UI\frontend"

# 2. Install frontend packages
npm install

# 3. Start the Vite development server
npm run dev
```

> **Access Application:** Open your browser and navigate to:  
> 👉 **`http://localhost:5173`**

---

## 🧪 Running Automated Tests

To run the backend test suite verifying text chunking, document parsers, cosine similarity logic, and answer synthesis:

```powershell
# Inside activated venv in the project root:
cd "c:\Users\HP\OneDrive\Desktop\MID-2 SIMILARITY UI"
python -m pytest backend/tests/test_backend.py -v
```

Expected output:
```text
test_backend.py::test_clean_text PASSED
test_backend.py::test_chunk_text_short PASSED
test_backend.py::test_chunk_text_overlap PASSED
test_backend.py::test_extract_document_txt PASSED
test_backend.py::test_extract_document_empty_fails PASSED
test_backend.py::test_extract_unsupported_format_fails PASSED
test_backend.py::test_answer_generator_empty_passages PASSED
test_backend.py::test_answer_generator_with_passages PASSED
8 passed in 0.45s
```

---

## 🎓 Faculty Demonstration Script

To present this project to an instructor, examiner, or faculty panel:

1. **Landing Page Tour (`/`)**:
   - Showcase the modern SaaS layout and the CSS visual mockup illustrating vector retrieval.
   - Explain the 6 key capabilities and navigate to the **How It Works** educational pipeline.

2. **Educational Pipeline Explanation (`/how-it-works`)**:
   - Explain the difference between **lexical search** and **dense vector embeddings**.
   - Review the mathematical formula for **Cosine Similarity**:  
     $$\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
   - Clarify the crucial academic distinction: **similarity scores measure semantic relatedness, not factual certainty**.

3. **Live Document Analysis (`/dashboard`)**:
   - Select one of the provided test documents:  
     `backend/sample_documents/sample_ai_research.txt`
   - Click one of the sample prompt pills:  
     `"What are the primary objectives of this research?"`
   - Click **Analyze Document** and watch the real-time stage progression indicator:
     - Extraction $\rightarrow$ Chunking $\rightarrow$ Embedding $\rightarrow$ Cosine Similarity $\rightarrow$ Grounded Synthesis.

4. **Results Inspection (`/results`)**:
   - Point out the **Generated Answer Card** with page/passage citation tags.
   - Point out the **Ranked Relevant Passages** sorted by real cosine percentages (e.g. $88.4\%$).
   - Demonstrate the **Expand/Collapse** and **Copy Passage** controls.

5. **Session History (`/history`)**:
   - Navigate to the History page to view previous runs in the current session.
   - Click **View Results** to reopen an earlier result instantly.
   - Demonstrate the **Clear History** confirmation modal.

6. **Edge Case & Guardrail Validation**:
   - Test submitting an empty query (blocked on both frontend and backend).
   - Test uploading an unsupported file format (e.g., `.exe` or `.png`) to verify strict rejection.
   - Ask an irrelevant question (e.g., *"How do I bake a chocolate cake?"*) to demonstrate the **Insufficient Evidence** detection.

---

## 🔒 Security & Privacy Practices
- **No Hardcoded Secrets**: Credentials use environment variables (`.env`).
- **Input Sanitization**: File sizes capped at 15 MB, MIME types verified, and character limits enforced.
- **Non-Persistent Processing**: Uploaded documents are processed in-memory and cleaned up immediately.
- **Client Session Privacy**: History resides in `sessionStorage` and does not leak document bodies across external servers.

