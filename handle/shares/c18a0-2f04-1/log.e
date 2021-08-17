VIDEOIO ERROR: V4L: device /home/resources/recordings/CCTV_TST_ABHRA.mp4: Unable to query number of channels

(python3:8): GStreamer-CRITICAL **: 02:02:27.541: gst_element_make_from_uri: assertion 'gst_uri_is_valid (uri)' failed
GStreamer: Error opening bin: no source element for URI "/home/resources/recordings/CCTV_TST_ABHRA.mp4"
Traceback (most recent call last):
  File "vehicle.py", line 277, in <module>
    main()
  File "vehicle.py", line 132, in main
    db = MySQLdb.connect(mysql_ip, mysql_user, mysql_pwd, db=mysql_db)
  File "/usr/lib/python3/dist-packages/MySQLdb/__init__.py", line 86, in Connect
    return Connection(*args, **kwargs)
  File "/usr/lib/python3/dist-packages/MySQLdb/connections.py", line 204, in __init__
    super(Connection, self).__init__(*args, **kwargs2)
_mysql_exceptions.OperationalError: (2005, "Unknown MySQL server host 'ubuntu_db_1' (11)")
