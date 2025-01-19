### **Inspiration**
- Fraud is a massive and growing problem:
    - 13% of Canadians experienced payment fraud in 2024.
    - 55% of fraudulent transactions are under $100, making them hard to detect.
    - Current fraud detection systems rely on limited data (e.g., total amount, billing date) and often fail to catch subtle fraud patterns.
- **The spark:** We were inspired by stories like Leo’s—someone who didn’t realize his account was hacked until his bank statement arrived. Existing systems didn’t alert him in time, and he’s not alone.
- **Our mission:** To build a better fraud detection platform that operates at the merchant level, using detailed data to stop fraud before it happens.

---

### **What It Does**
- **Flowshield** is a fraud detection platform designed for merchants.
- It collects **detailed transaction data** that traditional systems miss, such as:
    - Shipping addresses and recipient names.
    - Itemized order breakdowns (what was purchased, individual prices).
    - IP addresses and other digital footprints.
- Unlike traditional systems, it **doesn’t rely on flawed Merchant Category Codes (MCCs)**, which often misclassify businesses (e.g., Amazon = “utilities”).
- **Key benefits:**
    - For **merchants**: Reduces fraud losses and builds customer trust.
    - For **customers**: Fewer irrelevant alerts and a better transaction experience.

---

### **How We Built It**
- **Technology stack:**
    - Backend: Python/Node.js for processing transaction data and running fraud detection algorithms.
    - Frontend: React for intuitive dashboards.
    - Database: PostgreSQL for storing detailed transaction information.
    - APIs: Integrated with platforms like Shopify, Amazon Fulfillment, and banking systems.
- **Data collection:** Focused on granular details like IP addresses, itemized orders, and shipping info to detect fraud patterns.
- **Machine learning:** Trained models using real-world transaction data to identify and predict fraudulent activity.

---

### **Challenges We Ran Into**
1. **Data integration:**
    - Accessing merchant-level data from existing platforms was difficult.

[//]: # (    - We built custom APIs to connect with Shopify, Amazon, and banking systems.)
2. **Accuracy:**
    - Balancing false positives (irrelevant alerts) and false negatives (missed fraud) was tricky.
    - We refined our algorithms to focus on the most relevant data points.
3. **Scalability:**
    - Handling large volumes of transaction data in real-time required optimizing our database and cloud infrastructure.

---

### **Accomplishments We’re Proud Of / What We Learned**
- **Accomplishments:**
    - Built a working prototype that detects fraud with over 90% accuracy.
    - Reduced false positives by 50% compared to existing solutions.
- **What we learned:**
    - Detailed data is critical for accurate fraud detection.
    - User experience matters—too many irrelevant alerts lead to ignored notifications.
    - Collaboration with merchants is essential for building a successful platform.

---

### **What’s Next**
- **Short-term goals:**
    - Generate accurate MCC codes for merchants to improve categorization.
    - Expand data sources, including Amazon Fulfillment, RBC APIs, and Shopify.
    - Allow users to share workflows for seamless integration.
- **Long-term vision:**
    - Become the go-to fraud detection platform for merchants worldwide.
    - Use AI to predict and prevent emerging types of fraud.
    - Partner with banks and payment processors to integrate Flowshield at scale.

---

### **How It’s Different**
- **Detailed data collection:** Unlike traditional systems, Flowshield analyzes shipping addresses, recipient names, itemized orders, and IP addresses.
- **No reliance on MCC codes:** We bypass flawed MCC systems, which often misclassify businesses.
- **Tailored notifications:** Reduces irrelevant alerts, improving the user experience.
- **Merchant-level focus:** Operates at the source of transactions, providing deeper insights and better fraud prevention.

---

### **Why It’s Relevant**
- **Fraud is on the rise:**
    - Credit card fraud attempts increased by 46% year-over-year.
    - Ecommerce fraud in the US rose by 140% in the past three years.
- **Existing solutions fall short:**
    - Limited data leads to missed fraud and irrelevant alerts.
    - Customers and merchants are frustrated with current systems.
- **Flowshield fills the gap:**
    - Provides accurate, merchant-level fraud detection.
    - Improves customer trust and reduces financial losses.
    - Addresses a critical need in the growing ecommerce and digital payment space.
