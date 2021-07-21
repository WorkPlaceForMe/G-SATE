VIDEOIO ERROR: V4L: device /home/resources/recordings/demo_test.mp4: Unable to query number of channels

(python3:12): GStreamer-CRITICAL **: 02:02:37.961: gst_element_make_from_uri: assertion 'gst_uri_is_valid (uri)' failed
GStreamer: Error opening bin: no source element for URI "/home/resources/recordings/demo_test.mp4"
/home/src/client/use/mysql.py:17: Warning: (1007, "Can't create database 'gsate'; database exists")
  self.cursor.execute('create database if not exists {}'.format(self.table.split('.')[0]))
/home/src/client/use/mysql.py:20: Warning: (1050, "Table 'person_gsate' already exists")
  self.cursor.execute('create table if not exists {} {}'.format(self.table, self.get_all(columns)))
