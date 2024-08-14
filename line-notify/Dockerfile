# ใช้ Node.js image จาก Docker Hub
FROM node:18

# ตั้งค่า working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดแอปพลิเคชัน
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะรัน
EXPOSE 3000

# คำสั่งเริ่มต้นเพื่อรันแอปพลิเคชัน
CMD ["node", "index.js"]
