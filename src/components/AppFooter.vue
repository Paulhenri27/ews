<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#" class="footer-link">Contact us</a>
        <a href="#" class="footer-link">Terms & Conditions</a>
        <a href="#" class="footer-link">Privacy</a>
      </div>
      <div class="footer-copyright">
        ©2017-2025 ews.com. All Rights Reserved.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background-color: rgba(58, 134, 255, 0.1);
  padding: 20px 0;
  width: 100%;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-links {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-link {
  color: #3A86FF;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #2a75ee;
  text-decoration: underline;
}

.footer-copyright {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-links {
    gap: 15px;
  }
}

@media (max-width: 450px) {
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }

  .footer {
    padding: 15px 0;
  }
}
</style>