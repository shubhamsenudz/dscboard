# DscBoard

Class-3 DSC and USB token register for CA firms and DSC agents.

Java 21 Spring Boot API + React (Vite) UI + PostgreSQL. Deploy on AWS ap-south-1 (Mumbai).

## Run

```bash
docker compose up --build
```

Open http://localhost and create a workspace.

Dev:

```bash
cd backend && mvn spring-boot:run
cd frontend && npm install && npm run dev
```

## AWS

1. RDS PostgreSQL 16 in ap-south-1
2. Ubuntu 22.04 EC2, ports 22/80/443
3. Run aws/deploy-ec2-ap-south-1.sh
4. Keep JWT_SECRET and DB password in environment. Data stays in India.

GitHub: https://github.com/shubhamsenudz/dscboard
