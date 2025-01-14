
# **Documentation de l'API Spam Detector**

## **Base URL**
```
https://www.virustotal.com/api/v3/urls
```

---

## **Endpoints**

### **1. Analyse d’un email via fichier**

#### **Endpoint**
```
POST /email-analysis
```

#### **Description**
Permet d’analyser un email en envoyant un fichier contenant ses informations.

#### **Headers**
| Clé            | Valeur                       | Description                                   |
|-----------------|------------------------------|-----------------------------------------------|
| `Authorization` | Bearer `<token>` (optionnel) | Token d’authentification pour enregistrer l’analyse. |
| `Content-Type`  | `multipart/form-data`        | Spécifie le type de contenu pour un fichier. |

#### **Body (form-data)**
| Clé         | Type  | Description                 |
|-------------|-------|-----------------------------|
| `emailFile` | Fichier | Le fichier contenant l'email à analyser. |

#### **Exemple de requête**
```bash
curl -X POST http://localhost:<port>/email-analysis \
-H "Authorization: Bearer <token>" \
-H "Content-Type: multipart/form-data" \
-F "emailFile=@path/to/email.json"
```

#### **Réponses**

**Code : 200 OK**
```json
{
  "labels": ["spam"],
  "probabilities": {
    "spam": 75,
    "phishing": 20,
    "promotion": 5
  },
  "alerts": ["Attention : 1 lien(s) malveillant(s) détecté(s)."],
  "details": {
    "keywordsUsed": {
      "spam": ["win", "prize"],
      "phishing": [],
      "promotion": []
    },
    "totalWeight": {
      "spam": 10,
      "phishing": 0,
      "promotion": 0
    },
    "totalWords": 100,
    "links": {
      "detected": ["https://malicious-link.com"],
      "malicious": ["https://malicious-link.com"]
    }
  }
}
```

**Code : 400 Bad Request**
```json
{
  "error": "File required."
}
```

---

### **2. Analyse d’un email via formulaire**

#### **Endpoint**
```
POST /email-analysis
```

#### **Description**
Permet d’analyser un email envoyé via un formulaire (objet et corps).

#### **Headers**
| Clé            | Valeur                       | Description                                   |
|-----------------|------------------------------|-----------------------------------------------|
| `Authorization` | Bearer `<token>` (optionnel) | Token d’authentification pour enregistrer l’analyse. |
| `Content-Type`  | `application/json`           | Spécifie que le corps est au format JSON.    |

#### **Body (JSON)**
```json
{
  "subject": "Congratulations! You've won a prize!",
  "body": "Click here to claim your reward: https://malicious-link.com."
}
```

#### **Exemple de requête**
```bash
curl -X POST http://localhost:<port>/email-analysis \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "subject": "Congratulations! You've won a prize!",
  "body": "Click here to claim your reward: https://malicious-link.com."
}'
```

#### **Réponses**

**Code : 200 OK**
```json
{
  "labels": ["spam"],
  "probabilities": {
    "spam": 75,
    "phishing": 20,
    "promotion": 5
  },
  "alerts": ["Attention : 1 lien(s) malveillant(s) détecté(s)."],
  "details": {
    "keywordsUsed": {
      "spam": ["win", "prize"],
      "phishing": [],
      "promotion": []
    },
    "totalWeight": {
      "spam": 10,
      "phishing": 0,
      "promotion": 0
    },
    "totalWords": 100,
    "links": {
      "detected": ["https://malicious-link.com"],
      "malicious": ["https://malicious-link.com"]
    }
  }
}
```

**Code : 400 Bad Request**
```json
{
  "error": "Subject and body are required."
}
```

---

### **3. Soumettre un email pour analyse**

#### **Endpoint**
```
POST /email/analyze
```

#### **Description**
Soumet un email pour analyse afin de déterminer s’il est un spam ou non.

#### **Headers**
| Clé            | Valeur                       | Description                                   |
|-----------------|------------------------------|-----------------------------------------------|
| `Authorization` | Bearer `<token>` (requis)   | Token d’authentification.                    |
| `Content-Type`  | `application/json`           | Type de contenu envoyé.                      |

#### **Body (JSON)**
```json
{
  "object": "Congratulations!",
  "body": "You have won a prize! Click here to claim your reward."
}
```

#### **Exemple de requête**
```bash
curl -X POST http://localhost:<port>/email/analyze \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "object": "Congratulations!",
  "body": "You have won a prize! Click here to claim your reward."
}'
```

#### **Réponses**

**Code : 201 Created**
```json
{
  "_id": "64b6a1f7b1c12345678abcdef",
  "object": "Congratulations!",
  "body": "You have won a prize! Click here to claim your reward.",
  "result": "spam",
  "__v": 0
}
```

**Code : 500 Internal Server Error**
```json
{
  "error": "Erreur lors de l'analyse de l'email."
}
```

---

### **4. Récupérer l’historique des emails analysés**

#### **Endpoint**
```
GET /email/emails
```

#### **Description**
Récupère une liste des emails précédemment analysés avec leurs résultats.

#### **Headers**
| Clé            | Valeur                       | Description                                   |
|-----------------|------------------------------|-----------------------------------------------|
| `Authorization` | Bearer `<token>` (requis)   | Token d’authentification.                    |

#### **Exemple de requête**
```bash
curl -X GET http://localhost:<port>/email/emails \
-H "Authorization: Bearer <token>"
```

#### **Réponses**

**Code : 200 OK**
```json
[
  {
    "_id": "64b6a1f7b1c12345678abcdef",
    "object": "Congratulations!",
    "body": "You have won a prize! Click here to claim your reward.",
    "result": "spam",
    "__v": 0
  }
]
```

**Code : 500 Internal Server Error**
```json
{
  "error": "Erreur lors de la récupération des emails."
}
```

---

## **Authentification**

Les routes utilisant `authMiddleware` nécessitent un token valide passé dans les headers. Si le token est invalide ou absent, la réponse sera :

**Code : 401 Unauthorized**
```json
{
  "error": "Authentification requise."
}
```

---
