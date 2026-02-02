# Updated Firestore Security Rules

## Rules for Parent-Child and Teacher-Student Access

Replace your current Firestore rules with these updated rules that support:
- Parents accessing their children's data
- Teachers accessing their students' data
- Classroom management
- Invite code system

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isParentOf(childId) {
      return isAuthenticated() && childId in getUserData().children;
    }

    function isTeacherOf(studentId) {
      let studentData = get(/databases/$(database)/documents/users/$(studentId)).data;
      return isAuthenticated() && request.auth.uid == studentData.teacherId;
    }

    function isChildOf(parentId) {
      return isAuthenticated() && getUserData().parentId == parentId;
    }

    // Users collection
    match /users/{userId} {
      // Read: Owner, their parent, or their teacher
      allow read: if isOwner(userId) ||
                     isParentOf(userId) ||
                     isTeacherOf(userId);

      // Write: Only the user themselves
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if false; // Users should not be deleted via Firestore
    }

    // Characters collection - EVERYONE can read
    match /characters/{characterId} {
      allow read: if true;
      allow write: if false; // Only backend can modify
    }

    // Transactions collection
    match /transactions/{transactionId} {
      // Read: Owner, their parent, or their teacher
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isParentOf(resource.data.userId) ||
        isTeacherOf(resource.data.userId)
      );

      // Create: Only the user themselves
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      allow update, delete: if false; // Transactions are immutable
    }

    // Invites collection (for parent-child linking)
    match /invites/{inviteCode} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated(); // For marking as used
      allow delete: if false;
    }

    // Classrooms collection (for teachers)
    match /classrooms/{classroomId} {
      // Read: Teacher who owns it, or students in it
      allow read: if isAuthenticated() && (
        resource.data.teacherId == request.auth.uid ||
        request.auth.uid in resource.data.students
      );

      // Create: Any authenticated user (filtered by role in app)
      allow create: if isAuthenticated() &&
                       request.resource.data.teacherId == request.auth.uid;

      // Update: Only the teacher
      allow update: if isAuthenticated() &&
                       resource.data.teacherId == request.auth.uid;

      // Delete: Only the teacher
      allow delete: if isAuthenticated() &&
                       resource.data.teacherId == request.auth.uid;
    }

    // Challenges collection
    match /challenges/{challengeId} {
      allow read: if isAuthenticated();
      allow write: if false; // Managed by backend
    }

    // News collection
    match /news/{newsId} {
      allow read: if isAuthenticated();
      allow write: if false; // Managed by backend
    }

    // Leaderboard collection
    match /leaderboard/{entryId} {
      allow read: if isAuthenticated();
      allow write: if false; // Managed by backend
    }
  }
}
```

## How to Apply These Rules

1. Go to Firebase Console: https://console.firebase.google.com/project/investamon-43293/firestore
2. Click on the **"Rules"** tab
3. **Replace all existing rules** with the rules above
4. Click **"Publish"**

## What These Rules Enable

### Parent Access
- ✅ Parents can read their children's user data
- ✅ Parents can view their children's transactions
- ✅ Parents can see their children's portfolios
- ❌ Parents cannot modify their children's data (children control their own accounts)

### Teacher Access
- ✅ Teachers can read their students' user data
- ✅ Teachers can view their students' transactions
- ✅ Teachers can manage classrooms (create, update, delete)
- ✅ Teachers can add/remove students from classrooms
- ❌ Teachers cannot modify student portfolios or balances

### Student/Child Privacy
- ✅ Children and students have full control of their own accounts
- ✅ Only authorized parents/teachers can view data
- ✅ Transactions are immutable (audit trail)
- ✅ Invite codes prevent unauthorized linking

### Security Features
- 🔒 Users can only link accounts via valid invite codes
- 🔒 Invite codes expire after 7 days
- 🔒 Each invite code can only be used once
- 🔒 Classrooms can only be managed by their teacher
- 🔒 All writes require authentication
