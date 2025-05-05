<template>
  <div class="chat-app">
    <!-- Left sidebar with contacts -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Conversations</h2>
      </div>
      <div class="contact-list">
        <div v-if="isAdmin">
          <div
              v-for="user in users"
              :key="user.id"
              class="contact-item"
              :class="{ 'active': selectedRecipient && selectedRecipient.id === user.id }"
              @click="selectRecipient(user.id, user.firstName, user.lastName)">
            <div class="avatar">{{ getInitials(user.firstName, user.lastName) }}</div>
            <div class="contact-info">
              <div class="contact-name">
                {{ user.firstName }} {{ user.lastName }}
                <span v-if="unreadCounts[user.id]" class="unread-badge">{{ unreadCounts[user.id] }}</span>
              </div>
              <div class="contact-preview">Click to start chatting</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div
              v-for="admin in admins"
              :key="admin.id"
              class="contact-item"
              :class="{ 'active': selectedRecipient && selectedRecipient.id === admin.id }"
              @click="selectRecipient(admin.id, admin.firstName, admin.lastName)">
            <div class="avatar">{{ getInitials(admin.firstName, admin.lastName) }}</div>
            <div class="contact-info">
              <div class="contact-name">
                {{ admin.firstName }} {{ admin.lastName }}
                <span v-if="unreadCounts[admin.id]" class="unread-badge">{{ unreadCounts[admin.id] }}</span>
              </div>
              <div class="contact-preview">Click to start chatting</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right chat area -->
    <div class="chat-area">
      <div v-if="!selectedRecipient" class="no-chat-selected">
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <h3>Select a contact to start chatting</h3>
        </div>
      </div>
      <div v-else class="chat-container">
        <div class="chat-header">
          <button class="back-button" @click="goBackToContacts">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="avatar">{{ selectedRecipientInitials }}</div>
          <div class="chat-contact-info">
            <div class="chat-contact-name">{{ selectedRecipientName }}</div>
          </div>
        </div>
        <div class="messages-container" ref="messagesContainer">
          <div v-for="(message, index) in messages"
               :key="index"
               :class="['message', message.senderEmail === userEmail ? 'sent' : 'received']">
            <div class="message-content">
              <div v-if="message.content" class="text-content">{{ message.content }}</div>
<!--              <div v-if="message.accessUrl" class="file-content">-->
<!--                <a v-if="message.accessUrl" :href="message.accessUrl" target="_blank">-->
<!--                  <img :src="message.accessUrl" alt="Uploaded Image" />-->
<!--                </a>-->
<!--                <a v-else :href="message.accessUrl"-->
<!--                   target="_blank" class="file-download">-->
<!--                  <span class="file-icon">📎</span>-->
<!--                  Download File-->
<!--                </a>-->
<!--              </div>-->
              <div v-if="message.accessUrl" class="file-content">
                <div v-if="isImageFile(message)">
                  <!-- Image Preview -->
                  <a :href="message.accessUrl" target="_blank">
                    <img :src="message.accessUrl" alt="Uploaded Image" />
                  </a>
                </div>
                <div v-else class="file-info">
                  <!-- File Icon and Name -->
                  <i :class="getFileIcon(message.fileType)" class="file-icon"></i>
                  <span class="file-name">{{ message.originalFilename }}</span>
                  <a :href="message.accessUrl" target="_blank" class="file-download">Download</a>
                </div>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp || new Date()) }}</div>
            </div>
          </div>
        </div>
        <div v-if="uploadedFilePreview" class="file-preview">
          <div class="file-preview-content">
            <div v-if="isImageFile(uploadedFilePreview)" class="image-preview">
              <img :src="uploadedFilePreview.accessUrl" alt="Uploaded File Preview" />
            </div>
            <div v-else class="file-info">
              <i class="file-icon" :class="getFileIcon(uploadedFilePreview.fileType)"></i>
              <span class="file-name">{{ uploadedFilePreview.originalFilename }}</span>
            </div>
            <button class="remove-file" @click="clearFilePreview">Remove</button>
          </div>
        </div>
        <div class="input-area">
          <label for="fileInput" class="attach-button">
            <i class="fas fa-paperclip"></i>
          </label>
          <input type="file" id="fileInput" @change="handleFileUpload" hidden />
          <input
              v-model="newMessage"
              class="message-input"
              placeholder="Type a message..."
              @keyup.enter="handleSendMessage" />
          <button class="send-button" @click="handleSendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { connectToChat, sendMessage } from '../services/chatService.js';
