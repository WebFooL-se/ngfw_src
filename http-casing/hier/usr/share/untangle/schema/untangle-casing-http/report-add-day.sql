-- reports start for release-4.1
-- $HeadURL$
-- Copyright (c) 2003-2007 Untangle, Inc. 
--
-- This program is free software; you can redistribute it and/or modify
-- it under the terms of the GNU General Public License, version 2,
-- as published by the Free Software Foundation.
--
-- This program is distributed in the hope that it will be useful, but
-- AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
-- NONINFRINGEMENT.  See the GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program; if not, write to the Free Software
-- Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
--

--------------------------------------------------------------------------------
-- Create master tables as necessary, ignore errors if already present.
SET search_path TO reports,events,public;

CREATE TABLE webpages (
        request_id int8 NOT NULL,
        time_stamp timestamp NOT NULL,
        hname text,
        uid text,
        c_client_addr inet,
        c_server_addr inet,
        c_server_port int4,
        host text,
        content_length int4);

-- Just in case
DELETE FROM ONLY reports.webpages;


--------------------------------------------------------------------------------
-- Do the day
DROP TABLE webpages_:dayname;
CREATE TABLE webpages_:dayname (
    CHECK (time_stamp >= TIMESTAMP :daybegin AND time_stamp < TIMESTAMP :dayend)
) INHERITS (webpages);

-- This ugliness with GROUP BY is because we may have more than one reply for
-- a given request.  Aaron is checking on why this is true.  10/06 jdi
DROP TABLE newpages;
CREATE TABLE newpages AS
  SELECT max(evt.event_id) as event_id, max(evt.request_id) as request_id,
         host, COALESCE(max(resp.content_length), 0) as content_length,
         max(evt.time_stamp) as time_stamp
      FROM n_http_evt_req evt
      LEFT OUTER JOIN n_http_evt_resp resp ON
             (evt.request_id = resp.request_id AND resp.content_length > 0)
      WHERE evt.time_stamp >= TIMESTAMP :daybegin AND evt.time_stamp <= TIMESTAMP :dayend
      GROUP BY evt.event_id, host;

INSERT INTO webpages_:dayname
  SELECT evt.request_id, evt.time_stamp, COALESCE(NULLIF(name, ''), HOST(c_client_addr)) AS hname,
         stats.uid, c_client_addr, c_server_addr, c_server_port, evt.host, evt.content_length
    FROM newpages evt
      JOIN n_http_req_line line USING (request_id)
      JOIN pl_endp endp ON (line.pl_endp_id = endp.event_id)
      JOIN pl_stats stats ON (line.pl_endp_id = stats.pl_endp_id)
      LEFT OUTER JOIN merged_address_map mam ON (endp.c_client_addr = mam.addr AND
                 evt.time_stamp >= mam.start_time AND evt.time_stamp < mam.end_time);

DROP TABLE newpages;

CREATE INDEX webpages_reqid_idx_:dayname ON webpages_:dayname (request_id);
CREATE INDEX webpages_ts_idx_:dayname ON webpages_:dayname (time_stamp);
CREATE INDEX webpages_hname_idx_:dayname ON webpages_:dayname (hname);
CREATE INDEX webpages_uid_idx_:dayname ON webpages_:dayname (uid);
