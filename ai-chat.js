// AI Chat Client - Kết nối với OpenAI Backend
class AIChat {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://localhost:3001/api/chat';
    this.conversationId = null;
    this.isLoading = false;
    this.messageHistory = [];
  }

  async sendMessage(userMessage) {
    if (!userMessage.trim() || this.isLoading) return;

    this.isLoading = true;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: this.conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Lưu conversation ID
      if (!this.conversationId) {
        this.conversationId = data.conversationId;
      }

      // Lưu vào lịch sử
      this.messageHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.message }
      );

      return data.message;
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error(`Không thể kết nối với AI. Vui lòng kiểm tra server: ${error.message}`);
    } finally {
      this.isLoading = false;
    }
  }

  clearHistory() {
    this.messageHistory = [];
    this.conversationId = null;
  }
}

// Khởi tạo AI Chat global
const aiChat = new AIChat();

// Hàm hiển thị chat widget
function initChatUI() {
  // Tạo HTML cho chat widget
  const chatHTML = `
    <div id="ai-chat-widget" class="fixed bottom-4 right-4 z-40 w-96 max-w-[calc(100%-2rem)] shadow-2xl rounded-2xl overflow-hidden glass-panel" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-primary to-primary-container p-4 text-white flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined">psychology</span>
          <h3 class="font-headline-md text-sm">Trợ Lý AI</h3>
        </div>
        <button id="chat-minimize-btn" class="text-white hover:bg-white/20 p-1 rounded-lg transition-all">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Chat Messages -->
      <div id="chat-messages" class="h-96 overflow-y-auto p-4 space-y-3" style="background: #f8f9ff;">
        <div class="flex gap-3 mb-4">
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-primary text-sm">psychology</span>
          </div>
          <div class="flex-1">
            <p class="text-xs font-bold text-primary mb-1">Trợ Lý AI</p>
            <div class="bg-white p-3 rounded-lg text-on-surface text-sm leading-relaxed border border-primary/10">
              Xin chào! 👋 Tôi là trợ lý AI của Embedded Playground. Tôi có thể giúp bạn về lập trình, linh kiện điện tử, và hệ thống nhúng. Hãy hỏi tôi bất kỳ điều gì! 🚀
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="border-t border-outline-variant/30 p-4 bg-white">
        <div class="flex gap-2">
          <input 
            id="chat-input" 
            type="text" 
            placeholder="Nhập câu hỏi..." 
            class="flex-1 px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          <button 
            id="chat-send-btn" 
            class="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1 font-bold"
          >
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
        <p id="chat-error" class="text-error text-xs mt-2 hidden"></p>
        <p id="chat-loading" class="text-on-surface-variant text-xs mt-2 hidden">Đang suy nghĩ...</p>
      </div>
    </div>

    <!-- Chat Toggle Button (khi chat bị thu nhỏ) -->
    <button id="chat-toggle-btn" class="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all active:scale-95 hidden flex items-center justify-center" style="display: none;">
      <span class="material-symbols-outlined text-2xl">psychology</span>
    </button>
  `;

  // Thêm vào body
  if (!document.getElementById('ai-chat-widget')) {
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    setupChatListeners();
  }
}

// Setup chat event listeners
function setupChatListeners() {
  const chatWidget = document.getElementById('ai-chat-widget');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessagesDiv = document.getElementById('chat-messages');
  const chatMinimizeBtn = document.getElementById('chat-minimize-btn');
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatError = document.getElementById('chat-error');
  const chatLoading = document.getElementById('chat-loading');

  // Bàn bạc ý tưởng với AI (Hero input on index.html)
  const ideaInput = document.getElementById('idea-ai-input');
  const ideaSendBtn = document.getElementById('idea-ai-send-btn');

  const forwardIdeaToChat = async () => {
    if (!ideaInput || !ideaSendBtn) return;

    const text = ideaInput.value.trim();
    if (!text) return;

    // Tự mở widget nếu đang minimze
    chatWidget.style.display = 'block';
    if (chatToggleBtn) chatToggleBtn.style.display = 'none';

    // đẩy sang input chat rồi gửi
    ideaInput.value = '';
    chatInput.value = text;

    // trigger send
    if (typeof chatSendBtn.click === 'function') {
      chatSendBtn.click();
    } else {
      // fallback
      const evt = new Event('click');
      chatSendBtn.dispatchEvent(evt);
    }

    chatInput.focus();
  };

  if (ideaSendBtn) {
    ideaSendBtn.addEventListener('click', forwardIdeaToChat);
  }
  if (ideaInput) {
    ideaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') forwardIdeaToChat();
    });
  }


  // Gửi tin nhắn
  const sendMessage = async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    // Hiển thị tin nhắn user
    const userMessageHTML = `
      <div class="flex gap-3 justify-end">
        <div class="flex-1 flex justify-end">
          <div class="bg-primary text-white p-3 rounded-lg text-sm max-w-xs">
            ${message}
          </div>
        </div>
      </div>
    `;
    chatMessagesDiv.insertAdjacentHTML('beforeend', userMessageHTML);
    chatInput.value = '';
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;

    // Gửi request
    chatLoading.classList.remove('hidden');
    chatError.classList.add('hidden');

    try {
      const aiResponse = await aiChat.sendMessage(message);
      chatLoading.classList.add('hidden');

      // Hiển thị response
      const aiMessageHTML = `
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-primary text-sm">psychology</span>
          </div>
          <div class="flex-1">
            <div class="bg-white p-3 rounded-lg text-on-surface text-sm border border-primary/10 leading-relaxed">
              ${aiResponse}
            </div>
          </div>
        </div>
      `;
      chatMessagesDiv.insertAdjacentHTML('beforeend', aiMessageHTML);
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    } catch (error) {
      chatLoading.classList.add('hidden');
      chatError.textContent = error.message;
      chatError.classList.remove('hidden');
    }
  };

  // Event listeners
  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Minimize/Maximize
  chatMinimizeBtn.addEventListener('click', () => {
    chatWidget.style.display = 'none';
    chatToggleBtn.style.display = 'flex';
  });

  chatToggleBtn.addEventListener('click', () => {
    chatWidget.style.display = 'block';
    chatToggleBtn.style.display = 'none';
    chatInput.focus();
  });

  // Focus input khi mở
  chatInput.focus();
}

// Khởi tạo chat UI khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Thêm style cho chat widget nếu cần
  if (!document.getElementById('chat-styles')) {
    const style = document.createElement('style');
    style.id = 'chat-styles';
    style.textContent = `
      /* Tối ưu hiển thị widget chat (độc lập với CSS của từng trang) */
      .glass-panel {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px) saturate(160%);
        -webkit-backdrop-filter: blur(16px) saturate(160%);
        border: 1px solid rgba(0, 96, 172, 0.12);
      }

      #ai-chat-widget {
        display: block;
      }

      #chat-messages {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 96, 172, 0.3) transparent;
      }
      #chat-messages::-webkit-scrollbar {
        width: 6px;
      }
      #chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      #chat-messages::-webkit-scrollbar-thumb {
        background: rgba(0, 96, 172, 0.3);
        border-radius: 3px;
      }
      #chat-messages::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 96, 172, 0.5);
      }

      /* Tránh trường hợp text color bị override */
      #ai-chat-widget, #chat-messages {
        color: #0b1c30;
      }
    `;
    document.head.appendChild(style);
  }
  
  initChatUI();
});
