{
    "uniqueId": "web-filter-lite-DAzMWYzOGY1",
    "category": "Web Filter Lite",
    "description": "The number of flagged web requests grouped by website.",
    "displayOrder": 302,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "host",
    "pieSumColumn": "count(*)",
     "conditions": [
        {
            "column": "web_filter_lite_flagged",
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "operator": "=",
            "value": "true"
        }
    ],
   "readOnly": true,
   "table": "http_events",
   "title": "Top Flagged Sites",
   "type": "PIE_GRAPH"
}
