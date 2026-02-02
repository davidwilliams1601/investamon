import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';
import { registerUser } from './authService';

/**
 * Generate a unique invite code for child/student accounts
 */
export const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

/**
 * Create an invite code for a parent/teacher to share
 * @param {string} parentId - Parent or teacher user ID
 * @param {string} role - 'parent' or 'teacher'
 * @returns {Promise<string>} - Invite code
 */
export const createInviteCode = async (parentId, role = 'parent') => {
  try {
    const inviteCode = generateInviteCode();
    const inviteRef = doc(db, 'invites', inviteCode);

    await setDoc(inviteRef, {
      code: inviteCode,
      createdBy: parentId,
      createdByRole: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      used: false,
      usedBy: null
    });

    return inviteCode;
  } catch (error) {
    console.error('Error creating invite code:', error);
    throw error;
  }
};

/**
 * Link a child account to a parent using an invite code
 * @param {string} childId - Child user ID
 * @param {string} inviteCode - Invite code from parent
 */
export const linkChildToParent = async (childId, inviteCode) => {
  try {
    return await runTransaction(db, async (transaction) => {
      const inviteRef = doc(db, 'invites', inviteCode);
      const inviteDoc = await transaction.get(inviteRef);

      if (!inviteDoc.exists()) {
        throw new Error('Invalid invite code');
      }

      const invite = inviteDoc.data();

      if (invite.used) {
        throw new Error('This invite code has already been used');
      }

      if (new Date() > invite.expiresAt.toDate()) {
        throw new Error('This invite code has expired');
      }

      const parentId = invite.createdBy;
      const parentRef = doc(db, 'users', parentId);
      const childRef = doc(db, 'users', childId);

      const parentDoc = await transaction.get(parentRef);
      const childDoc = await transaction.get(childRef);

      if (!parentDoc.exists() || !childDoc.exists()) {
        throw new Error('User not found');
      }

      // Update parent's children array
      transaction.update(parentRef, {
        children: arrayUnion(childId)
      });

      // Update child's parent field
      transaction.update(childRef, {
        parentId: parentId
      });

      // Mark invite as used
      transaction.update(inviteRef, {
        used: true,
        usedBy: childId,
        usedAt: new Date()
      });

      return { parentId, childId };
    });
  } catch (error) {
    console.error('Error linking child to parent:', error);
    throw error;
  }
};

/**
 * Create a child account directly (for parent creating child account)
 * @param {string} parentId - Parent user ID
 * @param {object} childData - Child account data (name, age, email, password)
 */
export const createChildAccount = async (parentId, childData) => {
  try {
    // Create Firebase auth account for child
    const childUser = await registerUser(childData.email, childData.password, {
      name: childData.name,
      role: 'child',
      age: childData.age
    });

    // Link child to parent
    const parentRef = doc(db, 'users', parentId);
    const childRef = doc(db, 'users', childUser.uid);

    await updateDoc(parentRef, {
      children: arrayUnion(childUser.uid)
    });

    await updateDoc(childRef, {
      parentId: parentId
    });

    return childUser;
  } catch (error) {
    console.error('Error creating child account:', error);
    throw error;
  }
};

/**
 * Get all children for a parent
 * @param {string} parentId - Parent user ID
 * @returns {Promise<Array>} - Array of child user objects
 */
export const getChildrenAccounts = async (parentId) => {
  try {
    const parentDoc = await getDoc(doc(db, 'users', parentId));
    if (!parentDoc.exists()) {
      throw new Error('Parent not found');
    }

    const childrenIds = parentDoc.data().children || [];
    if (childrenIds.length === 0) {
      return [];
    }

    const childrenPromises = childrenIds.map(childId =>
      getDoc(doc(db, 'users', childId))
    );

    const childrenDocs = await Promise.all(childrenPromises);
    return childrenDocs
      .filter(doc => doc.exists())
      .map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching children accounts:', error);
    throw error;
  }
};

/**
 * Unlink a child from a parent
 * @param {string} parentId - Parent user ID
 * @param {string} childId - Child user ID
 */
