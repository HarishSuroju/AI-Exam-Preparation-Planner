import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

# You can set your model here (e.g., "gpt-3.5-turbo" or "gpt-4")
LLM_MODEL = os.getenv("OPENAI_MODEL", "gpt-5")

def get_study_tip(topic, performance):
    """
    Generate a personalized study tip for a topic and performance level using OpenAI LLM.
    performance: int (1=weak, 5=strong)
    """
    perf_label = "weak" if performance <= 2 else "average" if performance == 3 else "strong"
    prompt = (
        f"Give a concise, actionable study tip for a student who is {perf_label} in the topic: {topic}. "
        "Focus on practical advice, not generic encouragement."
    )
    response = openai.ChatCompletion.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=60,
        temperature=0.7,
    )
    return response.choices[0].message["content"].strip()
