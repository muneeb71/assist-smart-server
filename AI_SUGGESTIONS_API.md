# AI Suggestions API Documentation

## Overview

The AI Suggestions API provides production-ready endpoints for health and safety professionals to get intelligent content improvement suggestions. The API supports both single content analysis and batch processing for efficient document review.

## Base URL

```
/api/v1/suggestions
```

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Generate Single AI Suggestions

**Endpoint:** `POST /api/v1/suggestions`

**Description:** Generate AI-powered suggestions for a single piece of content.

**Rate Limit:** 100 requests per hour per user

**Request Body:**
```json
{
  "content": "Your document content to analyze",
  "context": "safety|compliance|procedure|risk|general",
  "documentType": "policies-procedures|risk-assessment|incident-report",
  "section": "Section name or identifier",
  "maxSuggestions": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Suggestions generated successfully",
  "data": {
    "suggestions": [
      {
        "id": "suggestion-1234567890-0",
        "type": "safety",
        "category": "Safety Management System",
        "priority": "high",
        "suggestion": "Implement comprehensive safety management system elements...",
        "improvedText": "Enhanced version with improvements",
        "reasoning": "A systematic approach ensures consistent implementation..."
      }
    ],
    "metadata": {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "contentLength": 500,
      "context": "safety",
      "documentType": "policies-procedures",
      "section": "Emergency Procedures",
      "processingTime": 1500,
      "cached": false
    }
  }
}
```

### 2. Generate Batch AI Suggestions

**Endpoint:** `POST /api/v1/suggestions/batch`

**Description:** Generate AI-powered suggestions for multiple content items in a single request. Each content item is processed individually using the same AI generation logic as single requests.

**Rate Limit:** 50 requests per hour per user

**Request Size Limit:** 5MB

**Request Body:**
```json
{
  "contents": [
    {
      "id": "content-1",
      "content": "First document content to analyze",
      "context": "safety",
      "documentType": "policies-procedures"
    },
    {
      "id": "content-2", 
      "content": "Second document content to analyze",
      "context": "compliance",
      "documentType": "risk-assessment"
    }
  ],
  "documentType": "policies-procedures",
  "maxSuggestions": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch suggestions generated successfully",
  "data": {
    "results": [
      {
        "id": "content-1",
        "suggestions": [
          {
            "id": "suggestion-1234567890-content-1-0",
            "type": "safety",
            "category": "Safety Management System",
            "priority": "high",
            "suggestion": "Implement comprehensive safety management system elements...",
            "improvedText": "Enhanced version with improvements",
            "reasoning": "A systematic approach ensures consistent implementation..."
          }
        ]
      }
    ],
    "metadata": {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "contentCount": 2,
      "documentType": "policies-procedures",
      "processingTime": 2500,
      "requestId": "batch-req-1234567890-abc123"
    }
  }
}
```

### 3. Health Check

**Endpoint:** `GET /api/v1/suggestions/health`

**Description:** Check the health status of the AI suggestions service.

**Response:**
```json
{
  "success": true,
  "message": "Health check completed",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "services": {
      "gemini": "configured",
      "cache": "operational",
      "rateLimit": "operational"
    },
    "endpoints": {
      "POST /api/suggestions": "Generate single AI suggestions",
      "POST /api/suggestions/batch": "Generate batch AI suggestions",
      "GET /api/suggestions/stats": "Get suggestion statistics",
      "GET /api/suggestions/health": "Health check endpoint",
      "GET /api/suggestions/options": "Get available options"
    },
    "rateLimit": {
      "single": { "windowMs": 3600000, "max": 100 },
      "batch": { "windowMs": 3600000, "max": 50 }
    },
    "limits": {
      "maxBatchSize": 20,
      "maxContentLength": 10000,
      "requestSizeLimit": "5MB for batch requests, 1MB for single requests"
    },
    "version": "1.0.0"
  }
}
```

### 4. Get Options

**Endpoint:** `GET /api/v1/suggestions/options`

**Description:** Get available options for contexts, document types, and suggestion types.

**Response:**
```json
{
  "success": true,
  "message": "Options retrieved successfully",
  "data": {
    "contexts": [
      {
        "value": "safety",
        "label": "Safety",
        "description": "Safety protocols and procedures"
      },
      {
        "value": "compliance",
        "label": "Compliance", 
        "description": "Regulatory compliance and legal requirements"
      }
    ],
    "documentTypes": [
      {
        "value": "policies-procedures",
        "label": "Policies & Procedures",
        "description": "Company policies and procedures"
      }
    ],
    "suggestionTypes": [
      {
        "value": "grammar",
        "label": "Grammar",
        "description": "Grammar, punctuation, and language improvements"
      }
    ],
    "priorities": [
      {
        "value": "high",
        "label": "High",
        "description": "Critical issues that must be addressed"
      }
    ],
    "limits": {
      "maxSuggestions": { "min": 1, "max": 5, "default": 3 },
      "maxContentLength": 10000,
      "rateLimit": { "requests": 100, "window": "1 hour" }
    }
  }
}
```

### 5. Get Statistics

**Endpoint:** `GET /api/v1/suggestions/stats`

