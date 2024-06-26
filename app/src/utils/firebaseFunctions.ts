// src/firebaseFunctions.ts
import { collection, setDoc, getDocs, deleteDoc, doc, where, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { getResumeText } from "./resumeUtils/resumeText";

interface Resume {
    id: string;
    label: string;
    url: string;
    fileName: string;
    resumeText: string;
}
export const addResume = async (file: File, label: string): Promise<string> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        
        // Create a new document reference with a unique ID
        const docRef = doc(collection(db, "resumes"));
        const docId = docRef.id;
        
        // Upload file to Storage using the document ID as the file name
        const storageRef = ref(storage, `resumes/${user.uid}/${docId}`);
        await uploadBytes(storageRef, file);
        
        // Get download URL
        const url = await getDownloadURL(storageRef);

        // Add document to Firestore
        await setDoc(docRef, { 
            userId: user.uid, 
            label, 
            url,
            fileName: file.name,
            fileType: file.type,
            createdAt: serverTimestamp()
        });

        // Get resume text
        const resumeText = await getResumeText(docId);
        await updateDoc(docRef, { resumeText });

        console.log("Resume added successfully with ID:", docId);
        return docId;
    } catch (error) {
        console.error("Error adding resume:", error);
        throw error;
    }
};

export const getResumes = async (): Promise<Resume[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(collection(db, "resumes"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        label: doc.data().label as string,
        url: doc.data().url as string,
        fileName: doc.data().fileName as string,
        resumeText: doc.data().resumeText as string
    }));
};

export const deleteResume = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Delete from Storage
        const storageRef = ref(storage, `resumes/${user.uid}/${id}`);
        await deleteObject(storageRef);

        // Delete from Firestore
        await deleteDoc(doc(db, "resumes", id));

        console.log("Resume deleted successfully:", id);
    } catch (error) {
        console.error("Error deleting resume:", error);
        throw error;
    }
};