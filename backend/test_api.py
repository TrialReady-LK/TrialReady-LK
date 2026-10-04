import unittest
from fastapi.testclient import TestClient
from main import app


class TestBackendAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("TrialReady LK API", res.json().get("message", ""))

    def test_health_endpoint(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertIn("gemini_configured", data)

    def test_chat_empty_messages(self):
        res = self.client.post("/api/chat", json={"messages": []})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "empty_query")

    def test_chat_general_query_gemini(self):
        res = self.client.post("/api/chat", json={
            "messages": [{"sender": "user", "text": "What is 15 multiplied by 4?"}],
            "language": "en"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "success")
        self.assertIn("60", data.get("text", ""))

    def test_chat_multilingual_sinhala(self):
        res = self.client.post("/api/chat", json={
            "messages": [{"sender": "user", "text": "ආයුබෝවන්, කෙටියෙන් හඳුන්වා දෙන්න"}],
            "language": "si"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "success")
        self.assertTrue(len(data.get("text", "")) > 0)


if __name__ == "__main__":
    unittest.main()
