VIDEOIO ERROR: V4L: device /home/resources/recordings/cctv_footage222321.mp4: Unable to query number of channels

(python3:9): GStreamer-CRITICAL **: 02:02:24.107: gst_element_make_from_uri: assertion 'gst_uri_is_valid (uri)' failed
GStreamer: Error opening bin: no source element for URI "/home/resources/recordings/cctv_footage222321.mp4"
Traceback (most recent call last):
  File "person.py", line 271, in <module>
    main()
  File "person.py", line 130, in main
    db = MySQLdb.connect(mysql_ip, mysql_user, mysql_pwd, db=mysql_db)
  File "/usr/lib/python3/dist-packages/MySQLdb/__init__.py", line 86, in Connect
    return Connection(*args, **kwargs)
  File "/usr/lib/python3/dist-packages/MySQLdb/connections.py", line 204, in __init__
    super(Connection, self).__init__(*args, **kwargs2)
_mysql_exceptions.OperationalError: (2003, "Can't connect to MySQL server on 'ubuntu_db_1' (111)")
