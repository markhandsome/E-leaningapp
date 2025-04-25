import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app as firebaseApp } from '../Authentication/Auth';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../Authentication/App';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


type PatternDraftingScreen = StackNavigationProp<RootStackParamList, 'PatternDraftingScreen'>;
const db = getFirestore();

const CourseScreen = () => {
  // Points state for each lesson
  const [task1Points, setTask1Points] = useState(0);
  const [maxPoints, setMaxPoints] = useState(100);

  const [lesson1Points, setLesson1Points] = useState(0);
  const [lesson3Points, setLesson3Points] = useState(0);
  const [lesson4Points, setLesson4Points] = useState(0);
  const [lesson5Points, setLesson5Points] = useState(0);

  // Lesson-specific video visibility states
  const [showVideo, setShowVideo] = useState(false); // Lesson 1 video
  const [showLesson4Video, setShowLesson4Video] = useState(false); // Lesson 4 video

  // Lesson 5 specific state (image upload and submission)
  const [lesson5Submitted, setLesson5Submitted] = useState(false);
  const [lesson5Image, setLesson5Image] = useState<string | null>(null);

  // Quiz states for lesson 1 and lesson 3
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [answer, setAnswer] = useState('');

  const [showQuiz3Modal, setShowQuiz3Modal] = useState(false);
  const [quiz3Answered, setQuiz3Answered] = useState(false);
  const [quiz3Answer, setQuiz3Answer] = useState('');

  const navigation = useNavigation<PatternDraftingScreen>();

  // Fetch progress and set initial states
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      const fetchProgress = async () => {
        const docRef = doc(db, 'userProgress', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const task1 = data?.task1 || {};

          const lesson1 = task1.lesson1 || 0;
          const lesson2 = task1.lesson2 || 0;
          const lesson3 = task1.lesson3 || 0;
          const lesson4 = task1.lesson4 || 0;
          const lesson5 = task1.lesson5 || 0;

          setLesson1Points(lesson1);
          setQuizAnswered(lesson2 > 0);
          setShowVideo(lesson1 === 0);
          setLesson3Points(lesson3);
          setQuiz3Answered(lesson3 > 0); // assumes quiz is the final step for lesson 3
          setLesson4Points(lesson4);
          setLesson5Points(lesson5);
          setLesson5Submitted(lesson5 > 0);

          setTask1Points(lesson1 + lesson2 + lesson3 + lesson4 + lesson5);
        } else {
          setLesson1Points(0);
          setShowVideo(true);
        }
      };

      fetchProgress();
    }
  }, []);

  // Lesson 1 functions
  const handleVideoEnd = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          lesson1: 20,
          lesson2: prev.lesson2 || 0,
          lesson3: prev.lesson3 || 0,
          lesson4: prev.lesson4 || 0,
          lesson5: prev.lesson5 || 0,
        },
      }, { merge: true });

      setLesson1Points(20);
      setShowVideo(false);
      setTask1Points(task1Points + 20);

      if (!quizAnswered) {
        setShowQuizModal(true);
      }
    }
  };

  const handleQuizSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && answer.trim().toLowerCase() === 'ruler') {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          lesson1: prev.lesson1 || 0,
          lesson2: 20,
          lesson3: prev.lesson3 || 0,
          lesson4: prev.lesson4 || 0,
          lesson5: prev.lesson5 || 0,
        },
      }, { merge: true });

      setQuizAnswered(true);
      setShowQuizModal(false);
      setTask1Points(task1Points + 20);
    } else {
      alert('Incorrect. Try again!');
    }
  };

  // Lesson 3 functions
  const handleQuiz3Submit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && quiz3Answer.trim().toLowerCase() === 'measurement') {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          ...prev,
          lesson3: 20,
        },
      }, { merge: true });

      setLesson3Points(20);
      setQuiz3Answered(true);
      setShowQuiz3Modal(false);
      setTask1Points(task1Points + 20);
    } else {
      alert('Incorrect. Try again!');
    }
  };

  const handleCompleteLesson3 = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          ...prev,
          lesson3: 20,
        },
      }, { merge: true });

      setLesson3Points(20);
      setTask1Points(task1Points + 20);
    }
  };

  // Lesson 4 functions
  const handleVideoLesson4End = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          ...prev,
          lesson4: 20,
        },
      }, { merge: true });

      setLesson4Points(20);
      setShowLesson4Video(false);
      setTask1Points(task1Points + 20);
    }
  };

  // Lesson 5 functions
  const pickAndUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const imageUri = pickerResult.assets[0].uri;

      // Upload to Firebase Storage
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `lesson5Uploads/newFolder/${user.uid}_${Date.now()}.jpg`); // Store in a new folder
        await uploadBytes(storageRef, blob);

        // Save to Firestore and mark lesson as complete (without image URL)
        const progressRef = doc(db, 'userProgress', user.uid);
        const progressSnap = await getDoc(progressRef);
        const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

        await setDoc(progressRef, {
          task1: {
            ...prev,
            lesson5: 20, // Add points for lesson 5
          },
        }, { merge: true });

        setLesson5Points(20);
        setLesson5Submitted(true);
        setTask1Points(task1Points + 20);
        alert("Upload successful!");
      }
    }
  };

  const handleLesson5Submit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

      await setDoc(progressRef, {
        task1: {
          ...prev,
          lesson5: 20,
        },
      }, { merge: true });

      setLesson5Points(20);
      setLesson5Submitted(true);
      setTask1Points(task1Points + 20);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.profile}>
          <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require('../assets/Task1.png')} style={styles.cardImage} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>pattern drafting tutorials</Text>
          <View style={styles.cardStats}>
            <Text>{task1Points} pts</Text>
            <Text>⭐ 4.3</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(task1Points / maxPoints) * 100}%` }]} />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Course Content</Text>

      {/* Lesson 1 */}
      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>01</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 1: Drafting tools</Text>
        {lesson1Points === 0 ? (
          <TouchableOpacity onPress={() => setShowVideo(true)}>
            <Ionicons name="play-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>


      {showVideo && (
        <View style={{ height: 300, marginBottom: 20 }}>
          <WebView
            source={{
              uri: 'https://www.youtube.com/watch?v=VbrphCFdU8k&list=PLlIwtAy1pUoSSLiIkPkDTHDpSgY1-i8Ae&index=1',
            }}
            javaScriptEnabled
            onLoad={() => {
              // Set a timeout for 60 seconds (or however long the video is)
              setTimeout(() => {
                handleVideoEnd();
              }, 40000); // Adjust to your video's duration
            }}
          />
        </View>
      )}

      {/* Lesson 2 */}
      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>02</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 2: Quiz</Text>
        {!quizAnswered ? (
          <TouchableOpacity onPress={() => setShowQuizModal(true)}>
            <Ionicons name="help-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>


      {/* Quiz Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQuizModal}
        onRequestClose={() => setShowQuizModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Quiz: Lesson 1</Text>
            <Text style={styles.modalQuestion}>
              What tool is commonly used to draw straight lines in pattern drafting?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your answer"
              value={answer}
              onChangeText={setAnswer}
            />
            <Pressable onPress={handleQuizSubmit} style={styles.modalButton}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>



      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>03</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 3: Pattern Measurement</Text>
        {!quiz3Answered ? (
          <TouchableOpacity onPress={() => setShowQuiz3Modal(true)}>
            <Ionicons name="help-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showQuiz3Modal}
        onRequestClose={() => setShowQuiz3Modal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Quiz: Lesson 3</Text>
            <Text style={styles.modalQuestion}>
              What is the term for taking body dimensions before drafting a pattern?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your answer"
              value={quiz3Answer}
              onChangeText={setQuiz3Answer}
            />
            <Pressable onPress={handleQuiz3Submit} style={styles.modalButton}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      {/* Lesson 4 - updated like Lesson 1 */}
      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>04</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 4: Drafting a Basic Bodice</Text>
        {lesson4Points === 0 ? (
          <TouchableOpacity onPress={() => setShowLesson4Video(true)}>
            <Ionicons name="play-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>

      {/* { Inside your return statement, for the lesson 4 video WebView} */}
      {showLesson4Video && (
        <View style={{ height: 300, marginBottom: 20 }}>
          <WebView
            source={{
              uri: 'https://www.youtube.com/watch?v=EgC6uEeIN3k&list=PLlIwtAy1pUoSSLiIkPkDTHDpSgY1-i8Ae&index=2',
            }}
            javaScriptEnabled
            onLoad={() => {
              // Set a timeout for 60 seconds (or however long the video is)
              setTimeout(() => {
                handleVideoLesson4End();
              }, 40000); // Adjust to your video's duration
            }}
          />
        </View>
      )}


      {/* Lesson 5 */}
      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>05</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 5: Upload Your First Draft</Text>

        {!lesson5Submitted ? (
          <TouchableOpacity onPress={pickAndUploadImage}>
            <Ionicons name="cloud-upload-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>


      <TouchableOpacity>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Overview:</Text>
      <Text style={styles.overviewText}>
        Learn how to use essential drafting tools and understand foundational principles in pattern drafting to begin creating
        your own clothing patterns. This course covers everything from understanding body measurements, using tools like
        rulers and curves, to drafting basic blocks such as bodices, skirts, and sleeves. You'll gain hands-on experience with
        practical tasks and video demonstrations, helping you build confidence in translating design ideas into accurate
        paper patterns. Perfect for beginners aiming to step into the world of garment construction.
      </Text>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6eff7', padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20,
  },
  profile: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  card: {
    flexDirection: 'row', marginVertical: 20, alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12,
  },
  cardImage: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', width: 100 },
  progressBar: {
    height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, marginTop: 8, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#0275d8' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 20, marginBottom: 10 },
  lessonItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  lessonNumber: { backgroundColor: '#f6eff7', borderRadius: 8, padding: 8, marginRight: 12 },
  lessonNumberText: { fontWeight: 'bold' },
  lessonTitle: { flex: 1, fontSize: 14 },
  seeMore: { textAlign: 'center', color: '#0275d8', marginVertical: 10 },
  overviewText: { fontSize: 13, color: '#333', lineHeight: 20 },
  modalBackground: {
    flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center',
  },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  modalQuestion: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
  modalButton: { backgroundColor: '#0275d8', padding: 10, borderRadius: 5 },
});

export default CourseScreen;
