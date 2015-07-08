{
    "uniqueId": "web-filter-lite-dbFMxf1J1W",
    "category": "Web Filter Lite",
    "description": "The number of web requests grouped by username.",
    "displayOrder": 600,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "username",
    "pieSumColumn": "count(*)",
    "readOnly": true,
    "table": "http_events",
    "title": "Top Usernames (by requests)",
    "type": "PIE_GRAPH"
}
