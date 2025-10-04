@@ .. @@
 -- 修復 RLS 政策
+DROP POLICY IF EXISTS "Allow anonymous user registration" ON users;
+DROP POLICY IF EXISTS "Users can read own data" ON users;
+DROP POLICY IF EXISTS "Users can update own data" ON users;
+DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON users;
 DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
 DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
+DROP POLICY IF EXISTS "Allow authenticated users to manage drivers" ON drivers;
+DROP POLICY IF EXISTS "Allow service role full access" ON drivers;
+DROP POLICY IF EXISTS "Allow authenticated users to manage vehicles" ON vehicles;
+DROP POLICY IF EXISTS "Allow service role full access" ON vehicles;
+DROP POLICY IF EXISTS "Users can create orders" ON rides;
+DROP POLICY IF EXISTS "Users can read own orders" ON rides;
+DROP POLICY IF EXISTS "Drivers can update assigned orders" ON rides;
+DROP POLICY IF EXISTS "Users can create payments" ON payments;
+DROP POLICY IF EXISTS "Users can read own payments" ON payments;
 
 CREATE POLICY "Allow all operations for authenticated users" ON users
 FOR ALL TO authenticated USING (true) WITH CHECK (true);
 
 CREATE POLICY "Allow anonymous registration" ON users
 FOR INSERT TO anon WITH CHECK (true);