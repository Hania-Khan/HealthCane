import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Table, Row, Rows } from "react-native-table-component";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PushNotification from "react-native-push-notification";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const MedicationReminders = () => {
  const [medication, setMedication] = useState("");
  const [frequency, setFrequency] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [medications, setMedications] = useState([]);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [user, setUser] = useState(null);
  const [reminderDateText, setReminderDateText] = useState("");
  const [reminderTimeText, setReminderTimeText] = useState("");
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMedications(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchMedications = async (userId) => {
    const q = query(collection(db, "medicines"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const meds = [];
    querySnapshot.forEach((doc) => {
      meds.push({ id: doc.id, ...doc.data() });
    });
    setMedications(meds);
  };

  // Function to format date and time for display
  const formatDate = (date) => {
    return (
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getDate()).slice(-2) +
      "/" +
      date.getFullYear()
    );
  };

  const formatTime = (date) => {
    return (
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2)
    );
  };

  const addMedication = async () => {
    if (medication === "" || frequency === "") {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    const newMedication = {
      medication,
      frequency,
      additionalDetails,
      date: reminderDate,
    };

    try {
      const docRef = await setDoc(doc(collection(db, "medicines")), {
        ...newMedication,
        userId: user.uid,
      });

      setMedications([...medications, { id: docRef.id, ...newMedication }]);
      scheduleNotification(newMedication);

      setMedication("");
      setFrequency("");
      setAdditionalDetails("");
      setReminderDate(new Date());
      setReminderDateText("");
      setReminderTimeText("");
    } catch (error) {
      Alert.alert("Error", "Could not add medication.");
    }
  };

  const scheduleNotification = (medication) => {
    PushNotification.localNotificationSchedule({
      message: `Time to take your medicine: ${medication.medication}`,
      date: medication.date,
      allowWhileIdle: true,
    });
  };

  const onDelete = async (id) => {
    // Ask for confirmation before deleting medication
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "medicines", id));
              setMedications(medications.filter((med) => med.id !== id));
            } catch (error) {
              Alert.alert("Error", "Could not delete medication.");
            }
          },
        },
      ]
    );
  };

  const onEdit = (med) => {
    setMedication(med.medication);
    setFrequency(med.frequency.toString());
    setAdditionalDetails(med.additionalDetails);
    setReminderDate(new Date(med.date));
    setReminderDateText(formatDate(new Date(med.date)));
    setReminderTimeText(formatTime(new Date(med.date)));
    setSelectedMedicationId(med.id);
    setShowUpdateButton(true);
  };

  const updateMedication = async () => {
    if (!selectedMedicationId) {
      Alert.alert("Error", "No medication selected for update.");
      return;
    }

    const updatedMedication = {
      medication,
      frequency,
      additionalDetails,
      date: reminderDate,
    };

    try {
      console.log("Updating medication with ID:", selectedMedicationId);
      console.log("Updated medication details:", updatedMedication);
      console.log("Reminder date:", reminderDate);

      await updateDoc(
        doc(db, "medicines", selectedMedicationId),
        updatedMedication
      );

      setMedications(
        medications.map((med) =>
          med.id === selectedMedicationId
            ? { ...med, ...updatedMedication }
            : med
        )
      );

      setMedication("");
      setFrequency("");
      setAdditionalDetails("");
      setReminderDate(new Date());
      setReminderDateText("");
      setReminderTimeText("");
      setSelectedMedicationId(null);
      setShowUpdateButton(false);

      Alert.alert("Success", "Medication updated successfully.");
    } catch (error) {
      console.error("Error updating medication:", error);
      Alert.alert("Error", `Could not update medication: ${error.message}`);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderDate;
    setShowDatePicker(false);
    setReminderDate(currentDate);
    setReminderDateText(formatDate(currentDate));
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || reminderDate;
    setShowTimePicker(false);
    setReminderDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setHours(currentTime.getHours());
      updatedDate.setMinutes(currentTime.getMinutes());
      return updatedDate;
    });
    setReminderTimeText(formatTime(currentTime));
  };

  const tableData = medications.map((med) => [
    med.medication,
    med.frequency,
    med.additionalDetails,

    <View style={styles.rowButtons}>
      <TouchableOpacity style={styles.updateButton} onPress={() => onEdit(med)}>
        <MaterialIcons name="edit" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(med.id)}
      >
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>,
  ]);

  const chartData = {
    labels: medications.map((med) => med.medication.substring(0, 4)), // Display truncated medication names
    datasets: [
      {
        data: medications.map((med) => parseInt(med.frequency)),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Medication Reminders</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Medication Name"
          value={medication}
          onChangeText={setMedication}
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency (times per day)"
          value={frequency}
          keyboardType="numeric"
          onChangeText={setFrequency}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Additional Details / Instructions"
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar" size={20} color="#fff" />
          <Text style={styles.buttonText}>Set Reminder Date</Text>
        </TouchableOpacity>
        <Text>{reminderDateText}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Icon name="clock-o" size={20} color="#fff" />
          <Text style={styles.buttonText}>Set Reminder Time</Text>
        </TouchableOpacity>
        <Text>{reminderTimeText}</Text>

        {showDatePicker && (
          <DateTimePicker
            value={reminderDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={reminderDate}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {showUpdateButton ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={updateMedication}
          >
            <Text style={styles.buttonText}>Update Medication</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={addMedication}>
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={["Medication", "Frequency", "Details", "Actions"]}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Medication Frequency Chart</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 30}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#008CBA",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "#f0ad4e",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  dateButton: {
    backgroundColor: "#5cb85c",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
  },
  tableContainer: {
    marginBottom: 20,
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default MedicationReminders;