import axios from 'axios';

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      stompClient: null,
      selectedRecipient: null,
      selectedRecipientName: '',
      selectedRecipientInitials: '',
      admins: [],
      users: [],
      selectedFile: null,
      fileType: null,
      fileData: null,
      accessUrl : null,
      uploadedFilePreview : null,
      unreadCounts: {},
      latestMessageTime: {},
      unreadMessageIds: {}
    };
  },
  computed: {
    ...mapState(['token', 'user']),
    userEmail() {
      return this.user?.email || '';
    },
    isAdmin() {
      return this.user?.role === 'ADMIN';
    }
  },
  async created() {
    if (!this.token) {
      alert('You must be logged in to access the chat.');
      this.$router.push('/login');
      return;
    }

    // Fetch admins or users based on the user's role
    if (this.isAdmin) {
      this.users = await this.fetchUsers();
    } else {
      this.admins = await this.fetchAdmins();
    }

    await this.fetchUnreadMessages();

    this.sortContacts();

    this.stompClient = connectToChat(this.token, (message) => {


      if (this.selectedRecipient && this.selectedRecipient.id) {
        // Check if the current user is the sender or recipient of this message
        const isCurrentUserSender = message.senderEmail === this.user.email;
        const isCurrentUserRecipient = message.recipientEmail === this.user.email;

        // Check if message belongs to current conversation
        const isMessageForCurrentConversation =
            (isCurrentUserSender && message.recipientId === this.selectedRecipient.id) ||
            (isCurrentUserRecipient && message.senderId === this.selectedRecipient.id);



        if (isMessageForCurrentConversation) {
          this.messages.push(message);
          this.$nextTick(() => this.scrollToBottom());
        } else {


          // If we're receiving a message from someone else, update unread count
          if (isCurrentUserRecipient && !isMessageForCurrentConversation) {
            const senderId = message.senderId;

            // Update unread count for this sender
            if (!this.unreadCounts[senderId]) {
              this.unreadCounts[senderId] = 0;
            }
            this.unreadCounts[senderId]++;

            // Track this message ID as unread
            if (!this.unreadMessageIds[senderId]) {
              this.unreadMessageIds[senderId] = [];
            }
            this.unreadMessageIds[senderId].push(message.id);

            // Update latest message time for sorting
            const timestamp = new Date(message.timestamp).getTime();
            this.latestMessageTime[senderId] = timestamp;

            // Re-sort contacts to show most recent first
            this.sortContacts();
          }
        }
      } else {
        // No conversation is selected but we received a message
        if (message.recipientEmail === this.user.email) {
          const senderId = message.senderId;

          // Update unread count for this sender
          if (!this.unreadCounts[senderId]) {
            this.unreadCounts[senderId] = 0;
          }
          this.unreadCounts[senderId]++;

          // Track this message ID as unread
          if (!this.unreadMessageIds[senderId]) {
            this.unreadMessageIds[senderId] = [];
          }
          this.unreadMessageIds[senderId].push(message.id);

          // Update latest message time for sorting
          const timestamp = new Date(message.timestamp).getTime();
          this.latestMessageTime[senderId] = timestamp;

          // Re-sort contacts to show most recent first
          this.sortContacts();
        }
      }
    });
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    async fetchAdmins() {
      try {
        const response = await axios.get('https://mamanmakuetchehelene.site/api/admins', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching admins:', error.response?.data || error.message);
        return [];
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('https://mamanmakuetchehelene.site/api/users', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        return [];
      }
    },
    // Add to methods section
    goBackToContacts() {
      this.selectedRecipient = null;
      this.selectedRecipientName = '';
      this.selectedRecipientInitials = '';
      this.updateMobileViewClass();
    },

    updateMobileViewClass() {
      const chatApp = document.querySelector('.chat-app');
      if (this.selectedRecipient) {
        chatApp.classList.remove('no-recipient');
        chatApp.classList.add('has-recipient');
      } else {
        chatApp.classList.add('no-recipient');
        chatApp.classList.remove('has-recipient');
      }
    },
      isImageFile(message) {
        return message.fileType && message.fileType.startsWith('image/');
      },

    getFileIcon(fileType) {
      if (!fileType) return 'fas fa-file'; // Default icon

      if (fileType.startsWith('application/pdf')) {
        return 'far fa-file-pdf'; // PDF icon
      } else if (fileType.startsWith('application/msword') || fileType.includes('document')) {
        return 'far fa-file-word'; // Word document icon
      } else if (fileType.startsWith('video/')) {
        return 'far fa-file-video'; // Video icon
      } else if (fileType.startsWith('audio/')) {
        return 'far fa-file-audio'; // Audio icon
      } else if (fileType.startsWith('image/')) {
        return 'far fa-file-image'; // Image icon
      } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
        return 'far fa-file-excel'; // Excel icon
      } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
        return 'far fa-file-powerpoint'; // PowerPoint icon
      } else if (fileType.includes('zip') || fileType.includes('compressed')) {
        return 'far fa-file-archive'; // Archive icon
      } else if (fileType.includes('text/')) {
        return 'far fa-file-alt'; // Text file icon
      } else {
        return 'fas fa-file'; // Generic file icon
      }
    },

    clearFilePreview() {
      this.uploadedFilePreview = null;
      this.selectedFile = null;
      this.fileType = null;
      this.accessUrl = null;
      document.getElementById('fileInput').value = ''; // Clear the file input
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.fileType = file.type;

        // Upload the file via HTTP
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('https://mamanmakuetchehelene.site/api/chat/upload', formData, {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          // Store the file metadata
           this.uploadedFilePreview = response.data;
          this.accessUrl = response.data.accessUrl; // Store the access URL
        } catch (error) {
          console.error('Error uploading file:', error.response?.data || error.message);
        }
      }
    },
    handleSendMessage() {
      if ((!this.newMessage.trim() && !this.accessUrl) || !this.selectedRecipient) {
        return;
      }

      const message = {
        id: this.selectedRecipient.id,
        content: this.newMessage,
        fileType: this.fileType,
        accessUrl: this.accessUrl, // Include the file access URL
      };

      sendMessage(this.stompClient, message);

      // Add the sent message to the UI
      this.messages.push({
        senderEmail: this.userEmail,
        recipientEmail: this.selectedRecipient.email,
        content: this.newMessage,
        fileType: this.fileType,
        accessUrl: this.accessUrl, // Include the file access URL
        timestamp: new Date().toISOString(),
      });

      // Clear the input fields
      this.newMessage = '';
      this.selectedFile = null;
      this.fileType = null;
      this.accessUrl = null;
      this.clearFilePreview();
      document.getElementById('fileInput').value = '';
      this.$nextTick(() => this.scrollToBottom());
    },
    async fetchUnreadMessages() {
      try {
        const response = await axios.post('https://mamanmakuetchehelene.site/api/message/unread',
            { email: this.user.email },
            { headers: { Authorization: `Bearer ${this.token}` } }
        );

        const unreadMessages = response.data;
        this.unreadCounts = {};
        this.latestMessageTime = {};
        this.unreadMessageIds = {}; // Reset unread message IDs

        unreadMessages.forEach(message => {
          const senderId = message.senderId;

          // Track message IDs by sender
          if (!this.unreadMessageIds[senderId]) {
            this.unreadMessageIds[senderId] = [];
          }
          this.unreadMessageIds[senderId].push(message.id);

          // Count unread messages per sender
          if (!this.unreadCounts[senderId]) {
            this.unreadCounts[senderId] = 0;
          }
          this.unreadCounts[senderId]++;

          // Track latest message timestamp
          const timestamp = new Date(message.timestamp).getTime();
          if (!this.latestMessageTime[senderId] || timestamp > this.latestMessageTime[senderId]) {
            this.latestMessageTime[senderId] = timestamp;
          }
        });

      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    },

    sortContacts() {
      // Sort function for both users and admins
      const sortBySender = (contacts) => {
        return [...contacts].sort((a, b) => {
          const timeA = this.latestMessageTime[a.id] || 0;
          const timeB = this.latestMessageTime[b.id] || 0;
          return timeB - timeA; // Sort by most recent first
        });
      };

      // Apply sorting to the appropriate list
      if (this.isAdmin) {
        this.users = sortBySender(this.users);
      } else {
        this.admins = sortBySender(this.admins);
      }
    },
    async selectRecipient(recipientId, firstName, lastName) {


      this.selectedRecipient = { id: recipientId };
      this.selectedRecipientName = `${firstName} ${lastName}`;
      this.selectedRecipientInitials = this.getInitials(firstName, lastName);

      this.messages = [];
      await this.fetchConversationHistory(recipientId, this.user.email);
      await this.markMessagesAsRead(recipientId);

      this.updateMobileViewClass();
    },
    async markMessagesAsRead(senderId) {
      // Check if there are unread messages from this sender
      const messageIds = this.unreadMessageIds[senderId] || [];

      if (messageIds.length > 0) {
        try {
          const response = await axios.post(
              'https://mamanmakuetchehelene.site/api/message/mark-read',
              { ids: messageIds },
              { headers: { Authorization: `Bearer ${this.token}` } }
          );



          // Clear unread messages for this sender
          this.unreadMessageIds[senderId] = [];
          this.unreadCounts[senderId] = 0;
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    },
    async fetchConversationHistory(recipientId, senderEmail) {
      try {
        const response = await axios.post('https://mamanmakuetchehelene.site/api/message',
            {
              recipientId: recipientId,
              senderEmail: senderEmail,
            },
            {
              headers: { Authorization: `Bearer ${this.token}` }
            }
        );

        // Update messages array with conversation history
        this.messages = response.data;

        // Format timestamps
        this.messages.forEach(msg => {
          if (!msg.timestamp) {
            msg.timestamp = new Date().toISOString();
          }
        });

        // Ensure we scroll to bottom after messages load and after rendering
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToBottom();
          }, 100); // Short timeout to ensure DOM is fully updated
        });
      } catch (error) {
        console.error('Error fetching conversation history:', error.response?.data || error.message);
      }
    },
    getInitials(firstName, lastName) {
      return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
    },
    formatTime(date) {
      if (!date) return '';
      const dateObj = new Date(date);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      }
    }
  },
  mounted() {
    this.updateMobileViewClass();
    // window.addEventListener('resize', this.updateMobileViewClass);
  },
  beforeUnmount() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  },
};
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 90vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #FFFFFF;
}

