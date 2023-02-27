import React from "react";
import { createFirebaseApp } from "@/firebase/client";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const app = createFirebaseApp();
const db = getFirestore(app);

async function getNoteById(noteid: string) {
  const docRef = doc(db, "notes", noteid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { data };
  }
  return { error: "Not Found" };
}

export default async function Page({ params }: any) {
  const { noteid } = params;
  const { data, error } = await getNoteById(noteid);
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {noteid}: {data!.text}
    </div>
  );
}
