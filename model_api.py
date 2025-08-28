from fastapi import FastAPI
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI()

# Load the model at startup
print("Loading model... (this may take a few minutes)")
model_name = "google/flan-t5-large"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
print("Model loaded successfully")

@app.post("/generate")
async def generate_response():
    # Hardcoded incident details
    title = "High CPU Utilization on Database Cluster"
    status = "triggered"
    urgency = "high"
    description = "Multiple database nodes are experiencing CPU usage above 90%, slowing queries and causing high latency."

    # Construct prompt with few-shot example
    prompt = f"""
You are a senior IT operations engineer. Analyze the following production incident. 
DO NOT repeat the title. Provide **detailed outputs** in three sections:

Root Causes:
- List the likely technical reasons causing this incident.

Step-by-Step Recommendations:
- Provide actionable steps to resolve the incident.

Preventive Measures:
- Provide steps to avoid recurrence in the future.

Now analyze:
Incident Details:
- Title: {title}
- Status: {status}
- Urgency: {urgency}
- Description: {description}
"""

    # Tokenize input
    inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True)

    # Generate structured output
    outputs = model.generate(
        **inputs,
        max_length=1000,          # allow full multi-section output
        num_beams=5,
        repetition_penalty=3.0,
        no_repeat_ngram_size=3,
        early_stopping=True
    )

    # Decode output
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": response_text}
