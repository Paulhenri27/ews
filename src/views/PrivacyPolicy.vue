<template>
  <div>
    <MenuComponent />
    <div class="policy-container">
      <h1>Privacy Policy</h1>
      <div class="content-box">
        <p class="last-updated">Last Updated: June 15, 2024</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>When you use our site, we may collect the following information:</p>
          <ul>
            <li>Personal information such as name, email address, and payment details when you register</li>
            <li>Usage data including pages visited, time spent on pages, and learning progress</li>
            <li>Device information including browser type, IP address, and operating system</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our language learning services</li>
            <li>Improve and personalize your learning experience</li>
            <li>Process transactions and send related information</li>
            <li>Send notifications about your account or learning progress</li>
            <li>Respond to your comments and questions</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:</p>
          <ul>
            <li>With service providers who help us operate our business</li>
            <li>If required by law or to protect our rights</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
            <li>Request transfer of your personal information</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@ews.com.</p>
        </section>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import MenuComponent from '@/components/Menu.vue'
import FooterComponent from '@/components/AppFooter.vue'

export default {
  name: 'PrivacyPolicy',
  components: {
    MenuComponent,
    FooterComponent
  }
}
</script>

<style scoped>
.policy-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}

h1 {
  color: #3A86FF;
  font-size: 32px;
  margin-bottom: 25px;
  text-align: center;
}

.content-box {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: box-shadow 0.3s ease;
}

.content-box:hover {
  box-shadow: 0 8px 16px rgba(58, 134, 255, 0.2);
}

.last-updated {
  color: #666;
  font-style: italic;
  margin-bottom: 25px;
  text-align: right;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #3A86FF;
  font-size: 22px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
  color: #333;
}

ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 8px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .policy-container {
    padding: 0 15px;
  }

  h1 {
    font-size: 28px;
  }

  .content-box {
    padding: 20px;
  }
}
</style>