/* Sidebar styles */
.sidebar {
  width: 300px;
  background-color: #FFFFFF;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  background-color: #3A86FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: rgba(58, 134, 255, 0.05);
}

.contact-item.active {
  background-color: rgba(58, 134, 255, 0.1);
  border-left: 3px solid #3A86FF;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFD166;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-weight: 500;
  color: #111b21;
}

.contact-preview {
  font-size: 13px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chat area styles */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2L40 4v2L42 4h2l-4 4v2l2-2v2l-2 2V8l4-4h2l-4 4v2l4-4h4l-4 4v2l-2-2v4l4-4h2l-4 4v2l2-2v2l-4 4h4l-2-2v2l-2 2h2L40 40v2l4-4h2l-4 4v2l4-4h4l-4 4v2l-2-2v4l4-4h2l-4 4v2l4-4h4l-4 4v2l-2-2v4l4-4h2l-4 4v2l2-2v2l-2 2v-2l-2 2v-4l-4 4h-2l4-4v-2l-4 4h-4l4-4v-2l2 2v-4l-4 4h-2l4-4v-2l-4 4h-4l4-4v-2l2 2v-4l-4 4h-2l4-4v-2l-4 4h-4l4-4v-2l2 2v-4l-4 4h-2l4-4v-2l-2 2v-2l2-2h-2l4-4h2l-4 4v2l4-4h2l-4 4v2l2-2v2l-2 2h4l-4 4v2l4-4h2l-4 4v2l4-4h4l-4 4v2l-2-2v4l4-4h2l-4 4v2l2-2v2l-2 2h2l-4 4h-2l4-4v-2l-4 4h-2l4-4v-2l-2 2v-2l2-2h-4l4-4v-2l-4 4h-2l4-4v-2l-4 4h-4l4-4v-2l2 2v-4l-4 4h-2l4-4v-2l-2 2v-2l2-2h-2l4-4h2l-4 4v2l4-4h2l-4 4v2l2-2v2l-2 2h4l-4 4v2l4-4h2l-4 4v2l4-4h4l-4 4v2l-2-2v4l4-4h2l-4 4v2l2-2v2l-2 2h2l-4 4h-2l4-4v-2l-4 4h-2l4-4v-2l-2 2v-2l2-2h-4l4-4v-2l-4 4h-2l4-4v-2l-4 4h-4l4-4v-2l2 2v-4l-4 4h-2l4-4v-2l-2 2v-2l2-2z'/%3E%3C/g%3E%3C/svg%3E");
  max-height: 90vh;
  overflow: hidden;
}

