<h1 align="center">☁️ Cloudana Cost Optimizer</h1>

<p align="center">
  <b>A smart cloud-based web app to monitor, analyze, and <br>
  <u>optimize AWS cloud costs</u> while identifying <u>idle/unutilized resources</u> – built with free-tier services.</b>
</p>

---

<p align="center">
  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white" />
  <img src="https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Amazon%20CloudWatch-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white" />
  <img src="https://img.shields.io/badge/Amazon%20EventBridge-8C4FFF?style=for-the-badge&logo=amazoneventbridge&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
</p>

---

## 🚀 Problem Statement
Cloud costs often grow unexpectedly due to **idle resources, lack of monitoring, and hidden billing spikes**.  
AWS services like EC2, S3, and EBS can incur **unnecessary charges** if not tracked properly.  

There is a need for a **cost optimization system** that:  
✔ Fetches live billing and usage details  
✔ Detects idle/unused resources  
✔ Sets budgets and alerts  
✔ Monitors cost anomalies  
✔ Recommends optimizations in real-time  

---

## 💡 Our Solution
We built a **cloud-based web app** that:  

- 📊 Fetches **live billing reports** using **Cost and Usage Reports (CUR)** + **Athena Free Tier**  
- 💰 Reviews **real costs vs AWS Pricing API standard rates**  
- 🎯 Lets users **set budgets** and alerts with **custom logic (no paid API)**  
- 💤 Identifies **idle/unutilized EC2 resources** using **CloudWatch Free Tier**  
- ⚡ Detects **anomalies** using lightweight ML (Pandas stats)  
- 🤖 Automates cost-saving actions (e.g., stopping EC2 instances) via **AWS Lambda Free Tier**  

✨ All done with **zero extra AWS cost** beyond actual resource usage.  

---
🏃 How to Run the Project

Clone the repository
1. **Clone the repository**
   ```bash
   git clone https://github.com/ananyagla/cloud-cost-optimizer.git
   cd cloud-cost-optimizer 

2. **Go to the backend folder**
   ```bash
   cd backend

3. **Run the startup script**
   ```bash
   start.bat

---
## 🛠️ Tech Stack Details  

### 🌐 Frontend  
- Pure **HTML5, CSS3, JavaScript (ES6+)**  
- Responsive UI with CSS  
- Lucide icons + Google Fonts  

### ⚙️ Backend  
- **AWS Lambda (Node.js/Python)** – APIs & automation  
- **Amazon EventBridge** – scheduled tasks  
- **CloudWatch** – fetch idle resource metrics  
- **DynamoDB** – store budgets & anomaly history  
- **Momento Cache (Free)** – cache CUR query results  
- **Pandas (Python)** – anomaly detection logic  

---

## ⚖️ Free vs Paid Usage

| Feature                    | Service Used                    | Free? |
|-----------------------------|---------------------------------|-------|
| Billing Data               | CUR + Athena                   | ✅ (1TB free queries/month) |
| Pricing Information        | AWS Pricing API                | ✅ Free |
| Budgets                    | Custom Python logic            | ✅ Free |
| Idle Resource Detection    | CloudWatch Free Tier (10 alarms) | ✅ Free |
| Anomaly Detection          | Python (Pandas)                | ✅ Free |
| Automation (Stop EC2, etc.)| AWS Lambda Free Tier           | ✅ 1M requests/month |

---

## 📁 Project Structure  
```
backend/
├── Models/
├── index.js
├── server.js
├── test-db.js
├── .env
└── package.json

frontend/
├── css/
│   ├── login.css
│   └── styles.css
├── js/
│   ├── dash.js
│   └── login.js
├── res/
│   └── logo.png
├── index.html
├── dashboard.html
└── test-dashboard.html

README.md

```
---

## 🔧 Workflow Steps  

1. **Billing Fetching** → CUR → Athena → parse cost per resource  
2. **Pricing Comparison** → AWS Pricing API → match with CUR data  
3. **Budgeting** → Store user budget → check CUR spend daily → alert  
4. **Idle Resources** → CloudWatch → check EC2 CPU/Network metrics  
5. **Anomaly Detection** → Pandas stats → detect spikes in spend  
6. **Automation** → AWS Lambda → stop or resize idle EC2  

---

## 🌐 Browser Compatibility  
✅ Chrome 85+ | ✅ Firefox 78+ | ✅ Safari 14+ | ✅ Edge 85+  

---
