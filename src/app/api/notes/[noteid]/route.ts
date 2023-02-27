import { createFirebaseApp } from "@/firebase/client";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export const config = {
  runtime: "nodejs",
};

const app = createFirebaseApp();
const db = getFirestore(app);

export async function GET(request: Request, { params }: any) {
  const { noteid } = params;
  const docRef = doc(db, "notes", noteid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Document data:", data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return new Response(
      JSON.stringify({ message: `Note id "${noteid}" not found` }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
