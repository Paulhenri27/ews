<template>
  <MenuComponent />
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1>English Without Secrets</h1>
          <p>Your personalized journey to English fluency begins here</p>
        </div>
        <div class="hero-image">
          <div class="slanted-image-container">
            <img src="@/assets/home.jpg" alt="Student learning English" />
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <h2>Welcome to English Without Secrets</h2>
      <p>We're dedicated to making English learning accessible, enjoyable, and effective for learners at all levels. Our comprehensive platform combines proven learning methods with innovative tools to help you master English with confidence.</p>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2>Explore Our Learning Sections</h2>

      <div class="features-grid">
        <div class="feature-card reading">
          <div class="icon">📚</div>
          <h3>Reading</h3>
          <p>Access a diverse collection of PDF materials and documents carefully selected to improve your reading comprehension and vocabulary.</p>
        </div>

        <div class="feature-card listening">
          <div class="icon">🎧</div>
          <h3>Listening</h3>
          <p>Enhance your listening skills with our audio resources, including dialogues, podcasts, and pronunciation exercises.</p>
        </div>

        <div class="feature-card vocabulary">
          <div class="icon">📝</div>
          <h3>Vocabulary</h3>
          <p>Build your English vocabulary through interactive exercises, word lists, and memory techniques designed for effective learning.</p>
        </div>

        <div class="feature-card chat">
          <div class="icon">💬</div>
          <h3>Chat</h3>
          <p>Connect with qualified instructors through our chat feature for personalized guidance, feedback, and conversation practice.</p>
        </div>
      </div>
    </section>

    <!-- Detailed Sections -->
    <section class="detailed-sections">
      <h2>How Our Platform Helps You Learn</h2>

      <div class="detailed-section">
        <h3>Reading Excellence</h3>
        <div class="section-content">
          <div class="section-text">
            <p>Our Reading section offers carefully curated materials for all proficiency levels. From beginner texts to advanced articles, you'll find content that challenges and engages you. Each reading comes with comprehension questions and vocabulary highlights to maximize your learning.</p>
            <p>We provide PDF documents on various topics including business English, academic writing, literature excerpts, and practical everyday communication. Our guided reading approach helps you build not only vocabulary but also cultural understanding and critical thinking skills.</p>
          </div>
          <div class="section-image reading-img"></div>
        </div>
      </div>

      <div class="detailed-section alternate">
        <h3>Listening Skills Development</h3>
        <div class="section-content">
          <div class="section-image listening-img"></div>
          <div class="section-text">
            <p>The Listening section features a wide range of audio materials with authentic English speakers from different regions. Practice with dialogues, interviews, news segments, and presentations to train your ear for various accents and speaking styles.</p>
            <p>Each audio file includes interactive exercises to test your comprehension and note-taking abilities. Our progressive difficulty system ensures you're always challenged at the right level, from basic conversations to complex discussions.</p>
          </div>
        </div>
      </div>

      <div class="detailed-section">
        <h3>Vocabulary Building</h3>
        <div class="section-content">
          <div class="section-text">
            <p>Our Vocabulary section employs proven memorization techniques and spaced repetition to help you retain new words effectively. Explore thematic word lists, idioms, phrasal verbs, and specialized terminology.</p>
            <p>Interactive exercises reinforce your learning through multiple contexts and usage examples. Track your progress and receive personalized recommendations for vocabulary expansion based on your performance and learning goals.</p>
          </div>
          <div class="section-image vocabulary-img"></div>
        </div>
      </div>

      <div class="detailed-section alternate">
        <h3>Personalized Chat Support</h3>
        <div class="section-content">
          <div class="section-image chat-img"></div>
          <div class="section-text">
            <p>Our Chat feature connects you directly with qualified English instructors who provide personalized feedback and guidance. Schedule sessions for conversation practice, pronunciation correction, or help with specific language questions.</p>
            <p>Beyond just teaching, our instructors serve as coaches who understand your learning style and goals. They'll help you identify your strengths and areas for improvement, creating a supportive environment for rapid progress.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  <FooterComponent />
