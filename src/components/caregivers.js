import {
  doc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const retrieveData = async () => {
  const caregiverCollection = collection(db, "caregivers");
  const caregiverSnapshot = await getDocs(caregiverCollection);
  const caregiverList = caregiverSnapshot.docs.map((doc) => doc.data());
  return caregiverList;
};

retrieveData().then((caregiverList) => {
  console.log(caregiverList); // Logs the list of caregivers
});

const updateData = async () => {
  const caregiverRef = doc(db, "caregivers", `${myUserUid}`);

  // New data to update
  const updatedData = { phone: newPhone, email: newEmail }; // replace with actual new phone and email

  await updateDoc(caregiverRef, updatedData);
};

updateData().then(() => {
  console.log("Caregiver data updated");
});

const deleteData = async () => {
  const caregiverRef = doc(db, "caregivers", `${myUserUid}`);

  await deleteDoc(caregiverRef);
};

deleteData().then(() => {
  console.log("Caregiver data deleted");
});

const retrieveSpecificData = async () => {
  const caregiverCollection = collection(db, "caregivers");
  const q = query(caregiverCollection, where("email", "==", specificEmail)); // replace specificEmail with the email you're looking for

  const querySnapshot = await getDocs(q);
  const specificCaregivers = querySnapshot.docs.map((doc) => doc.data());
  return specificCaregivers;
};

retrieveSpecificData().then((specificCaregivers) => {
  console.log(specificCaregivers); // Logs the list of caregivers with the specific email
});