**Description:** Get usage statistics for the authenticated user.

**Query Parameters:**
- `startDate` (optional): Start date for statistics (ISO format)
- `endDate` (optional): End date for statistics (ISO format)

## Suggestion Types

The API provides comprehensive, professional suggestion types specifically designed for health and safety professionals:

### Safety Context
- **Safety Management System**: Comprehensive OHSMS implementation with policy development, hazard identification, and continuous improvement
- **Regulatory Compliance**: OSHA 29 CFR, ANSI Z10, ISO 45001, HSE, OSHAD standards integration
- **Emergency Preparedness**: Emergency response procedures, evacuation protocols, and crisis management frameworks
- **Safety Culture Development**: Leadership commitment, employee engagement, and organizational safety commitment
- **Incident Prevention**: Near-miss reporting, safety performance monitoring, and proactive safety measures

### Compliance Context
- **Regulatory Framework**: Federal, state, and local regulation compliance with specific regulatory citations
- **Audit Readiness**: Compliance monitoring procedures, audit protocols, and regulatory change management
- **Legal Documentation**: Record-keeping standards, retention schedules, and regulatory notification procedures
- **Multi-jurisdictional Compliance**: International standards and cross-border regulatory requirements
- **Enforcement Response**: Regulatory liaison procedures and inspection preparation protocols

### Procedure Context
- **Standardized Procedures**: Clear step-by-step instructions with quality checkpoints and responsibility matrices
- **Competency Framework**: Training standards, qualification requirements, and certification processes
- **Quality Assurance**: Quality control measures, verification steps, and continuous improvement processes
- **Procedure Integration**: Workflow optimization, system integration, and efficiency improvements
- **Change Management**: Version control, approval processes, and procedure update protocols

### Risk Context
- **Risk Assessment Methodology**: Comprehensive risk evaluation with likelihood, consequence, and risk rating criteria
- **Hierarchy of Controls**: Systematic application of elimination, substitution, engineering, administrative, and PPE controls
- **Risk Monitoring**: Ongoing risk management, review schedules, and continuous improvement processes
- **Risk Communication**: Stakeholder engagement, risk awareness programs, and risk-based decision making
- **Emerging Risk Management**: Proactive risk identification and emerging hazard management strategies

### General Context
- **Professional Documentation**: Industry terminology, regulatory compliance language, and professional communication standards
- **Document Structure**: Clear formatting, logical organization, and user comprehension optimization
- **Stakeholder Engagement**: Professional communication frameworks and multi-language considerations
- **Audit Trail Management**: Document version control, approval processes, and lifecycle management
- **Accessibility Standards**: Translation requirements and user-friendly presentation guidelines

## Error Responses

### Rate Limit Exceeded
```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "type": "rate_limit_exceeded",
  "retryAfter": 3600
}
```

### Request Too Large
```json
{
  "success": false,
  "message": "Request too large. Maximum size is 5MB for batch requests.",
  "type": "request_too_large"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Contents array is required and must not be empty",
  "type": "validation_error"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Failed to generate batch AI suggestions",
  "type": "server_error",
  "error": "Detailed error message"
}
```

## Usage Examples

### Single Suggestion Request
```javascript
const response = await fetch('/api/v1/suggestions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: "Employees must follow safety procedures during equipment operation.",
    context: "safety",
    documentType: "policies-procedures",
    section: "Equipment Safety",
    maxSuggestions: 3
  })
});

const result = await response.json();
```

### Batch Suggestion Request
```javascript
const response = await fetch('/api/v1/suggestions/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    contents: [
      {
        id: "safety-procedure-1",
        content: "Safety procedures must be followed...",
        context: "safety",
        documentType: "policies-procedures"
      },
      {
        id: "compliance-doc-1",
        content: "Compliance requirements include...",
        context: "compliance", 
        documentType: "risk-assessment"
      }
    ],
    documentType: "policies-procedures",
    maxSuggestions: 3
  })
});

const result = await response.json();
```

## Production Considerations

### Rate Limiting
- Single requests: 100 per hour
- Batch requests: 50 per hour
- Rate limits are per authenticated user + IP combination

### Request Size Limits
- Single requests: 1MB maximum
- Batch requests: 5MB maximum
- Individual content items: 10,000 characters maximum

### Batch Processing
- Maximum 20 content items per batch request
- Uses the same AI generation logic as single requests
- Processing time scales with content count (each item processed individually)
- Results include unique request IDs for tracking
- Fallback suggestions provided if AI generation fails for any item

### Caching
- Responses are cached for 30 minutes
- Cache key includes content hash, context, document type, and section
- Cache size limited to 1000 entries with automatic cleanup

### Error Handling
- Comprehensive validation for all input parameters
- Graceful degradation with fallback suggestions
- Detailed error logging for debugging
- Proper HTTP status codes for different error types

## Security Features

- Content sanitization to prevent XSS attacks
- Request size limits to prevent DoS attacks
- Rate limiting to prevent abuse
- Authentication required for all endpoints
- Input validation and sanitization

This API is designed to be production-ready and reliable for health and safety professionals who need intelligent content improvement suggestions for their documentation.