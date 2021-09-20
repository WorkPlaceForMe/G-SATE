Traceback (most recent call last):
  File "person.py", line 271, in <module>
    main()
  File "person.py", line 130, in main
    db = MySQLdb.connect(mysql_ip, mysql_user, mysql_pwd, db=mysql_db)
  File "/usr/lib/python3/dist-packages/MySQLdb/__init__.py", line 86, in Connect
    return Connection(*args, **kwargs)
  File "/usr/lib/python3/dist-packages/MySQLdb/connections.py", line 204, in __init__
    super(Connection, self).__init__(*args, **kwargs2)
_mysql_exceptions.OperationalError: (2005, "Unknown MySQL server host 'ubuntu_db_1' (11)")
FATAL: exception not rethrown
/home/src/client/run.sh: line 2:    11 Aborted                 (core dumped) python3 -u person.py
