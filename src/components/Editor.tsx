"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { createFirebaseApp } from "@/firebase/client";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const app = createFirebaseApp();
const db = getFirestore(app);

function TypingAndSavingIndicator(props: {
  noteid: string;
  value: string;
  typing: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const { noteid, value, typing } = props;
  useEffect(() => {
    if (typing) {
      return;
    }
    const save = async () => {
      const docRef = doc(db, "notes", noteid);
      if (value === (await getDoc(docRef)).data()!.text) {
        return;
      }
      setSaving(true);
      await setDoc(docRef, { text: value }, { merge: true });
      setSaving(false);
    };
    save();
  }, [typing, noteid, value]);

  if (typing) {
    return <div>typing</div>;
  }
  return <div>{saving ? "saving" : "saved"}</div>;
}

export default function Editor(props: { noteid: string; data?: any }) {
  const { noteid, data } = props;
  const text = data?.text;
  const [value, setValue] = useState(text);
  const [typing, setTyping] = useState(false);
  const handle = useRef<any>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "notes", noteid), (doc) => {
      const newData = doc.data();
      console.log("Current data: ", newData);
      setValue(newData!.text);
    });
    return unsub;
  }, [noteid]);
  return (
    <div>
      <TypingAndSavingIndicator {...{ noteid, value, typing }} />
      <textarea
        name={noteid}
        value={value}
        onChange={(e) => {
          setTyping(true);
          const newValue = e.target.value;
          setValue(newValue);
          if (handle.current) {
            clearTimeout(handle.current);
          }
          handle.current = setTimeout(() => {
            setTyping(false);
          }, 1000);
        }}
      />
    </div>
  );
}
