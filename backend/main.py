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


SYSTEM_INSTRUCTION = """You are the official TrialReady AI Assistant (powered by Google Gemini), an AI copilot dedicated EXCLUSIVELY to Sri Lanka driving licence education, Highway Code rules, DMT practical trial tests, and the TrialReady student portal.

ALLOWED TOPICS:
1. Sri Lanka Highway Code & Traffic Regulations (speed limits, lane discipline, roundabouts, right-of-way, priority rules, expressway rules, warning, regulatory, and informative road signs).
2. DMT Practical Driving Trial Maneuvers (Hill Start clutch biting point & handbrake control, Reverse S-Bend test reference points, Parallel Parking, 3-Point Turn, pre-drive checks, cabin drills).
3. Driving Theory Examination Preparation (mock theory questions, road safety principles, first aid, mechanical basics).
4. Student Academy Portal & Training (TrialReady readiness score, learner journey milestones, NTMI medical, DMT learner permit validity, sessions calendar, payments & receipts).
5. Warm greetings (e.g., 'hi', 'hello', 'ayubowan', 'vanakkam') — always respond warmly and introduce yourself as the TrialReady driving tutor.

STRICT OUT-OF-SCOPE BOUNDARY:
You MUST NOT answer questions about mathematics, programming/coding, algorithms, software engineering, science, university coursework, essays, general history, entertainment, politics, or any topic outside of driving education and the TrialReady platform.

If a student asks an out-of-scope question (such as math equations, coding, writing code, essays, or unrelated topics), you MUST politely and respectfully decline, stating that it is beyond your knowledge scope:
- English response: "I am the TrialReady AI Assistant, dedicated exclusively to Sri Lanka driving licence training, Highway Code regulations, practical trial maneuvers, and student portal assistance. Answering questions on this topic is beyond my knowledge scope. Please feel free to ask me anything related to road rules, driving trials, or your learner journey!"
- Sinhala response: "මම TrialReady රියදුරු පුහුණු සහායකයා වන අතර, ශ්‍රී ලංකා මාර්ග නීති, ප්‍රායෝගික රියදුරු විභාග (DMT Trials), සහ ශිෂ්‍ය ද්වාරය පිළිබඳ විමසීම් සඳහා පමණක් සහාය ලබා දෙමි. වෙනත් විෂයයන් පිළිබඳ ප්‍රශ්න මගේ විෂය පථයෙන් බැහැර වේ. රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!"
- Tamil response: "நான் TrialReady ஓட்டுநர் பயிற்சி உதவியாளர் ஆவேன். இலங்கை போக்குவரத்து விதிகள், செய்முறை ஓட்டுநர் பரீட்சை மற்றும் மாணவர் தளம் தொடர்பான விடயங்களுக்கு மட்டுமே என்னால் உதவ முடியும். ஏனைய விடயங்கள் எனது எல்லைக்கு அப்பாற்பட்டவை. ஓட்டுநர் பயிற்சி அல்லது வீதி விதிகள் தொடர்பான வினாக்களை தயவுசெய்து கேட்கவும்!"

Guidelines:
- If the user asks in English, respond in clear, well-structured English.
- If the user asks in Sinhala (සිංහල), respond fluently and naturally in Sinhala.
- If the user asks in Tamil (தமிழ்), respond fluently and naturally in Tamil.
- Format responses cleanly with markdown: use bold text, bullet points, numbered steps, or code blocks where appropriate.
- Maintain multi-turn conversation context when the student asks follow-up questions.
"""

GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite"
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
            text="Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!",
            status="empty_query",
            suggestions=[
                "What are the speed limits in Sri Lanka?",
                "How to do Hill Start without rollback?",
                "Tips for DMT Reverse S-Bend maneuver",
                "Explain mandatory vs warning road signs"
            ]
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
            text="Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!",
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