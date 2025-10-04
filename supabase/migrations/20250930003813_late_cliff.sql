@@ .. @@
 -- 建立管理員測試帳號
 INSERT INTO admin_users (
   id, name, email, password_hash, status
 ) VALUES (
   '00000000-0000-0000-0000-000000000003',
   '系統管理員',
   'admin@blackfeather.com',
   'QURNSU4xMjM=',
   'active'
-);
+) ON CONFLICT (email) DO UPDATE SET
+  name = EXCLUDED.name,
+  password_hash = EXCLUDED.password_hash,
+  status = EXCLUDED.status;
 
 -- 建立測試司機帳號
 INSERT INTO users (
   id, phone_number, phone, email, full_name, name, password_hash, 
   role, status, verification_status, phone_verified, total_rides, rating
 ) VALUES (
   '00000000-0000-0000-0000-000000000002',
   '0982214855',
   '0982214855',
   'driver@blackfeather.com',
   '測試司機',
   '測試司機',
   'Qk9TUzA4MDE3',
   'driver',
   'active',
   'approved',
   true,
   156,
   4.8
-) ON CONFLICT (id) DO NOTHING;
+) ON CONFLICT (id) DO UPDATE SET
+  phone_number = EXCLUDED.phone_number,
+  phone = EXCLUDED.phone,
+  email = EXCLUDED.email,
+  role = EXCLUDED.role,
+  status = EXCLUDED.status,
+  verification_status = EXCLUDED.verification_status;
 
 -- 建立測試乘客帳號
 INSERT INTO users (
   id, phone_number, phone, email, full_name, name, password_hash, 
   role, status, verification_status, phone_verified, total_rides, rating
 ) VALUES (
   '00000000-0000-0000-0000-000000000001',
   '0912345678',
   '0912345678',
   'passenger@blackfeather.com',
   '測試乘客',
   '測試乘客',
   'dGVzdDEyMw==',
   'user',
   'active',
   'approved',
   true,
   15,
   4.9
-) ON CONFLICT (id) DO NOTHING;
+) ON CONFLICT (id) DO UPDATE SET
+  phone_number = EXCLUDED.phone_number,
+  phone = EXCLUDED.phone,
+  email = EXCLUDED.email,
+  role = EXCLUDED.role,
+  status = EXCLUDED.status,
+  verification_status = EXCLUDED.verification_status;