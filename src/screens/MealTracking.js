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

const MealTracking = () => {
  const [meal, setMeal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [meals, setMeals] = useState([]);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [user, setUser] = useState(null);
  const [reminderDateText, setReminderDateText] = useState("");
  const [reminderTimeText, setReminderTimeText] = useState("");
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMeals(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchMeals = async (userId) => {
    const q = query(collection(db, "meals"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const mels = [];
    querySnapshot.forEach((doc) => {
      mels.push({ id: doc.id, ...doc.data() });
    });
    setMeals(mels);
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

  const addMeal = async () => {
    if (meal === "" || quantity === "") {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    const newMeal = {
      meal,
      quantity,
      additionalDetails,
      date: reminderDate,
    };

    try {
      const docRef = await setDoc(doc(collection(db, "meals")), {
        ...newMeal,
        userId: user.uid,
      });

      setMeals([...meals, { id: docRef.id, ...newMeal }]);
      scheduleNotification(newMeal);

      setMeal("");
      setQuantity("");
      setAdditionalDetails("");
      setReminderDate(new Date());
      setReminderDateText("");
      setReminderTimeText("");
    } catch (error) {
      Alert.alert("Error", "Could not add meal.");
    }
  };

  const scheduleNotification = (meal) => {
    PushNotification.localNotificationSchedule({
      message: `Time to take your meal: ${meal.meal}`,
      date: meal.date,
      allowWhileIdle: true,
    });
  };

  const onDelete = async (id) => {
    // Ask for confirmation before deleting meal
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this meal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "meals", id));
              setMeals(meals.filter((mel) => mel.id !== id));
            } catch (error) {
              Alert.alert("Error", "Could not delete meal.");
            }
          },
        },
      ]
    );
  };

  const onEdit = (mel) => {
    setMeal(mel.meal);
    setQuantity(mel.quantity.toString());
    setAdditionalDetails(mel.additionalDetails);
    setReminderDate(new Date(mel.date));
    setReminderDateText(formatDate(new Date(mel.date)));
    setReminderTimeText(formatTime(new Date(mel.date)));
    setSelectedMealId(mel.id);
    setShowUpdateButton(true);
  };

  const updateMeal = async () => {
    if (!selectedMealId) {
      Alert.alert("Error", "No meal selected for update.");
      return;
    }

    const updatedMeal = {
      meal,
      quantity,
      additionalDetails,
      date: reminderDate,
    };

    try {
      console.log("Updating meal with ID:", selectedMealId);
      console.log("Updated meal details:", updatedMeal);
      console.log("Reminder date:", reminderDate);

      await updateDoc(doc(db, "meals", selectedMealId), updatedMeal);

      setMeals(
        meals.map((mel) =>
          mel.id === selectedMealId ? { ...mel, ...updatedMeal } : mel
        )
      );

      setMeal("");
      setQuantity("");
      setAdditionalDetails("");
      setReminderDate(new Date());
      setReminderDateText("");
      setReminderTimeText("");
      setSelectedMealId(null);
      setShowUpdateButton(false);

      Alert.alert("Success", "Meal updated successfully.");
    } catch (error) {
      console.error("Error updating meal:", error);
      Alert.alert("Error", `Could not update meal: ${error.message}`);
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

  const tableData = meals.map((mel) => [
    mel.meal,
    mel.quantity,
    mel.additionalDetails,

    <View style={styles.rowButtons}>
      <TouchableOpacity style={styles.updateButton} onPress={() => onEdit(mel)}>
        <MaterialIcons name="edit" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(mel.id)}
      >
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>,
  ]);

  const chartData = {
    labels: meals.map((mel) => mel.meal.substring(0, 4)), // Display truncated meal names
    datasets: [
      {
        data: meals.map((mel) => parseInt(mel.quantity)),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Meal Reminders</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={meal}
          onChangeText={setMeal}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (times per day)"
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
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
          <TouchableOpacity style={styles.updateButton} onPress={updateMeal}>
            <Text style={styles.buttonText}>Update Meal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={addMeal}>
            <Text style={styles.buttonText}>Add Meal</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={["Meal", "Quantity", "Details", "Actions"]}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Meal Quantity Chart</Text>
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

export default MealTracking;
