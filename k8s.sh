#!/bin/bash
# Créer le dossier k8s
mkdir -p k8s

# Créer database.yaml
cat > k8s/database.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: blogdb
spec:
  ports:
    - port: 5432
      targetPort: 5432
  selector:
    app: blogdb
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blogdb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: blogdb
  template:
    metadata:
      labels:
        app: blogdb
    spec:
      containers:
      - name: blogdb
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          value: "postgres"
        - name: POSTGRES_DB
          value: "blogdb"
        volumeMounts:
        - name: pgdata
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: pgdata
        emptyDir: {}
EOF

# Créer users-service.yaml
cat > k8s/users-service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: users-service
spec:
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: users-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: users-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: users-service
  template:
    metadata:
      labels:
        app: users-service
    spec:
      containers:
      - name: users-service
        image: your-dockerhub-username/users-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "blogdb"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres"
        - name: DB_NAME
          value: "blogdb"
EOF

# Créer posts-service.yaml
cat > k8s/posts-service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: posts-service
spec:
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: posts-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts-service
  template:
    metadata:
      labels:
        app: posts-service
    spec:
      containers:
      - name: posts-service
        image: your-dockerhub-username/posts-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "blogdb"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres"
        - name: DB_NAME
          value: "blogdb"
EOF

# Créer comments-service.yaml
cat > k8s/comments-service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: comments-service
spec:
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: comments-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: comments-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: comments-service
  template:
    metadata:
      labels:
        app: comments-service
    spec:
      containers:
      - name: comments-service
        image: your-dockerhub-username/comments-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "blogdb"
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres"
        - name: DB_NAME
          value: "blogdb"
EOF

# Créer api-gateway.yaml
cat > k8s/api-gateway.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  ports:
    - port: 8080
      targetPort: 8080
  selector:
    app: api-gateway
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: your-dockerhub-username/api-gateway:latest
        ports:
        - containerPort: 8080
        env:
        - name: JWT_SECRET
          value: "votre_secret"
EOF

# Créer front-end.yaml
cat > k8s/front-end.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: front-end
spec:
  type: NodePort
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30080
  selector:
    app: front-end
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: front-end
spec:
  replicas: 1
  selector:
    matchLabels:
      app: front-end
  template:
    metadata:
      labels:
        app: front-end
    spec:
      containers:
      - name: front-end
        image: your-dockerhub-username/front-end:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://api-gateway:8080"
EOF

echo "Le dossier k8s et tous les manifestes ont été créés."
