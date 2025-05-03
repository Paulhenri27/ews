<template>
  <div>
    <MenuComponent />
    <div class="terms-container">
      <h1>Terms & Conditions</h1>
      <div class="content-box">
        <p class="last-updated">Last Updated: June 15, 2024</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.</p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on ews.com for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on ews.com</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2>3. Account Responsibilities</h2>
          <p>If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>
        </section>

        <section>
          <h2>4. Subscription and Payments</h2>
          <p>Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring basis. Billing cycles are set on a monthly basis. At the end of each billing cycle, your subscription will automatically renew under the same conditions unless you cancel it or ews.com cancels it.</p>
        </section>

        <section>
          <h2>5. Disclaimer</h2>
          <p>The materials on ews.com's website are provided on an 'as is' basis. ews.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2>6. Limitations</h2>
          <p>In no event shall ews.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ews.com's website, even if ews.com or a ews.com authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section>
          <h2>7. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws and shall be governed by the courts of the jurisdiction where ews.com is established.</p>
        </section>

        <section>
          <h2>8. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at terms@ews.com.</p>
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
  name: 'TermsOfUse',
  components: {
    MenuComponent,
    FooterComponent
  }
}
</script>

<style scoped>
.terms-container {
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
  .terms-container {
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