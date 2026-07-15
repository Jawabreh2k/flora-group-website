# Jobs API Fallback System

This document explains the resilient jobs API architecture that gracefully degrading when the CMS backend is unavailable.

## Architecture Overview

The jobs API has two layers:

1. **Primary**: CMS API (`FLORA_API_URL/api/jobs`) — dynamic, always current, managed via admin portal
2. **Fallback**: Seed data (`data/jobs-seed.json`) — static snapshot, survives backend outages

### Request Flow

```
Client → /api/jobs → Try CMS API (5s timeout)
                    └─ Success: return CMS data + cache
                    └─ Failure: load seed data + log fallback
```

When the CMS is unreachable, users still see job listings (the fallback seed data). This prevents "jobs are down" during maintenance or incidents.

## Managing Seed Data

### When to Update

Update `data/jobs-seed.json` when:

- Adding or removing permanent job listings
- Changing fallback company information
- Syncing with CMS seed defaults (e.g., after bulk import to CMS)

### File Format

```json
{
  "items": [
    {
      "id": "unique-job-id",
      "title": "Job Title",
      "department": "Department Name",
      "locationType": "ONSITE" | "HYBRID" | "REMOTE",
      "locationText": "Doha, Qatar",
      "jobType": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN",
      "salaryRange": null | "range string",
      "closingDate": null | "2024-12-31T23:59:59Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "company": {
        "id": "unique-company-id",
        "name": "Company Name",
        "logoUrl": null | "url",
        "website": "https://..."
      }
    }
  ],
  "totalCount": 6,
  "page": 1,
  "pageSize": 12,
  "hasNextPage": false
}
```

**Important**: Validation is strict. Any missing fields or invalid enum values will cause seed loading to fail.

### Validation

The seed loader (`lib/jobs/seed.ts`) validates:

- All required fields are present and correct type
- Enums (`locationType`, `jobType`) are valid
- Pagination metadata is consistent
- Company objects have required fields

Invalid seed data will be rejected and logged; users get a 503 error with a message to try again later.

## Monitoring

### Log Markers

Watch logs for these indicators:

- `[jobs-api] Falling back to seed data` — CMS API is unreachable
- `[jobs-api] CMS responded 500` — CMS error (5xx)
- `[jobs-seed] Failed to load seed data` — Seed file is corrupted or missing
- `[job-detail-api] Falling back to seed data` — Individual job detail using fallback

### Response Headers

When serving fallback data, responses include:

```
X-Fallback-Source: seed-data
Cache-Control: public, max-age=60
```

Monitor for these headers in your observability platform to track fallback usage.

## Detail View Degradation

When the CMS is down, job detail pages show:

- Title, department, location, company (from seed)
- Placeholder description: _"For full details about this position, please contact us..."_
- Stub requirements & responsibilities (generic)
- Job still appears to be open

This is intentional: users can apply, operations team is alerted, details are restored once CMS recovers.

## Deployment

1. Edit `data/jobs-seed.json` with new listings
2. No build step required — seed is read at runtime
3. Deploy and monitor logs for any seed-load errors
4. On CMS recovery, seed data is abandoned; CMS data takes over

## Future Enhancements

- Add i18n support to seed (currently English only)
- Extend seed to include full job descriptions (currently placeholders)
- Implement seed update via admin portal export
- Add timestamp tracking for seed age vs. CMS age
