# System Test Quick Guide
## How to Test the Complete System

---

## 🚀 Quick Test Instructions

### Test 1: Driver Flow (5 minutes)

**Step 1: Register as Driver**
```
1. Go to: /auth/register
2. Fill all 6 steps
3. Submit application
4. Note your application ID
```

**Step 2: Admin Approval**
```
1. Login as admin: /admin/auth/login
   - Username: admin
   - Password: ADMIN123
2. Go to "Driver Application Review"
3. Find your application
4. Click "Approve"
```

**Step 3: Driver Login & Go Online**
```
1. Login with your driver credentials
2. Click "Go Online" button
3. Status changes to Online
```

**Step 4: Accept a Ride**
```
1. Wait for ride request (or create one from passenger side)
2. Click "Accept"
3. Drive to pickup
4. Click "Start Ride"
5. Complete ride
6. Collect payment
```

---

### Test 2: Passenger Flow (3 minutes)

**Step 1: Register as Passenger**
```
1. Go to: /passenger/auth/register
2. Fill registration form
3. Enter phone verification code (sent to you)
4. Complete registration
```

**Step 2: Request a Ride**
```
1. Login with your credentials
2. Go to map page
3. Select pickup location
4. Select destination
5. View estimated fare
6. Confirm request
```

**Step 3: Track Ride**
```
1. Wait for driver to accept
2. See driver details
3. Track driver in real-time
4. Ride completes
5. Make payment
6. Rate driver
```

---

### Test 3: Admin Panel (2 minutes)

**Admin Login**
```
URL: /admin/auth/login
Username: admin
Password: ADMIN123
```

**Check Dashboard**
```
1. View statistics
2. See pending applications (red badge)
3. View online drivers
4. View active rides
```

**Approve Applications**
```
1. Click "Driver Application Review"
2. View all applications
3. Click "View Details" on any application
4. Click "Approve" or "Reject"
```

**Monitor Rides**
```
1. Click "Order Management"
2. See all rides
3. Filter by status
4. View detailed information
5. Track ride history
```

---

## 🧪 Test with Existing Accounts

### Ready-to-Use Accounts:

**Admin:**
```
URL: /admin/auth/login
Username: admin
Password: ADMIN123
Role: Full system control
```

**Driver (Already Approved):**
```
URL: /auth/login
Phone: 0982214855
Password: BOSS08017
Status: Active, can go online immediately
```

**Passenger:**
```
URL: /passenger/auth/login
Phone: 0912345678
Password: test123
Status: Verified, can request rides
```

---

## 📋 Complete Flow Test Script

### End-to-End Test (10 minutes)

**Setup:**
1. Open 3 browser windows:
   - Window 1: Admin
   - Window 2: Driver
   - Window 3: Passenger

**Step 1: Admin Preparation**
```
Window 1 (Admin):
1. Login as admin
2. Go to Dashboard
3. Keep this window open
```

**Step 2: Driver Goes Online**
```
Window 2 (Driver):
1. Login as driver (0982214855 / BOSS08017)
2. Click "Go Online"
3. Wait for ride requests
```

**Step 3: Passenger Requests Ride**
```
Window 3 (Passenger):
1. Login as passenger (0912345678 / test123)
2. Go to map
3. Select pickup: 台北車站
4. Select destination: 松山機場
5. Confirm request
```

**Step 4: Driver Accepts**
```
Window 2 (Driver):
1. Notification appears
2. Click "Accept Ride"
3. Click "Arrived at Pickup"
4. Click "Start Ride"
```

**Step 5: Admin Monitors**
```
Window 1 (Admin):
1. Go to "Order Management"
2. See the active ride
3. View real-time status
4. Check driver location
```

**Step 6: Complete Ride**
```
Window 2 (Driver):
1. Click "Complete Ride"
2. Collect payment

Window 3 (Passenger):
1. Select payment method
2. Confirm payment
3. Rate driver (optional)
```

**Step 7: Verify in Admin**
```
Window 1 (Admin):
1. Refresh orders page
2. See completed ride
3. Check payment status
4. View ride details
```

✅ **Test Complete!**

---

## 🔍 What to Check

### Driver Side:
- ✅ Registration submission works
- ✅ Cannot login before approval
- ✅ Can login after approval
- ✅ Go Online/Offline works
- ✅ Receives ride notifications
- ✅ Can accept rides
- ✅ Status updates work
- ✅ Payment collection works

### Passenger Side:
- ✅ Registration works
- ✅ Phone verification works
- ✅ Can create ride requests
- ✅ Can see driver details
- ✅ Real-time tracking works
- ✅ Payment methods available
- ✅ Can rate drivers

### Admin Side:
- ✅ Can view all applications
- ✅ Can approve/reject
- ✅ Dashboard shows stats
- ✅ Can see all rides
- ✅ Real-time monitoring works
- ✅ Can manage drivers
- ✅ Can manage passengers

---

## 🐛 Common Issues & Solutions

### Issue 1: Cannot Login
**Solution:** Check if account is approved (for drivers) or verified (for passengers)

### Issue 2: No Ride Notifications
**Solution:** Make sure driver is online (is_online = true)

### Issue 3: Database Errors
**Solution:** Check RLS policies are enabled and correct

### Issue 4: Payment Not Recording
**Solution:** Check rides.payment_completed field and payments table

---

## 📊 Database Quick Checks

### Check Driver Status:
```sql
SELECT id, name, phone, is_online, work_status
FROM drivers
WHERE id = 'DRIVER_ID';
```

### Check Ride Status:
```sql
SELECT id, status, passenger_id, driver_id,
       pickup_address, destination_address, total_fare, payment_completed
FROM rides
WHERE id = 'RIDE_ID';
```

### Check Pending Applications:
```sql
SELECT id, full_name, phone_number, status, submitted_at
FROM driver_applications
WHERE status = 'pending'
ORDER BY submitted_at DESC;
```

### Check Online Drivers:
```sql
SELECT d.id, d.name, d.phone, d.is_online, d.work_status, d.current_lat, d.current_lng
FROM drivers d
WHERE d.is_online = true
ORDER BY d.last_seen DESC;
```

---

## 🎯 Success Criteria

The system passes if:
- ✅ Driver can register and get approved
- ✅ Driver can go online/offline
- ✅ Passenger can register with phone verification
- ✅ Passenger can request rides
- ✅ Driver can accept and complete rides
- ✅ Payment is recorded correctly
- ✅ Admin can see and manage everything
- ✅ All status changes are tracked
- ✅ No database errors
- ✅ No RLS policy violations

---

## 📞 Test Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connections
3. Check RLS policies
4. Review the COMPLETE_SYSTEM_TEST_REPORT.md for details
5. Ensure all migrations have been applied

---

**Happy Testing!** 🎉
