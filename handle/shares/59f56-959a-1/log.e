/home/src/client/use/mysql.py:17: Warning: (1007, "Can't create database 'gsate'; database exists")
  self.cursor.execute('create database if not exists {}'.format(self.table.split('.')[0]))
/home/src/client/use/mysql.py:20: Warning: (1050, "Table 'vehicle_gsate' already exists")
  self.cursor.execute('create table if not exists {} {}'.format(self.table, self.get_all(columns)))
Traceback (most recent call last):
  File "vehicle.py", line 266, in <module>
    main()
  File "vehicle.py", line 262, in main
    process2.stdin.close()
UnboundLocalError: local variable 'process2' referenced before assignment
