# Feature Implementation Guide
## Parent-Child Linking & Teacher Accounts

This guide explains how to implement the UI for the new account linking features.

---

## 🎯 Overview

We've created the backend services for:
1. **Parent-Child Linking** - Parents can create and manage child accounts
2. **Teacher-Student Management** - Teachers can manage classrooms and students
3. **Invite Code System** - Secure account linking via invite codes

**Service File:** `client/src/firebase/accountLinkingService.js`

---

## 📋 Implementation Checklist

### Phase 1: Parent-Child Features (Priority: HIGH)

#### 1.1 Parent Dashboard Updates
**File to create:** `client/src/pages/ParentDashboard.js`

```jsx
// Key features:
- Display list of linked children
- Button to "Add Child Account"
- View each child's portfolio summary
- Quick stats: Total family balance, active investments
```

**Functions to use:**
- `getChildrenAccounts(parentId)` - Fetch all children
- `getPortfolio(childId)` - Fetch child's portfolio (from portfolioService)

#### 1.2 Add Child Account Modal
**File to create:** `client/src/components/AddChildModal.js`

Two options for parents:
1. **Create New Child Account** - Parent creates credentials for child
2. **Generate Invite Code** - Child creates their own account and joins

```jsx
// Option 1: Direct creation
- Form fields: name, age, email, password
- Call: createChildAccount(parentId, childData)

// Option 2: Invite code
- Button: "Generate Invite Code"
- Call: createInviteCode(parentId, 'parent')
- Display code to share with child
```

#### 1.3 Child Registration with Invite Code
**File to update:** `client/src/pages/Register.js`

```jsx
// Add optional "Invite Code" field to registration form
- If invite code provided: role = 'child'
- After registration: call linkChildToParent(childId, inviteCode)
```

#### 1.4 Child Account View (for Parents)
**File to create:** `client/src/pages/ChildAccountView.js`

```jsx
// Parent views child's account
- Child's portfolio (read-only for parent)
- Transaction history
- Performance metrics
- Option to set spending limits (future feature)
```

---

### Phase 2: Teacher Features (Priority: MEDIUM)

#### 2.1 Teacher Dashboard
**File to create:** `client/src/pages/TeacherDashboard.js`

```jsx
// Key features:
- List of classrooms
- Button to "Create New Classroom"
- Overview: Total students, active classes
- Quick access to class leaderboards
```

**Functions to use:**
- `getTeacherClassrooms(teacherId)`

#### 2.2 Create Classroom Modal
**File to create:** `client/src/components/CreateClassroomModal.js`

```jsx
// Form fields:
- Classroom name (e.g., "Grade 6 - Financial Literacy")
- Grade level (optional)
- Subject (optional)

// Call: createClassroom(teacherId, classroomData)
```

#### 2.3 Classroom View
**File to create:** `client/src/pages/ClassroomView.js`

```jsx
// Features:
- List of students in classroom
- Add student (manual or bulk)
- Classroom leaderboard
- Class-wide challenges (future)
- Student performance overview
```

**Functions to use:**
- `getClassroomStudents(classroomId)`
- `addStudentToClassroom(classroomId, studentId)`

#### 2.4 Bulk Student Creation
**File to create:** `client/src/components/BulkStudentUpload.js`

```jsx
// CSV upload feature:
- Template: name, age, email (optional)
- Generate temporary passwords
- Create all accounts at once
- Display results (success/failures)
- Download credentials for students

// Call: bulkCreateStudents(teacherId, classroomId, studentsData)
```

---

### Phase 3: Role-Based Navigation (Priority: HIGH)

#### 3.1 Update App Routing
**File to update:** `client/src/App.js`

```jsx
// Role-based dashboard routing
- 'parent' → ParentDashboard
- 'child' → Dashboard (student view)
- 'teacher' → TeacherDashboard
- 'student' → Dashboard (student view)
```

#### 3.2 Update Navigation Bar
**File to update:** Navigation component

```jsx
// Add role-based menu items:
- Parent: "My Children", "Family Portfolio"
- Teacher: "My Classrooms", "Students"
- Child/Student: Standard menu
```

---

## 🛠️ Step-by-Step Implementation Plan

### Week 1: Parent-Child Core Features
1. **Day 1-2:** Create `ParentDashboard.js` with children list
2. **Day 3:** Build `AddChildModal.js` with both creation methods
3. **Day 4:** Update `Register.js` to support invite codes
4. **Day 5:** Create `ChildAccountView.js` for parents

### Week 2: Teacher Features
1. **Day 1-2:** Build `TeacherDashboard.js` and classroom management
2. **Day 3:** Create `ClassroomView.js` with student list
3. **Day 4:** Implement `BulkStudentUpload.js` CSV import
4. **Day 5:** Add classroom leaderboards

### Week 3: Polish & Testing
1. **Day 1-2:** Role-based routing and navigation
2. **Day 3:** Error handling and loading states
3. **Day 4-5:** Testing and bug fixes

---

## 🎨 UI Components Needed

### New Components to Create

1. **`ParentDashboard.js`** - Parent's main view
2. **`AddChildModal.js`** - Create/invite child accounts
3. **`ChildAccountView.js`** - View child's portfolio
4. **`TeacherDashboard.js`** - Teacher's main view
5. **`CreateClassroomModal.js`** - Create new classroom
6. **`ClassroomView.js`** - Manage classroom and students
7. **`BulkStudentUpload.js`** - CSV upload for students
8. **`InviteCodeDisplay.js`** - Show invite code to share
9. **`StudentCard.js`** - Display student in classroom list
10. **`ChildCard.js`** - Display child in parent dashboard

