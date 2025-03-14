
#  Claims Management Platform

A web application designed to simplify the claims process between patients and insurers. Patients can submit and track claims, while insurers can review, manage, and update claim statuses.


## Features

- Patient-side portal for submitting and tracking claims
- Insurer-side portal for reviewing and managing claims
- Authentication system for patients and insurers
- Status tracking (Pending, Approved, Rejected)
- File upload for claim documents


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

MONGO_DB_URL - Your MongoDB connection string

PORT - 5000

## API Reference

#### Get all items

```http
  GET /claims/allclaimsnumber
```
- Returns the total number of claims.

#### Get item

```http
  POST /claims
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of the patient |
| `email`      | `string` | **Required**. Email of the patient |
| `claimAount`      | `number` | **Required**. Amount being claimed |
| `description`      | `string` | **Required**. description of claim |
| `document`      | `file` | **Required**. Prescription file upload(pdf/img) |

#### Get Patient Claims
```http
  POST /claims
```
- Requires patient authentication.
- Returns all claims associated with the authenticated patient.
#### Get All Claims (Insurer)
```http
  GET /api/claims/all
```
- Requires insurer authentication.
- Returns all claims.
#### Get claim by id
```http
  GET /claims/:id
```
- Requires insurer authentication.
- Returns claim details for the given ID.
#### Update claim
```http
  PUT /claims/{id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `status`      | `string` | **Required**. Updated status (Approved/Rejected) |
| `approvedAmount`      | `number` |  Approved claim amoun |
| `insurerComments`      | `strong` |  Comments from insurer |

#### delete all claims
```http
  DELETE /claims/all
```
- Requires insurer authentication.
- Deletes all claims associated with the authenticated patient.


## Run Locally

Clone the project

```bash
  git clone https://github.com/Yashwanth12321/claims-management-platform.git
```

Go to the project directory

```bash
  cd claims-management-platform
```

run frontend 

```bash
  cd client
  npm install
  npm run dev
```

run backend

```bash
  cd server
  npm install
  npm start
```



## Tech Stack

**Client:** React, TailwindCSS , accentricityUI, ShadCN

**Server:** Node, Express, Mongoose
**database:** MongoDB
