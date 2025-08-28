from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = FastAPI()

device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")
print("Using device:", device)

model_name = "google/flan-t5-large"  # smaller for testing
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)

print("Model loaded successfully")

class PromptRequest(BaseModel):
    prompt: str = ""  # optional

@app.post("/generate")
async def generate_response(request: PromptRequest):
    # hardcoded incident
    INCIDENT = {
        "title": "High CPU Utilization on Database Cluster",
        "status": "triggered",
        "urgency": "high",
        "description": "Multiple database nodes are experiencing CPU usage above 90%, slowing queries."
    }

    SECTIONS = ["Root Causes", "Step-by-Step Recommendations", "Preventive Measures"]
    results = {}

    for section in SECTIONS:
        prompt = f"""
You are a senior IT operations engineer. Provide a **numbered list** for "{section}" only.
Incident Details:
- Title: {INCIDENT['title']}
- Status: {INCIDENT['status']}
- Urgency: {INCIDENT['urgency']}
- Description: {INCIDENT['description']}
"""
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024).to(device)
        outputs = model.generate(
            **inputs,
            max_length=1000,
            num_beams=5,
            repetition_penalty=2.0,
            no_repeat_ngram_size=3,
            early_stopping=True
        )
        results[section] = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return results