.back-button {
  display: none;
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  margin-right: 8px;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  text-align: center;
  color: #54656f;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #3A86FF;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
}

.chat-header {
  padding: 12px 16px;
  background-color: #3A86FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
}

.chat-contact-info {
  margin-left: 12px;
}

.unread-badge {
  background-color: #FFD166;
  color: #333;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 8px;
}

.contact-item:has(.unread-badge) {
  font-weight: bold;
  background-color: rgba(255, 209, 102, 0.2);
}

.chat-contact-name {
  font-weight: 500;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.message {
  max-width: 65%;
  margin-bottom: 12px;
  position: relative;
  align-self: flex-start;
}

.message.sent {
  align-self: flex-end;
}

.message-content {
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.sent .message-content {
  background-color: #3A86FF;
  color: #FFFFFF;
}

.message.received .message-content {
  background-color: #FFFFFF;
  color: #111b21;
  border-left: 3px solid #FFD166;
}

.text-content {
  word-break: break-word;
}

.file-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  max-width: 300px;
}

.file-content img {
  max-width: 250px;
  max-height: 200px;
  border-radius: 4px;
  border: 2px solid #FFD166;
}

.file-download {
  display: flex;
  align-items: center;
  color: #3A86FF;
  text-decoration: none;
  font-weight: 500;
}

.file-download:hover {
  text-decoration: underline;
}

.file-icon {
  font-size: 20px;
  color: #3A86FF;
  margin-right: 8px;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
  margin-top: 2px;
}

.message.received .message-time {
  color: #8696a0;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #FFFFFF;
  border-top: 1px solid #e1e4e8;
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.attach-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: #3A86FF;
  transition: background-color 0.2s;
}

.attach-button:hover {
  background-color: rgba(58, 134, 255, 0.1);
}

.message-input {
  flex: 1;
  border: 1px solid #e1e4e8;
  background-color: white;
  border-radius: 21px;
  padding: 9px 12px;
  margin: 0 10px;
  outline: none;
}

.message-input:focus {
  border-color: #3A86FF;
}

.send-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: #3A86FF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #2a76ef;
}

.file-preview {
  padding: 10px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #e1e4e8;
  border-left: 3px solid #FFD166;
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-preview img {
  max-width: 100px;
  max-height: 80px;
  border-radius: 4px;
  border: 2px solid #FFD166;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-name {
  font-size: 14px;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-file {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-file:hover {
  background-color: #cc0000;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-app {
    flex-direction: column;
    position: relative;
    height: calc(100vh - 60px);
  }

  .sidebar {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    transition: transform 0.3s ease;
  }

  .chat-area {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .back-button {
    display: block;
  }

  /* Show contacts, hide chat when no recipient selected */
  .chat-app.no-recipient .sidebar {
    transform: translateX(0);
  }

  .chat-app.no-recipient .chat-area {
    visibility: hidden;
  }

  /* Hide contacts, show chat when recipient selected */
  .chat-app.has-recipient .sidebar {
    transform: translateX(-100%);
  }

  .chat-app.has-recipient .chat-area {
    visibility: visible;
  }

  .message {
    max-width: 80%;
  }

  .file-content img {
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 85%;
  }

  .file-content img {
    max-width: 150px;
  }

  .file-name {
    max-width: 120px;
  }

  .contact-item {
    padding: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
</style>