</template>

<script>
import MenuComponent from '@/components/Menu.vue'
import FooterComponent from '@/components/AppFooter.vue'
import { mapActions } from 'vuex';
import { getUser } from '../services/authService.js';

export default {
  components: {
    MenuComponent,
    FooterComponent
  },
  data() {
    return {
      user: null
    };
  },
  computed: {
    tokenFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    }
  },
  async created() {
    try {
      if (this.tokenFromUrl) {
        this.setToken(this.tokenFromUrl);
      }

      // Try to get user info if token exists, but don't redirect if not authenticated
      if (this.$store.state.token) {
        try {
          this.user = await getUser(this.$store.state.token);
           await this.fetchUnreadMessages();
        } catch (error) {
          console.error('Authentication error:', error);
          // Clear invalid token but stay on home page
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error in initialization:', error);
    }
  },
  methods: {
    ...mapActions(['setToken', 'logout']),
    async fetchUnreadMessages() {
    if (!this.user || !this.user.email) return;
    
    try {
    const response = await axios.post(
      'https://mamanmakuetchehelene.site/api/message/unread',
      { email: this.user.email },
      { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
    );
    
    const unreadMessages = response.data;
    const totalUnread = unreadMessages.length;
    
    
    this.$store.commit('setUnreadMessageCount', totalUnread);
    
    } catch (error) {
    console.error('Error fetching unread messages:', error);
    }
    }
  }
};
</script>

<style scoped>
.home-container {
  color: #333;
}

/* Hero Section */
.hero-section {
  background-color: #3A86FF;
  color: white;
  padding: 40px 0;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative; /* Added for positioning */
  overflow: hidden;
}

.hero-text {
  flex: 1;
  position: relative;
  z-index: 2; /* Ensure text is above the image */
  padding-right: 40px;
}

.hero-text h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
}

.hero-text p {
  font-size: 1.2rem;
  max-width: 500px;
}

.hero-image {
  position: relative;
  flex: 1;
  height: 300px; /* Fixed height */
  overflow: hidden;
}

.slanted-image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 10% 100%);
  overflow: hidden;
}

.slanted-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* About Section */
.about-section {
  padding: 40px 0;
  text-align: center;
}

.about-section h2 {
  color: #3A86FF;
  margin-bottom: 20px;
}

.about-section p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  padding: 40px 40px;
}

.features-section h2 {
  text-align: center;
  color: #3A86FF;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.feature-card {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-top: 5px solid #FFD166;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: #3A86FF;
  margin-bottom: 15px;
}

.feature-card p {
  line-height: 1.5;
}

/* Detailed Sections */
.detailed-sections {
  padding: 40px 40px;
}

.detailed-sections h2 {
  text-align: center;
  color: #3A86FF;
  margin-bottom: 40px;
}

.detailed-section {
  margin-bottom: 60px;
}

.detailed-section h3 {
  color: #3A86FF;
  font-size: 1.8rem;
}

.section-content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.section-text {
  flex: 1.5;
}

.section-text p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.section-image {
  flex: 1;
  height: 250px;
  background-color: #FFD166;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reading-img {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80px;
}

.listening-img {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80px;
}

.vocabulary-img {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80px;
}

.chat-img {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80px;
}

.alternate .section-content {
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-text {
    margin-bottom: 30px;
    padding-right: 0;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .features-grid,
  .section-content {
    grid-template-columns: 1fr;
  }

  .section-content {
    flex-direction: column;
  }

  .alternate .section-content {
    flex-direction: column;
  }

  .hero-image {
    width: 100%;
  }

  .section-image {
    width: 100%;
    margin-top: 20px;
  }

  .slanted-image-container {
    position: relative;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); /* Reset for mobile */
  }
}
</style>

