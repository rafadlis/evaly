# Submissions API Documentation

This document outlines the API endpoints for the submissions feature.

## Endpoints

### 1. Get Submissions List

Retrieves a paginated list of submissions with filtering and sorting options.

**Endpoint:** `GET /api/tests/{testId}/submissions`

**Query Parameters:**
- `page` (number, default: 1): The page number to retrieve
- `pageSize` (number, default: 20): Number of items per page
- `search` (string, optional): Search term to filter submissions by name or email
- `section` (string, optional): Section ID to filter by, or "all" for all sections
- `sortColumn` (string, optional): Column to sort by (e.g., "score", "submittedAt", "name")
- `sortDirection` (string, optional): Sort direction, either "asc" or "desc"

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": 1,
        "name": "John Smith",
        "email": "john.smith@example.com",
        "totalQuestions": 60,
        "answered": 58,
        "correct": 45,
        "wrong": 13,
        "unanswered": 2,
        "submittedAt": "2023-06-15T14:32:45Z",
        "score": 75,
        "rank": 1,
        "sectionId": 1,
        "sectionAnswers": {
          "1": 19,
          "2": 20,
          "3": 19
        },
        "sectionCorrect": {
          "1": 15,
          "2": 18,
          "3": 12
        },
        "sectionWrong": {
          "1": 4,
          "2": 2,
          "3": 7
        }
      },
      // More submissions...
    ],
    "sections": [
      {
        "id": 1,
        "name": "Basic Knowledge",
        "questionsCount": 20
      },
      // More sections...
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    },
    "filters": {
      "search": "",
      "section": "all",
      "sortColumn": "score",
      "sortDirection": "desc"
    }
  },
  "message": "Submissions retrieved successfully"
}
```

### 2. Get Submission Detail

Retrieves detailed information about a specific submission, including all questions and answers.

**Endpoint:** `GET /api/tests/{testId}/submissions/{email}`

**Path Parameters:**
- `testId` (string): The ID of the test
- `email` (string): The email of the participant

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "totalQuestions": 60,
      "answered": 58,
      "correct": 45,
      "wrong": 13,
      "unanswered": 2,
      "submittedAt": "2023-06-15T14:32:45Z",
      "score": 75,
      "rank": 1,
      "sectionId": 1,
      "sectionAnswers": {
        "1": 19,
        "2": 20,
        "3": 19
      },
      "sectionCorrect": {
        "1": 15,
        "2": 18,
        "3": 12
      },
      "sectionWrong": {
        "1": 4,
        "2": 2,
        "3": 7
      }
    },
    "sections": [
      {
        "id": 1,
        "name": "Basic Knowledge",
        "questionsCount": 20
      },
      // More sections...
    ],
    "questions": [
      {
        "id": 1,
        "text": "Basic Knowledge Q1: What is the capital of France?",
        "type": "multiple_choice",
        "correctAnswer": "Paris",
        "participantAnswer": "Paris",
        "isCorrect": true,
        "sectionId": 1
      },
      // More questions...
    ]
  },
  "message": "Submission details retrieved successfully"
}
```

## Data Models

### Submission

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier for the submission |
| name | string | Participant's name |
| email | string | Participant's email address |
| totalQuestions | number | Total number of questions in the test |
| answered | number | Number of questions answered |
| correct | number | Number of questions answered correctly |
| wrong | number | Number of questions answered incorrectly |
| unanswered | number | Number of questions not answered |
| submittedAt | string | ISO timestamp of when the submission was completed |
| score | number | Overall score as a percentage |
| rank | number | Participant's rank based on score |
| sectionId | number | Primary section ID for this participant |
| sectionAnswers | object | Map of section IDs to number of questions answered in each section |
| sectionCorrect | object | Map of section IDs to number of questions answered correctly in each section |
| sectionWrong | object | Map of section IDs to number of questions answered incorrectly in each section |

### Section

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier for the section |
| name | string | Name of the section |
| questionsCount | number | Number of questions in this section |

### Question

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier for the question |
| text | string | The question text |
| type | string | Question type: "multiple_choice", "true_false", or "short_answer" |
| correctAnswer | string | The correct answer |
| participantAnswer | string | The participant's answer (null if unanswered) |
| isCorrect | boolean | Whether the participant's answer is correct (null if unanswered) |
| sectionId | number | The section this question belongs to | 