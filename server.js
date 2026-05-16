import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lưu trữ cuộc hội thoại
const conversations = new Map();

// Mock AI Knowledge Base
const mockResponses = {
  arduino: [
    "Arduino là một nền tảng điện tử mã nguồn mở dựa trên phần cứng và phần mềm đơn giản. Nó được thiết kế để dễ sử dụng và giá cả phải chăng, phù hợp cho những người mới bắt đầu lập trình nhúng. 🎯",
    "Arduino có nhiều loại như Arduino Uno, Arduino Mega, Arduino Nano. Mỗi loại có đặc điểm riêng phù hợp với các dự án khác nhau.",
    "Arduino sử dụng ngôn ngữ lập trình C/C++ đơn giản hóa. Bạn có thể lập trình trực tiếp thông qua Arduino IDE.",
  ],
  micropython: [
    "MicroPython là một phiên bản Python được tối ưu hóa cho các thiết bị nhúng và microcontroller. Nó chiếm ít bộ nhớ nhưng vẫn giữ lại hầu hết các tính năng của Python. 🐍",
    "MicroPython chạy rất nhanh và hiệu quả trên các bo mạch vi điều khiển như ESP32, STM32. Nó giúp lập trình trở nên dễ dàng hơn.",
    "Để lập trình MicroPython, bạn cần cài đặt firmware MicroPython lên bo mạch, sau đó có thể viết code trong Python.",
  ],
  sensors: [
    "Cảm biến là các thiết bị dùng để phát hiện và đo lường các đại lượng vật lý như nhiệt độ, ánh sáng, khoảng cách, v.v. 📊",
    "Có nhiều loại cảm biến: cảm biến nhiệt độ (DHT22), cảm biến siêu âm (HC-SR04), cảm biến ánh sáng (LDR), cảm biến chuyển động (PIR), v.v.",
    "Cảm biến thường cần được kết nối với bo mạch Arduino/ESP32 thông qua các chân analog hoặc digital.",
  ],
  programming: [
    "Lập trình nhúng liên quan đến việc viết code cho các thiết bị nhỏ như microcontroller. Nó đòi hỏi hiểu biết về phần cứng và tối ưu hóa tài nguyên. 💻",
    "Trong lập trình nhúng, bạn cần chú ý đến bộ nhớ, tốc độ xử lý và tiêu thụ điện. Mỗi byte và mỗi chu kỳ đều quan trọng.",
    "Các ngôn ngữ phổ biến cho lập trình nhúng: C, C++, Assembly, MicroPython.",
  ],
  projects: [
    "Một số dự án Arduino phổ biến: hệ thống đo nhiệt độ độ ẩm, robot tránh vật cản, nhà thông minh, trạm thời tiết, v.v. 🚀",
    "Bạn có thể kết hợp nhiều cảm biến và cơ cấu để tạo ra những dự án thú vị và hữu ích.",
    "Bắt đầu với các dự án nhỏ, sau đó dần nâng cao độ phức tạp là cách tốt nhất để học lập trình nhúng.",
  ],
  troubleshooting: [
    "Nếu code không tải được lên bo mạch, kiểm tra: kết nối USB, chọn board và port đúng trong Arduino IDE. ⚠️",
    "Nếu cảm biến không phản hồi, kiểm tra kết nối dây, điện áp cung cấp, và code đọc dữ liệu.",
    "Nếu bo mạch không phản ứng, thử reset board hoặc tải lại bootloader.",
  ],
};

// Function để tìm response phù hợp
function findMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  // Kiểm tra từ khóa
  if (msg.includes('arduino') || msg.includes('board') || msg.includes('uno')) {
    return mockResponses.arduino[Math.floor(Math.random() * mockResponses.arduino.length)];
  }
  if (msg.includes('micropython') || msg.includes('python')) {
    return mockResponses.micropython[Math.floor(Math.random() * mockResponses.micropython.length)];
  }
  if (msg.includes('sensor') || msg.includes('cảm biến') || msg.includes('nhiệt độ') || msg.includes('siêu âm')) {
    return mockResponses.sensors[Math.floor(Math.random() * mockResponses.sensors.length)];
  }
  if (msg.includes('lập trình') || msg.includes('code') || msg.includes('programming') || msg.includes('viết code')) {
    return mockResponses.programming[Math.floor(Math.random() * mockResponses.programming.length)];
  }
  if (msg.includes('dự án') || msg.includes('project') || msg.includes('project')) {
    return mockResponses.projects[Math.floor(Math.random() * mockResponses.projects.length)];
  }
  if (msg.includes('lỗi') || msg.includes('error') || msg.includes('không hoạt động') || msg.includes('sửa')) {
    return mockResponses.troubleshooting[Math.floor(Math.random() * mockResponses.troubleshooting.length)];
  }
  
  // Response mặc định
  const defaultResponses = [
    "Đó là một câu hỏi hay! 🤔 Bạn có thể cho tôi biết thêm chi tiết về những gì bạn muốn tìm hiểu không? Tôi sẵn sàng giúp bạn về Arduino, MicroPython, cảm biến, lập trình nhúng, và các dự án liên quan.",
    "Tôi rất vui được giúp bạn! 😊 Hãy hỏi tôi về bất kỳ chủ đề nào liên quan đến hệ thống nhúng, Arduino, lập trình, hoặc các dự án điện tử.",
    "Câu hỏi hay! Tôi có thể giúp bạn về những chủ đề sau: Arduino, cảm biến điện tử, lập trình MicroPython, thiết kế mạch điện, hoặc các dự án thực tế. Bạn muốn tìm hiểu gì?",
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Route: POST /api/chat - Gửi tin nhắn cho AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Tạo ID cuộc hội thoại nếu chưa có
    const convId = conversationId || `conv-${Date.now()}`;
    
    // Lấy lịch sử cuộc hội thoại
    let history = conversations.get(convId) || [];

    // Thêm tin nhắn của user vào lịch sử
    history.push({
      role: 'user',
      content: message,
    });

    // Mock AI response (không cần OpenAI API)
    const aiMessage = findMockResponse(message);

    // Simulate response delay (như thực tế)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 200));

    // Thêm response của AI vào lịch sử
    history.push({
      role: 'assistant',
      content: aiMessage,
    });

    // Lưu lịch sử (giới hạn 20 tin nhắn gần đây)
    if (history.length > 20) {
      history = history.slice(-20);
    }
    conversations.set(convId, history);

    res.json({
      message: aiMessage,
      conversationId: convId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn',
    });
  }
});

// Route: GET /api/health - Kiểm tra server
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Embedded Playground AI Backend (Mock Mode) is running',
    mode: 'mock',
    timestamp: new Date(),
  });
});

// Route: DELETE /api/chat/:conversationId - Xóa cuộc hội thoại
app.delete('/api/chat/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  if (conversations.has(conversationId)) {
    conversations.delete(conversationId);
    res.json({ success: true, message: 'Conversation deleted' });
  } else {
    res.status(404).json({ error: 'Conversation not found' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Embedded Playground AI Backend running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Mode: MOCK AI (Demo Mode - Không cần OpenAI API)`);
});
