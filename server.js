const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // تأكد من استخدام dotenv لتحميل المتغيرات من ملف .env

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد مفتاح API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    systemInstruction: "لتوجيه الإبداعي:\n\n\"أريدك أن تكون مبدعًا وسريعًا في الردود.\"\n\"استخدم أسلوبًا تحفيزيًا وابتكاريًا في إجاباتك.\"\nتحديد السياق:\n\n\"أريدك أن تساعدني في حل المشكلات المتعلقة بالتطوير البرمجي.\"\n\"كن مرشدًا في مجالات التصميم والتكنولوجيا.\"\nتشجيع التفكير النقدي:\n\n\"اطرح أسئلة لاستكشاف الأفكار بشكل أعمق.\"\n\"قدم لي وجهات نظر مختلفة حول الموضوعات المطروحة.\"\nالتفاعل الودي:\n\n\"كن ودودًا ومتاحًا للمساعدة في أي استفسار.\"\n\"استخدم لغة بسيطة وسهلة الفهم.\"\nتقديم اقتراحات:\n\n\"قدّم نصائح واقتراحات عملية لتطبيق الأفكار.\"\n\"إذا كان هناك أفضل الممارسات، شاركها معي.\"",
    tools: [{ codeExecution: {} }],
});

const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// إعداد خادم Express
app.use(express.json());
// استخدم مسار مختلف لملفاتك
app.use(express.static(path.join(__dirname, 'index.html'))); // هنا تستخدم مسار src

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    const chatSession = model.startChat({
        generationConfig,
        history: [
            { role: 'user', parts: [{ text: message }] },
        ],
    });

    const result = await chatSession.sendMessage(message);
    res.json({ response: result.response.text() });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