export const unlinkChild = async (parentId, childId) => {
  try {
    const parentRef = doc(db, 'users', parentId);
    const childRef = doc(db, 'users', childId);

    await updateDoc(parentRef, {
      children: arrayRemove(childId)
    });

    await updateDoc(childRef, {
      parentId: null
    });

    return true;
  } catch (error) {
    console.error('Error unlinking child:', error);
    throw error;
  }
};

// ============= TEACHER FEATURES =============

/**
 * Create a classroom for a teacher
 * @param {string} teacherId - Teacher user ID
 * @param {object} classroomData - Classroom info (name, grade, subject)
 */
export const createClassroom = async (teacherId, classroomData) => {
  try {
    const classroomRef = doc(collection(db, 'classrooms'));
    await setDoc(classroomRef, {
      name: classroomData.name,
      grade: classroomData.grade || null,
      subject: classroomData.subject || null,
      teacherId: teacherId,
      students: [],
      createdAt: new Date(),
      isActive: true
    });

    // Update teacher's classrooms list
    const teacherRef = doc(db, 'users', teacherId);
    await updateDoc(teacherRef, {
      classrooms: arrayUnion(classroomRef.id)
    });

    return classroomRef.id;
  } catch (error) {
    console.error('Error creating classroom:', error);
    throw error;
  }
};

/**
 * Add a student to a classroom
 * @param {string} classroomId - Classroom ID
 * @param {string} studentId - Student user ID
 */
export const addStudentToClassroom = async (classroomId, studentId) => {
  try {
    const classroomRef = doc(db, 'classrooms', classroomId);
    const studentRef = doc(db, 'users', studentId);

    await updateDoc(classroomRef, {
      students: arrayUnion(studentId)
    });

    await updateDoc(studentRef, {
      classrooms: arrayUnion(classroomId)
    });

    return true;
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    throw error;
  }
};

/**
 * Bulk create student accounts for a classroom
 * @param {string} teacherId - Teacher user ID
 * @param {string} classroomId - Classroom ID
 * @param {Array} studentsData - Array of student data objects
 */
export const bulkCreateStudents = async (teacherId, classroomId, studentsData) => {
  try {
    const results = [];

    for (const studentData of studentsData) {
      try {
        // Generate email if not provided (e.g., firstname.lastname@classroom.investamon.com)
        const email = studentData.email ||
          `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@classroom.investamon.com`;

        // Generate temporary password
        const tempPassword = generateInviteCode() + '123!';

        // Create student account
        const student = await registerUser(email, tempPassword, {
          name: studentData.name,
          role: 'student',
          age: studentData.age
        });

        // Add to classroom
        await addStudentToClassroom(classroomId, student.uid);

        // Link to teacher
        await updateDoc(doc(db, 'users', student.uid), {
          teacherId: teacherId
        });

        results.push({
          success: true,
          studentId: student.uid,
          email: email,
          tempPassword: tempPassword,
          name: studentData.name
        });
      } catch (error) {
        results.push({
          success: false,
          name: studentData.name,
          error: error.message
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error bulk creating students:', error);
    throw error;
  }
};

/**
 * Get all students in a classroom
 * @param {string} classroomId - Classroom ID
 */
export const getClassroomStudents = async (classroomId) => {
  try {
    const classroomDoc = await getDoc(doc(db, 'classrooms', classroomId));
    if (!classroomDoc.exists()) {
      throw new Error('Classroom not found');
    }

    const studentIds = classroomDoc.data().students || [];
    if (studentIds.length === 0) {
      return [];
    }

    const studentsPromises = studentIds.map(studentId =>
      getDoc(doc(db, 'users', studentId))
    );

    const studentsDocs = await Promise.all(studentsPromises);
    return studentsDocs
      .filter(doc => doc.exists())
      .map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching classroom students:', error);
    throw error;
  }
};

/**
 * Get all classrooms for a teacher
 * @param {string} teacherId - Teacher user ID
 */
export const getTeacherClassrooms = async (teacherId) => {
  try {
    const q = query(
      collection(db, 'classrooms'),
      where('teacherId', '==', teacherId),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching teacher classrooms:', error);
    throw error;
  }
};
