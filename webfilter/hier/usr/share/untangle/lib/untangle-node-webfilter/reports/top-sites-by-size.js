{
    "uniqueId": "web-filter-lite-jJCjp8rCFy8",
    "category": "Web Filter Lite",
    "description": "The sum of the size of requested web content grouped by website.",
    "displayOrder": 301,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "bytes",
    "pieGroupColumn": "host",
    "pieSumColumn": "coalesce(sum(s2c_content_length),0)",
    "readOnly": true,
    "table": "http_events",
    "title": "Top Sites (by size)",
    "type": "PIE_GRAPH"
}



