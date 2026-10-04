import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from dotenv import load_dotenv

# Configure logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("trialready-backend")

# Load environment variables
load_dotenv()
# Also attempt to load from backend directory if present
backend_env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)

app = FastAPI(
    title="TrialReady LK API",
    version="1.0.0"
)

# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://trial-ready-lk-pi.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


class MessageItem(BaseModel):
    sender: str = Field(..., description="'user' | 'ai' | 'model'")
    text: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    messages: List[MessageItem] = Field(default_factory=list, description="Conversation history")
    language: Optional[str] = Field(default="en", description="Preferred language code ('en', 'si', 'ta')")
    user_name: Optional[str] = Field(default=None, description="Optional name of the user")
    role: Optional[str] = Field(default=None, description="Optional role of the user (e.g., student, instructor)")


class ChatResponse(BaseModel):
    text: str
    status: str = "success"
    suggestions: Optional[List[str]] = None


SYSTEM_INSTRUCTION = """You are the TrialReady AI Assistant (powered by Google Gemini), a versatile, friendly, and knowledgeable general-purpose AI copilot for students and learners.

You have full capabilities to answer questions across ANY domain or topic:
1. Mathematics & Science (calculations, step-by-step problem solving, algebra, calculus, physics, chemistry, etc.)
2. Programming & Computer Science (Python, JavaScript, TypeScript, React, SQL, algorithms, debugging, web development, cybersecurity, etc.)
3. Academic, University & Coursework inquiries (essays, summaries, explanations, concept breakdowns, study schedules, English grammar, writing improvements, etc.)
4. General Knowledge, history, geography, everyday questions, analogies, creative writing, and practical life advice.
5. TrialReady-LK & Sri Lanka Driving Education (when requested):
   - Sri Lanka Highway Code: speed limits, road signs (regulatory, warning, informative), traffic lights, right of way, roundabout rules.
   - DMT Practical Trial Maneuvers: Hill Start clutch balance, Reverse S-bend, Parallel Parking, 3-point turn, pre-drive checks.
   - Student Portal: Sessions calendar, payments & fee structure, Learner Journey, Readiness Score, NTMI Medical & DMT learner permit validity.

Guidelines:
- If the user asks in English, respond in clear, well-structured English.
- If the user asks in Sinhala (සිංහල), respond fluently and naturally in Sinhala.
- If the user asks in Tamil (தமிழ்), respond fluently and naturally in Tamil.
- Format responses cleanly with markdown: use bold text, bullet points, numbered steps, or code blocks where appropriate.
- Maintain multi-turn conversation context when the student asks follow-up questions.
- Be encouraging, concise, accurate, and supportive.
"""

GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest"
]


@app.get("/")
def root():
    return {"message": "TrialReady LK API is running"}


@app.get("/health")
def health_check():
    gemini_configured = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "gemini_configured": gemini_configured
    }


@app.post("/api/chat", response_model=ChatResponse)
@app.post("/api/copilot/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        logger.error("GEMINI_API_KEY environment variable is not configured.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key is not configured on the server."
        )

    # Filter empty messages
    valid_messages = [m for m in req.messages if m.text and m.text.strip()]
    if not valid_messages:
        return ChatResponse(
            text="Please provide a valid question or message.",
            status="empty_query",
            suggestions=["Solve a math equation", "Write a Python script", "Explain Highway Code rules", "Help me summarize a text"]
        )

    # Build Gemini multi-turn contents
    contents = []
    for msg in valid_messages:
        role = "user" if msg.sender in ["user", "human", "student"] else "model"
        text = msg.text.strip()
        
        # Merge consecutive turns with the same role to conform to Gemini multi-turn requirements
        if contents and contents[-1]["role"] == role:
            contents[-1]["parts"][0]["text"] += "\n\n" + text
        else:
            contents.append({
                "role": role,
                "parts": [{"text": text}]
            })

    # Gemini requires the first content to have role 'user'
    while contents and contents[0]["role"] != "user":
        contents.pop(0)

    if not contents:
        return ChatResponse(
            text="Please ask a question. I am here to help you with any topic!",
            status="empty_query"
        )

    # Limit to the last 16 turns to keep context fast and relevant
    if len(contents) > 16:
        contents = contents[-16:]
        if contents[0]["role"] != "user":
            contents.pop(0)

    # Prepare system instruction with user context if provided
    personalized_system = SYSTEM_INSTRUCTION
    if req.user_name:
        personalized_system += f"\nThe current user's name is {req.user_name}."
    if req.role:
        personalized_system += f" Their role is {req.role}."
    if req.language == "si":
        personalized_system += "\nPlease prefer responding in Sinhala (සිංහල) unless the user asks in English."
    elif req.language == "ta":
        personalized_system += "\nPlease prefer responding in Tamil (தமிழ்) unless the user asks in English."

    payload = {
        "system_instruction": {
            "parts": [{"text": personalized_system}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048
        }
    }

    last_error_msg = ""
    # Try models in order
    async with httpx.AsyncClient(timeout=35.0) as client:
        for model in GEMINI_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_api_key}"
            try:
                logger.info(f"Dispatching query to Gemini model: {model}")
                response = await client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
                        parts = candidates[0]["content"]["parts"]
                        reply_text = "".join([p.get("text", "") for p in parts if "text" in p])
                        if reply_text.strip():
                            # Return successful response
                            return ChatResponse(
                                text=reply_text.strip(),
                                status="success"
                            )
                else:
                    logger.warning(f"Gemini model {model} returned HTTP {response.status_code}: {response.text[:200]}")
                    last_error_msg = f"HTTP {response.status_code}"
            except httpx.TimeoutException:
                logger.warning(f"Timeout calling Gemini model {model}")
                last_error_msg = "Request timed out"
            except Exception as ex:
                logger.warning(f"Error calling Gemini model {model}: {str(ex)}")
                last_error_msg = str(ex)

    # Graceful fallback error response
    logger.error(f"Failed to generate Gemini response: {last_error_msg}")
    fallback_message = (
        "I apologize, but I am having trouble connecting to the Gemini service right now. "
        "Please check your internet connection and try asking your question again in a moment."
    )
    if req.language == "si":
        fallback_message = "සමාවෙන්න, මේ මොහොතේ Gemini සේවාව හා සම්බන්ධ වීමේ තාක්ෂණික ගැටලුවක් පවතී. කරුණාකර මොහොතකින් නැවත උත්සාහ කරන්න."
    elif req.language == "ta":
        fallback_message = "மன்னிக்கவும், தற்போது Gemini சேவையுடன் இணைப்பதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."

    return ChatResponse(
        text=fallback_message,
        status="error"
    )