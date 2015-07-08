{
    "uniqueId": "web-filter-lite-nH3mpvLI4o",
    "category": "Web Filter Lite",
    "description": "The number of blocked web requests grouped by domain.",
    "displayOrder": 314,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "domain",
    "pieSumColumn": "count(*)",
     "conditions": [
        {
            "column": "web_filter_lite_blocked",
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "operator": "=",
            "value": "true"
        }
    ],
   "readOnly": true,
   "table": "http_events",
   "title": "Top Blocked Domains",
   "type": "PIE_GRAPH"
}
