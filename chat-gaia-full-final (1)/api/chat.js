import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';

config();
const router = express.Router();
router.use(cors());
router.use(express.json());

router.post('/', async (req, res) => {
  const { messages } = req.body;
  try {
    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = completion.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ reply: 'An error occurred while processing your request.' });
  }
});

export default router;
