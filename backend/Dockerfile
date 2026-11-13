FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    TESSDATA_PREFIX=/usr/share/tesseract-ocr/5/tessdata/

WORKDIR /app

# Install system dependencies: Tesseract with Malayalam and English language packs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    tesseract-ocr \
    tesseract-ocr-mal \
    tesseract-ocr-eng \
    libmupdf-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (compatible with Hugging Face Spaces)
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown -R appuser:appuser /app

COPY --chown=appuser:appuser requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
