# Submissions API Documentation

This document outlines the API endpoints for the submissions feature.

## Endpoints

### 1. Get Submissions List

Retrieves a list of all submissions with section data. All filtering, sorting, and pagination is handled client-side.

**Endpoint:** `GET /api/tests/{testId}/submissions`

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
    "timestamp": "2023-06-15T16:30:00Z"
  },
  "message": "Submissions retrieved successfully"
}
```

### 2. Stream Submissions Updates

Provides real-time updates of submissions using Server-Sent Events (SSE).

**Endpoint:** `GET /api/tests/{testId}/submissions/stream`

**Response Format:**
The response is a stream of events. Each event contains either a full data refresh or delta updates.

**Full Data Event:**
```
data: {"type":"full","data":{"submissions":[...],"sections":[...],"timestamp":"2023-06-15T16:30:00Z"}}
```

**Delta Update Event:**
```
data: {"type":"delta","data":[{"id":1,"changes":{"score":80,"correct":48,"sectionCorrect":{"1":16,"2":18,"3":14}}}],"timestamp":"2023-06-15T16:35:00Z"}
```

### 3. Get Submission Detail

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

## Implementation Notes

### Client-Side Filtering and Pagination

All filtering, sorting, and pagination is handled on the client side. The server sends the complete dataset, and the client is responsible for:
- Filtering by section or search term
- Sorting by any column
- Implementing pagination

### Real-Time Updates with SSE

The streaming endpoint uses Server-Sent Events (SSE) to provide real-time updates. The client should:
1. Connect to the stream endpoint
2. Handle "full" type events by replacing the entire dataset
3. Handle "delta" type events by applying changes to specific submissions
4. Update the UI to reflect changes (with optional visual indicators for changed items)

Example client implementation:

```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/tests/123/submissions/stream');
  
  eventSource.onmessage = (event) => {
    const { type, data, timestamp } = JSON.parse(event.data);
    
    if (type === 'full') {
      // Replace all data
      setSubmissions(data.submissions);
      setSections(data.sections);
    } else if (type === 'delta') {
      // Update only changed submissions
      setSubmissions(prev => {
        const updated = [...prev];
        
        data.forEach(change => {
          const index = updated.findIndex(s => s.id === change.id);
          if (index >= 0) {
            // Update existing submission with changed fields
            updated[index] = { ...updated[index], ...change.changes };
          }
        });
        
        return updated;
      });
    }
    
    // Update last sync timestamp
    setLastUpdated(timestamp);
  };
  
  return () => {
    eventSource.close();
  };
}, []);
``` 