---

## 🔐 Security Rules Update

**IMPORTANT:** Before implementing any UI, update Firestore security rules!

1. Go to Firebase Console → Firestore → Rules
2. Copy rules from `FIRESTORE_RULES_UPDATED.md`
3. Publish the new rules

These rules enable:
- Parents to read (not write) their children's data
- Teachers to read (not write) their students' data
- Classroom management permissions

---

## 🧪 Testing Checklist

### Parent-Child Features
- [ ] Parent can create child account directly
- [ ] Parent can generate invite code
- [ ] Child can register with invite code
- [ ] Parent sees child in their dashboard
- [ ] Parent can view child's portfolio (read-only)
- [ ] Parent cannot modify child's portfolio
- [ ] Invite code expires after 7 days
- [ ] Used invite codes cannot be reused

### Teacher Features
- [ ] Teacher can create classroom
- [ ] Teacher can add students to classroom
- [ ] Teacher can bulk upload students via CSV
- [ ] Teacher sees all classrooms in dashboard
- [ ] Teacher can view student portfolios (read-only)
- [ ] Students see their classrooms
- [ ] Students cannot modify classroom settings

### Role-Based Access
- [ ] Parent role → redirects to ParentDashboard
- [ ] Teacher role → redirects to TeacherDashboard
- [ ] Child/Student role → standard Dashboard
- [ ] Navigation shows role-appropriate menu items

---

## 📊 Database Schema

### Users Collection (Updated)
```javascript
{
  id: "user_uid",
  email: "user@example.com",
  name: "User Name",
  role: "parent" | "child" | "teacher" | "student",
  age: 12,
  balance: 10000,
  portfolio: [],
  experience: 0,
  level: 1,

  // Parent-Child linking
  parentId: "parent_uid" | null,
  children: ["child_uid_1", "child_uid_2"],

  // Teacher-Student linking
  teacherId: "teacher_uid" | null,
  classrooms: ["classroom_id_1"],

  // Settings
  spendingLimit: 1000,
  requiresApproval: true,
  createdAt: timestamp
}
```

### Invites Collection (New)
```javascript
{
  code: "ABC123XY",
  createdBy: "parent_uid",
  createdByRole: "parent" | "teacher",
  createdAt: timestamp,
  expiresAt: timestamp,
  used: false,
  usedBy: "child_uid" | null,
  usedAt: timestamp | null
}
```

### Classrooms Collection (New)
```javascript
{
  id: "classroom_id",
  name: "Grade 6 - Financial Literacy",
  grade: 6,
  subject: "Financial Literacy",
  teacherId: "teacher_uid",
  students: ["student_uid_1", "student_uid_2"],
  createdAt: timestamp,
  isActive: true
}
```

---

## 🚀 Quick Start

### 1. Test the Service Functions (Console)
```javascript
// Import in browser console or test file
import {
  createInviteCode,
  linkChildToParent,
  getChildrenAccounts,
  createClassroom,
  bulkCreateStudents
} from './firebase/accountLinkingService';

// Create an invite code
const code = await createInviteCode('parent_user_id', 'parent');
console.log('Invite code:', code);

// Get children
const children = await getChildrenAccounts('parent_user_id');
console.log('Children:', children);
```

### 2. Build First Component
Start with the simplest: **`AddChildModal.js`**

1. Create the file
2. Add Material-UI Dialog
3. Form with name, email, password fields
4. Button to create child account
5. Call `createChildAccount()` on submit

### 3. Test in Development
```bash
cd client
npm start
```

Navigate to parent dashboard and test creating a child account.

---

## 💡 Pro Tips

1. **Use React Context for Role**: Store user role in AuthContext for easy access
2. **Loading States**: All async operations should show loading spinners
3. **Error Boundaries**: Wrap new components in error boundaries
4. **Responsive Design**: Test on mobile (parents/teachers likely use mobile)
5. **CSV Template**: Provide downloadable CSV template for bulk upload
6. **Copy Invite Code**: Add "Copy to Clipboard" button for invite codes
7. **Expiry Warning**: Show countdown for invite code expiry
8. **Success Messages**: Show toast notifications for successful actions

---

## 🎓 School Market Features (Future)

Once core features are stable, consider:

1. **School Admin Role**
   - Manage multiple teachers
   - School-wide leaderboards
   - Bulk teacher account creation

2. **Parent Notifications**
   - Email parents when teacher adds student
   - Weekly progress reports
   - Achievement notifications

3. **Classroom Competitions**
   - Class vs class challenges
   - School-wide investment competitions
   - Collaborative portfolio projects

4. **Curriculum Integration**
   - Pre-built lesson plans
   - Educational content library
   - Assessment tools

5. **Reporting & Analytics**
   - Teacher reports on student progress
   - Parent reports on child activity
   - School-wide usage statistics

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify Firestore rules are published
3. Check Firebase Console for security rule errors
4. Test service functions in isolation first
5. Use React DevTools to debug state issues

---

**Ready to start?** Begin with updating the Firestore rules, then implement the parent-child features first (highest value for users).
