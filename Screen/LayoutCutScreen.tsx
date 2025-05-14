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
import Imageview from 'react-native-image-viewing';
import * as firebase from 'firebase/app';
import { Colors } from 'react-native/Libraries/NewAppScreen';


type PatternDraftingScreen = StackNavigationProp<RootStackParamList, 'PatternDraftingScreen'>;
const db = getFirestore();

const CourseScreen = () => {

  const [isImageViewVisible, setIsImageViewVisible] = useState(false); // <--- add state
  const [isImageViewVisible1, setIsImageViewVisible1] = useState(false); // <--- add state
  
  const [isImageViewVisible3, setIsImageViewVisible3] = useState(false); // <--- add state
  const [isImageViewVisible4, setIsImageViewVisible4] = useState(false); // <--- add state
  // Points state for each lesson
  const [task2Points, setTask2Points] = useState(0);
  const [maxPoints, setMaxPoints] = useState(100);

  const [lesson1Points, setLesson1Points] = useState(0);
  const [lesson2Points, setLesson2Points] = useState(0);
  const [lesson3Points, setLesson3Points] = useState(0);
  const [lesson4Points, setLesson4Points] = useState(0);
  const [lesson5Points, setLesson5Points] = useState(0);

  // Lesson-specific video visibility states
  const [showVideo, setShowVideo] = useState(false); // Lesson 1 video
  const [showLesson5Video, setShowLesson5Video] = useState(false); // Lesson 5 video





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
          const task2 = data?.task2 || {};

          const lesson1 = task2.lesson1 || 0;
          const lesson2 = task2.lesson2 || 0;
          const lesson3 = task2.lesson3 || 0;
          const lesson4 = task2.lesson4 || 0;
          const lesson5 = task2.lesson5 || 0;

          setLesson1Points(lesson1);
          setLesson2Points(lesson2);
          setShowVideo(lesson1 === 0);
          setLesson3Points(lesson3);// assumes quiz is the final step for lesson 3
          setLesson4Points(lesson4);
          setLesson5Points(lesson5);


          setTask2Points(lesson1 + lesson2 + lesson3 + lesson4 + lesson5);
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
      const prev = progressSnap.exists() ? progressSnap.data().task2 || {} : {};

      await setDoc(progressRef, {
        task2: {
          lesson1: 20,
          lesson2: prev.lesson2 || 0,
          lesson3: prev.lesson3 || 0,
          lesson4: prev.lesson4 || 0,
          lesson5: prev.lesson5 || 0,
        },
      }, { merge: true });

      setLesson1Points(20);
      setShowVideo(false);
      setTask2Points(task2Points + 20);
    }
  };

  //  {LESSON 2}
  const [showTutorialDetails, setShowTutorialDetails] = useState(false);
  const [tutorialViewed, setTutorialViewed] = useState(false);

  const handleTutorialClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task2 || {} : {};

      // Only update points if not yet given
      if (lesson2Points === 0) {
        await setDoc(progressRef, {
          task2: {
            lesson1: prev.lesson1 || 0,
            lesson2: 20,
            lesson3: prev.lesson3 || 0,
            lesson4: prev.lesson4 || 0,
            lesson5: prev.lesson5 || 0,
          },
        }, { merge: true });

        setLesson2Points(20);
        setTask2Points(task2Points + 20);
      }

      // Always toggle tutorial visibility
      setShowTutorialDetails(!showTutorialDetails);
      setTutorialViewed(true); // Mark as viewed at least once
    }
  };

  // Lesson 4 functions

  const [showTutorial3Details, setShowTutorial3Details] = useState(false);
  const [tutorial3Viewed, setTutorial3Viewed] = useState(false);


  const handleTutorial3Click = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task2 || {} : {};

      // Only update points if not yet given
      if (lesson4Points === 0) {
        await setDoc(progressRef, {
          task2: {
            lesson1: prev.lesson1 || 0,
            lesson2: prev.lesson2 || 0,
            lesson3: 20,
            lesson4: prev.lesson4 || 0,
            lesson5: prev.lesson5 || 0,
          },
        }, { merge: true });

        setLesson3Points(20);
        setTask2Points(task2Points + 20);
      }

      // Always toggle tutorial visibility
      setShowTutorial3Details(!showTutorial3Details);
      setTutorial3Viewed(true); // Mark as viewed at least once
    }
  };


  // Lesson 4 functions

  const [showTutorial4Details, setShowTutorial4Details] = useState(false);
  const [tutorial4Viewed, setTutorial4Viewed] = useState(false);


  const handleTutorial4Click = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task2 || {} : {};

      // Only update points if not yet given
      if (lesson4Points === 0) {
        await setDoc(progressRef, {
          task2: {
            lesson1: prev.lesson1 || 0,
            lesson2: prev.lesson2 || 0,
            lesson3: prev.lesson3 || 0,
            lesson4: 20,
            lesson5: prev.lesson5 || 0,
          },
        }, { merge: true });

        setLesson4Points(20);
        setTask2Points(task2Points + 20);
      }

      // Always toggle tutorial visibility
      setShowTutorial4Details(!showTutorial4Details);
      setTutorial4Viewed(true); // Mark as viewed at least once
    }
  };





  // Lesson 5 functions
  const handleVideoLesson5End = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const progressRef = doc(db, 'userProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const prev = progressSnap.exists() ? progressSnap.data().task2 || {} : {};

      await setDoc(progressRef, {
        task2: {
          ...prev,
          lesson5: 20,
        },
      }, { merge: true });

      setLesson5Points(20);
      setShowLesson5Video(false);
      setTask2Points(task2Points + 20);
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
        <Image source={require('../assets/Task2.png')} style={styles.cardImage} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>How to layout and cut tutorials</Text>
          <View style={styles.cardStats}>
            <Text>{task2Points} pts</Text>
            <Text>⭐ 4.0</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(task2Points / maxPoints) * 100}%` }]} />
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
              uri: 'https://www.youtube.com/watch?v=UWjc4yt0DDk&t=4s',
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
      <TouchableOpacity onPress={handleTutorialClick}
        style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>02</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 2: Basic Sewing & Pattern Jargon</Text>

        <TouchableOpacity onPress={handleTutorialClick}>
          {lesson2Points > 0 || tutorialViewed ? (
            <Ionicons name="checkmark-circle" size={28} color="green" />
          ) : (
            <Ionicons name="book-outline" size={28} color="#000" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {showTutorialDetails && (
        <Modal
          visible={showTutorialDetails}
          animationType="slide"
          onRequestClose={() => setShowTutorialDetails(false)}
        >

          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowTutorialDetails(false)}
              style={{
                position: 'absolute',
                top: 40, // adjust based on your app header if needed
                right: 20,
                zIndex: 1,
                backgroundColor: '#eee',
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#00000' }}>Close</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 40 }}>
              Basic Sewing & Pattern Jargon</Text>
            <Text>• Grainline: The line on the pattern that marks how it should align with the fabric grain.</Text>
            <Text>• Selvage: The uncut edge of woven fabric that won’t fray; on knits it may curl or look glued.</Text>
            <Text>• DOGS (Direction of Greatest Stretch): The axis along which stretch fabric stretches the most.</Text>
            <Text>• Bias: A 45° line to the grainline—wovens cut on bias have extra give.</Text>
            <Text>• Right Side / Wrong Side: Right side faces out; wrong side is the interior surface.</Text>
            <Text>• Fabric, Lining, Interfacing: Materials: fashion fabric, lining pieces, and interfacing for support.</Text>

            <Text>Pattern Drafting: Front Bodice Sloper</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Objectives:</Text>
            <Text>a. List measurements needed for a front bodice pattern.</Text>
            <Text>b. Apply exact measurements to draft the pattern.</Text>
            <Text>c. Demonstrate accurate front bodice drafting.</Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Introduction:</Text>
            <Text>Extend construction lines, adjust for body shape, and add allowances to develop the front from the back bodice.</Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Measurements Needed:</Text>
            <Text>• Figure Front</Text>
            <Text>• Shoulder</Text>
            <Text>• Bust Circumference</Text>
            <Text>• Waistline</Text>
            <Text>• Bust Height</Text>
            <Text>• Bust Distance</Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Materials Needed:</Text>
            <Text>• French curve</Text>
            <Text>• Hip curve</Text>
            <Text>• Tape measure</Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Procedure:</Text>
            <Text>• Draw construction line Y to Z.</Text>
            <Text>• a-b: Back figure length, square lines.</Text>
            <Text>• a-c: 3” down.</Text>
            <Text>• a-d: Bust height.</Text>
            <Text>• a-e: 2¼”.</Text>
            <Text>• a-g: ½ shoulder, square down.</Text>
            <Text>• a-h: ¼ bust +1”.</Text>
            <Text>• g-f: 1” back from g, square down.</Text>
            <Text>• e-i: 1½” down.</Text>
            <Text>• j-i: 4”.</Text>
            <Text>• j-k₂: 2” down, square k₁ to k₂.</Text>
            <Text>• d-n: ½ bust distance.</Text>
            <Text>• b-l: ¼ waist +1½”.</Text>
            <Text>• o-p/q: ¾ measurements.</Text>
            <Text>• l-l₂: ½ up, connect with hip curve.</Text>

            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/fabric.jpg')}
                style={{ width: '100%', height: 300, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[{ uri: Image.resolveAssetSource(require('../assets/fabric.jpg')).uri }]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </ScrollView>


        </Modal>
      )}

      {/* Lesson 3 */}
      <TouchableOpacity onPress={handleTutorial3Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>03</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 3: Fabric Layout & Cutting</Text>
        <TouchableOpacity onPress={handleTutorial3Click}>
          {lesson3Points > 0 || tutorial3Viewed ? (
            <Ionicons name="checkmark-circle" size={28} color="green" />
          ) : (
            <Ionicons name="book-outline" size={28} color="#000" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {showTutorial3Details && (
        <Modal
          visible={showTutorial3Details}
          animationType="slide"
          onRequestClose={() => setShowTutorial3Details(false)}
        >
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowTutorial3Details(false)}
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                zIndex: 1,
                backgroundColor: '#eee',
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 40 }}>
              Fabric Layout & Cutting Tutorial
            </Text>

            {/* Objectives */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Objectives:</Text>
            <Text style={{ marginBottom: 5 }}>• Understand grainline and fold placement for efficient layout.</Text>
            <Text style={{ marginBottom: 5 }}>• Arrange pattern pieces to minimize fabric waste.</Text>
            <Text style={{ marginBottom: 5 }}>• Execute accurate cutting along marked lines.</Text>

            {/* Introduction */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Introduction:</Text>
            <Text style={{ marginBottom: 10 }}>
              Proper fabric layout ensures your garment pieces are cut on grain, fit together correctly, and reduce wasted yardage.
              We’ll cover straight-grain vs bias, single-layer and folded layouts, and the safe use of cutting tools.
            </Text>

            {/* Materials Needed */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Materials Needed:</Text>
            <Text style={{ marginBottom: 5 }}>• Fabric (pre-washed and pressed)</Text>
            <Text style={{ marginBottom: 5 }}>• Pattern pieces (with grain arrows marked)</Text>
            <Text style={{ marginBottom: 5 }}>• Sharp fabric shears or rotary cutter</Text>
            <Text style={{ marginBottom: 5 }}>• Cutting mat (for rotary cutter)</Text>
            <Text style={{ marginBottom: 5 }}>• Weights or pins to hold patterns</Text>
            <Text style={{ marginBottom: 5 }}>• Tailor’s chalk or washable marker</Text>

            {/* Procedure */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Procedure:</Text>
            <Text style={{ marginBottom: 5 }}>1. Lay fabric on a flat surface, selvages aligned. Press any wrinkles.</Text>
            <Text style={{ marginBottom: 5 }}>2. Identify fabric grain: pull a small snip to see warp (lengthwise) vs weft (crosswise).</Text>
            <Text style={{ marginBottom: 5 }}>3. Place pattern pieces: align grain arrow parallel to selvage. Use single-layer for directional prints, fold for symmetrical pieces.</Text>
            <Text style={{ marginBottom: 5 }}>4. Pin or weight pattern edges. Ensure no fabric shifting under pieces.</Text>
            <Text style={{ marginBottom: 5 }}>5. Mark around pieces with chalk, including notches and drill holes.</Text>
            <Text style={{ marginBottom: 5 }}>6. Cut slowly with fabric shears or rotary cutter, keeping blade vertical.</Text>
            <Text style={{ marginBottom: 5 }}>7. Transfer marks (notches, darts) to fabric using snips or tailor’s tacks.</Text>
            <Text style={{ marginBottom: 5 }}>8. Double-check that all pieces are cut (front, back, facings, linings).</Text>

            {/* Layout Diagram */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Layout Diagrams:</Text>
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/layout-guide.jpg')}
                style={{ width: '100%', height: 200, marginTop: 10, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Cutting Diagram */}
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/cutting-diagram.jpg')}
                style={{ width: '100%', height: 200, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[
                { uri: Image.resolveAssetSource(require('../assets/layout-guide.jpg')).uri },
                { uri: Image.resolveAssetSource(require('../assets/cutting-diagram.jpg')).uri }
              ]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </ScrollView>
        </Modal>
      )}



      {/* Lesson 4 */}
      <TouchableOpacity onPress={handleTutorial4Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>04</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 4:How to Read a Sewing Pattern        </Text>

        <TouchableOpacity onPress={handleTutorial4Click}>
          {lesson4Points > 0 || tutorial4Viewed ? (
            <Ionicons name="checkmark-circle" size={28} color="green" />
          ) : (
            <Ionicons name="book-outline" size={28} color="#000" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {showTutorial4Details && (
        <Modal
          visible={showTutorial4Details}
          animationType="slide"
          onRequestClose={() => setShowTutorial4Details(false)}
        >
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowTutorial4Details(false)}
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                zIndex: 1,
                backgroundColor: '#eee',
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Close</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 40 }}>
              How to Read a Sewing Pattern
            </Text>

            {/* Procedure */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Lesson:</Text>
            <Text style={{ marginBottom: 5 }}>All patterns are a little different, especially now since there are so many PDF pattern designers and each one does things a little different.

              Understanding how to read a sewing pattern has changed a bit in the last 10 years. However, most patterns have similar pattern markings to help you identify what to do or where something is located on the pattern.

              Each pattern designer usually uses their own set of markings and the more you use that designers patterns, the easier it is to learn to read their patterns.</Text>

            {/* Image */}
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/readsewing.png')}
                style={{ width: '100%', height: 300, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[{ uri: Image.resolveAssetSource(require('../assets/readsewing.png')).uri }]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />

            {/* To obtain shape */}

            <Text style={{ marginBottom: 5 }}>These markings will be found on the actual pattern pieces and you'll need them to know how to lay your fabric out for cutting and where to mark for things like buttonhole placement or zippers.
            </Text>


            {/* Image */}
            <TouchableOpacity onPress={() => setIsImageViewVisible1(true)}>
              <Image
                source={require('../assets/layering.png')}
                style={{ width: '100%', height: 300, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[{ uri: Image.resolveAssetSource(require('../assets/layering.png')).uri }]}
              imageIndex={0}
              visible={isImageViewVisible1}
              onRequestClose={() => setIsImageViewVisible1(false)}
            />

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>How to Layout a Sewing Pattern for Cutting Patterns:</Text>
            <Text style={{ marginBottom: 5 }}>   Okay, now we need to know a little bit about how to read a sewing pattern.  This is where understanding the Fabric Anatomy becomes important.  Each pattern has different "parts" or anatomy as does fabric.

              Lay your fabric on a flat surface.  If your pattern says to "Cut 2", you'll want to fold your fabric half with your selvages together.  (If you are unfamiliar with the word selvage, check out our Fabric Anatomy post.)  Notice the selvages are on the right side and the fold is on the left.</Text>


            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>What if my sewing pattern says mirror or mirror image?:</Text>

            <Text style={{ marginBottom: 5 }}>This is a fairly new term we see in many PDF patterns.  If your pattern says "mirror" or "mirror image" this means the designer wants you to cut 2 pieces of the pattern that are exactly opposite of each other.

              Why?  Well, do you have a right leg and a left leg?  Or a right side of your bodice and a left?  This ensures that your pattern pieces are opposite from each other and you don't end up with 2 right leg pieces.  (Been there, done that).

              Easiest way to cut "mirror images" is to have your fabric folded in half like the example above and then pin your pattern. </Text>


            {/* Image */}
            <TouchableOpacity onPress={() => setIsImageViewVisible3(true)}>
              <Image
                source={require('../assets/layering2.png')}
                style={{ width: '100%', height: 300, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[{ uri: Image.resolveAssetSource(require('../assets/layering2.png')).uri }]}
              imageIndex={0}
              visible={isImageViewVisible3}
              onRequestClose={() => setIsImageViewVisible3(false)}
            />

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>How to Find the Grainline on a Pattern:</Text>

            <Text style={{ marginBottom: 5 }}>Before you start pinning your pattern down, you want to ensure your pattern is on grain.

              Why does this matter?

              Well, have you ever had an article of clothing that always pulled to one side or the other.  That is because the fabric wasn't cut on grain and once sewn it always pulls to try and get on grain again.

              First thing to do is find the grainline on your pattern.  This should be a line on the pattern and should be marked.  The grainline should always be parallel with the selvage.  Even if your grainline is crosswise or bias, it will need to be parallel to the selvage.   </Text>

            {/* Image */}
            <TouchableOpacity onPress={() => setIsImageViewVisible4(true)}>
              <Image
                source={require('../assets/layering3.png')}
                style={{ width: '100%', height: 300, marginTop: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Image Viewer */}
            <Imageview
              images={[{ uri: Image.resolveAssetSource(require('../assets/layering3.png')).uri }]}
              imageIndex={0}
              visible={isImageViewVisible4}
              onRequestClose={() => setIsImageViewVisible4(false)}
            />


            <Text style={{ marginBottom: 5 }}>To ensure this, grab your tape measure.  Line your tape measure up at the top of the grainline across to the selvage.  Take that measurement.  So below it is about 6.75".  Now pin the top of your grainline to the fabric. </Text>


            <Text style={{ marginBottom: 5 }}> Move your tape measure down to the bottom edge of the grainline.  Measure from grainline to selvage.  This should measure the same as the top edge.</Text>
            <Text style={{ marginBottom: 5 }}>If it doesn't, move your pattern piece until it does.  Then pin.  That is how you ensure your pattern is on grain.  Now you can finish pinning and start cutting out your fabric pieces.</Text>

            
          </ScrollView>
        </Modal>
      )}



      {/* // Lesson 5 - updated like Lesson 4 */}
      <View style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>05</Text>
        </View>
        <Text style={styles.lessonTitle}>Lesson 5: Drafting a Basic Skirt</Text>
        {lesson5Points === 0 ? (
          <TouchableOpacity onPress={() => setShowLesson5Video(true)}>
            <Ionicons name="play-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
      </View>

      {/* Lesson 5 Video Viewer */}
      {showLesson5Video && (
        <View style={{ height: 300, marginBottom: 20 }}>
          <WebView
            source={{
              uri: 'https://youtu.be/0dYTv7eUFG4', // <-- replace with correct video link
            }}
            javaScriptEnabled
            onLoad={() => {
              // Set a timeout to simulate watching the video
              setTimeout(() => {
                handleVideoLesson5End();
              }, 70000); // adjust based on video length if needed
            }}
          />
        </View>
      )}

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
