{
    "uniqueId": "web-monitor-2nx8FA4VCB",
    "category": "Web Monitor",
    "description": "The amount of web requests per top domain.",
    "displayOrder": 315,
    "enabled": true,
    "javaClass": "com.untangle.node.reports.ReportEntry",
    "orderDesc": false,
    "units": "hits",
    "readOnly": true,
    "table": "http_events",
    "timeDataInterval": "AUTO",
    "timeDataDynamicValue": "request_id",
    "timeDataDynamicColumn": "domain",
    "timeDataDynamicLimit": "10",
    "timeDataDynamicAggregationFunction": "count",
    "timeStyle": "LINE",
    "title": "Top Domains Usage",
    "type": "TIME_GRAPH_DYNAMIC"
}
