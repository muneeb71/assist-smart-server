# AI-Powered Document Suggestions API

## Overview

The Suggestions API provides intelligent content analysis and improvement suggestions for document editing. It uses Google's Gemini 2.5 Flash model to generate context-aware suggestions based on document type, section, and content.

## Base URL

```
/api/v1/suggestions
```

## Authentication

All endpoints require authentication via Bearer token:

```http
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Generate Suggestions

**POST** `/api/v1/suggestions`

Generate AI-powered suggestions for document content.

#### Request Body

```json
{
  "content": "Workers must follow safety procedures",
  "context": "safety",
  "documentType": "policies-procedures",
  "section": "safety-procedures",
  "maxSuggestions": 3
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The text content to analyze (max 10,000 characters) |
| `context` | enum | Yes | Analysis context: `safety`, `compliance`, `procedure`, `risk`, `general` |
| `documentType` | enum | Yes | Document type: `policies-procedures`, `risk-assessment`, `incident-report` |
| `section` | string | Yes | Document section being edited |
| `maxSuggestions` | number | No | Number of suggestions (1-5, default: 3) |

#### Response

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "suggestion-123",
        "type": "safety",
        "category": "Safety Enhancement",
        "priority": "high",
        "suggestion": "Consider adding specific safety protocols and emergency procedures.",
        "improvedText": "Workers must follow safety procedures including:\n- Personal protective equipment requirements\n- Emergency evacuation procedures\n- Incident reporting protocols",
        "reasoning": "Safety sections benefit from specific protocols and emergency procedures."
      }
    ],
    "metadata": {
      "timestamp": "2025-01-22T18:34:42.208Z",
      "contentLength": 35,
      "context": "safety",
      "documentType": "policies-procedures",
      "section": "safety-procedures",
      "processingTime": 1250,
      "cached": false
    }
  }
}
```

### 2. Get Options

**GET** `/api/v1/suggestions/options`

Get available contexts, document types, and suggestion types.

#### Response

```json
{
  "success": true,
  "data": {
    "contexts": [
      {
        "value": "safety",
        "label": "Safety",
        "description": "Safety protocols and procedures"
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

### 3. Health Check

**GET** `/api/v1/suggestions/health`

Check AI service availability and configuration.

#### Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-22T18:34:42.208Z",
    "services": {
      "openai": "configured",
      "cache": "operational",
      "rateLimit": "operational"
    },
    "version": "1.0.0"
  }
}
```

### 4. Get Statistics

**GET** `/api/v1/suggestions/stats`

Get AI suggestion usage statistics (requires authentication).

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | string | Start date for statistics (ISO format) |
| `endDate` | string | End date for statistics (ISO format) |

#### Response

```json
{
  "success": true,
  "data": {
    "totalRequests": 150,
    "averageProcessingTime": 1250,
    "suggestionsByType": {
      "safety": 45,
      "compliance": 30,
      "grammar": 25
    },
    "contextDistribution": {
      "safety": 40,
      "compliance": 35,
      "general": 25
    },
    "errorRate": 0.02
  }
}
```

## Context-Specific Logic

### Safety Context
- Focuses on safety protocols, emergency procedures, and risk mitigation
- Emphasizes clear, actionable safety instructions
- Highlights potential hazards and protective measures
- Ensures compliance with safety regulations

### Compliance Context
- Emphasizes regulatory references and legal requirements
- Focuses on audit trails and documentation standards
- Highlights compliance gaps and regulatory risks
- Ensures proper legal language and terminology

### Procedure Context
- Improves step-by-step instructions and clarity
- Focuses on responsibilities and accountability
- Enhances workflow and process efficiency
- Ensures logical sequence and completeness

### Risk Context
- Enhances risk assessment and control measures
- Focuses on monitoring procedures and mitigation strategies
- Highlights potential risks and their impacts
- Ensures comprehensive risk coverage

### General Context
- Focuses on grammar, style, and general content improvements
- Enhances readability and professional tone
- Improves structure and organization
- Ensures clarity and conciseness

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 413 | Payload Too Large - Request exceeds size limit |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - AI service unavailable |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "type": "error_type",
  "retryAfter": 3600
}
```

### Common Error Types

- `validation_error`: Invalid input parameters
- `rate_limit_exceeded`: Too many requests
- `service_unavailable`: AI service temporarily unavailable
- `server_error`: Internal server error
- `request_too_large`: Request exceeds size limit

## Rate Limiting

- **Limit**: 100 requests per hour per user/IP
- **Window**: 1 hour rolling window
- **Headers**: Rate limit information included in response headers
- **Retry**: Wait for the specified `retryAfter` seconds before retrying

## Performance Considerations

- **Response Time**: Typically under 3 seconds
- **Caching**: Similar requests are cached for 30 minutes
- **Token Optimization**: Efficient prompt engineering for cost optimization
- **Batch Processing**: Multiple suggestions processed in single request
- **Async Processing**: Large content processed asynchronously

## Security Features

- **Input Sanitization**: Content is sanitized to remove potentially harmful elements
- **Rate Limiting**: Per-user and per-IP rate limiting
- **Authentication**: JWT token authentication required
- **Content Filtering**: Inappropriate content is filtered out
- **Request Size Limits**: Maximum 1MB request size

## Usage Examples

### Basic Safety Suggestion

```bash
curl -X POST "https://api.example.com/api/v1/ai/suggestions" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Workers must follow safety procedures",
    "context": "safety",
    "documentType": "policies-procedures",
    "section": "safety-procedures",
    "maxSuggestions": 3
  }'
```

### Compliance Enhancement

```bash
curl -X POST "https://api.example.com/api/v1/ai/suggestions" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Company policies must be followed",
    "context": "compliance",
    "documentType": "policies-procedures",
    "section": "compliance-requirements",
    "maxSuggestions": 5
  }'
```

### Health Check

```bash
curl -X GET "https://api.example.com/api/v1/ai/health"
```

## Environment Variables

Required environment variables:

```bash
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
```

## Monitoring and Analytics

- All requests are logged with metadata
- Processing times are tracked
- Error rates are monitored
- Usage statistics are available via `/stats` endpoint
- Cache hit rates are tracked

## Best Practices

1. **Content Length**: Keep content under 10,000 characters for optimal performance
2. **Context Selection**: Choose the most appropriate context for better suggestions
3. **Rate Limiting**: Implement client-side rate limiting to avoid hitting server limits
4. **Caching**: Cache responses on the client side for repeated requests
5. **Error Handling**: Implement proper retry logic with exponential backoff
6. **Security**: Always validate and sanitize content before sending to the API

## Support

For technical support or questions about the AI Suggestions API, please contact the development team or refer to the internal documentation.
