{
    "uniqueId": "web-filter-lite-bHCInGuJp6c",
    "category": "Web Filter Lite",
    "description": "The number of web requests grouped by hostname.",
    "displayOrder": 400,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "hostname",
    "pieSumColumn": "count(*)",
    "readOnly": true,
    "table": "http_events",
    "title": "Top Hostnames (by requests)",
    "type": "PIE_GRAPH"
}
