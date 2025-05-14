import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app as firebaseApp } from '../Authentication/Auth';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../Authentication/App';
import { getAuth } from 'firebase/auth';
import ImageViewing from 'react-native-image-viewing';

type PatternDraftingScreen = StackNavigationProp<RootStackParamList, 'PatternDraftingScreen'>;
const db = getFirestore(firebaseApp);

const CourseScreen = () => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [task1Points, setTask1Points] = useState(0);
  const [maxPoints] = useState(100);
  const [showMore, setShowMore] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsShown, setCongratsShown] = useState(false);

  const [lesson1Points, setLesson1Points] = useState(0);
  const [lesson12Points, setLesson12Points] = useState(0);
  const [lesson13Points, setLesson13Points] = useState(0);
  const [lesson14Points, setLesson14Points] = useState(0);
  const [lesson15Points, setLesson15Points] = useState(0);
  const [lesson16Points, setLesson16Points] = useState(0);
  const [lesson17Points, setLesson17Points] = useState(0);

  const [showLesson1Details, setShowLesson1Details] = useState(false);
  const [lesson1Viewed, setLesson1Viewed] = useState(false);
  const [showLesson12Details, setShowLesson12Details] = useState(false);
  const [lesson12Viewed, setLesson12Viewed] = useState(false);
  const [showLesson13Video, setShowLesson13Video] = useState(false);
  const [lesson13Viewed, setLesson13Viewed] = useState(false);
  const [showLesson14Video, setShowLesson14Video] = useState(false);
  const [lesson14Viewed, setLesson14Viewed] = useState(false);
  const [showLesson15Video, setShowLesson15Video] = useState(false);
  const [lesson15Viewed, setLesson15Viewed] = useState(false);
  const [showLesson16Video, setShowLesson16Video] = useState(false);
  const [lesson16Viewed, setLesson16Viewed] = useState(false);
  const [showLesson17Video, setShowLesson17Video] = useState(false);
  const [lesson17Viewed, setLesson17Viewed] = useState(false);

  const navigation = useNavigation<PatternDraftingScreen>();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      const fetchProgress = async () => {
        try {
          const docRef = doc(db, 'userProgress', userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const task1 = data?.task1 || {};

            setLesson1Points(task1.lesson1 || 0);
            setLesson12Points(task1.lesson12 || 0);
            setLesson13Points(task1.lesson13 || 0);
            setLesson14Points(task1.lesson14 || 0);
            setLesson15Points(task1.lesson15 || 0);
            setLesson16Points(task1.lesson16 || 0);
            setLesson17Points(task1.lesson17 || 0);

            setLesson13Viewed(!!task1.lesson13);
            setLesson14Viewed(!!task1.lesson14);
            setLesson15Viewed(!!task1.lesson15);
            setLesson16Viewed(!!task1.lesson16);
            setLesson17Viewed(!!task1.lesson17);

            setCongratsShown(!!task1.congratsShown);

            const totalPoints =
              (task1.lesson1 || 0) +
              (task1.lesson12 || 0) +
              (task1.lesson13 || 0) +
              (task1.lesson14 || 0) +
              (task1.lesson15 || 0) +
              (task1.lesson16 || 0) +
              (task1.lesson17 || 0);

            setTask1Points(totalPoints);
            if (totalPoints === maxPoints && !task1.congratsShown) {
              setShowCongratsModal(true);
            }
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      };

      fetchProgress();
    }
  }, []);

  const handleModuleCompletion = async (
    lessonKey: string,
    setPoints: (points: number) => void,
    setDetails: (show: boolean) => void,
    setViewed: (viewed: boolean) => void,
    currentPoints: number,
    pointsToAdd: number
  ) => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      try {
        const progressRef = doc(db, 'userProgress', userId);
        const progressSnap = await getDoc(progressRef);
        const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

        if (currentPoints === 0) {
          await setDoc(
            progressRef,
            {
              task1: {
                ...prev,
                [lessonKey]: pointsToAdd,
              },
            },
            { merge: true }
          );

          setPoints(pointsToAdd);
          setTask1Points((prev) => {
            const newTotal = prev + pointsToAdd;
            if (newTotal === maxPoints && !congratsShown) {
              setShowCongratsModal(true);
            }
            return newTotal;
          });
        }

        setDetails(true);
        setViewed(true);
      } catch (error) {
        console.error(`Error updating progress for ${lessonKey}:`, error);
      }
    }
  };

  const handleVideoCompletion = async (
    lessonKey: string,
    setPoints: (points: number) => void,
    setVideo: (show: boolean) => void,
    setViewed: (viewed: boolean) => void,
    currentPoints: number,
    pointsToAdd: number
  ) => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      try {
        const progressRef = doc(db, 'userProgress', userId);
        const progressSnap = await getDoc(progressRef);
        const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

        if (currentPoints === 0) {
          await setDoc(
            progressRef,
            {
              task1: {
                ...prev,
                [lessonKey]: pointsToAdd,
              },
            },
            { merge: true }
          );

          setPoints(pointsToAdd);
          setTask1Points((prev) => {
            const newTotal = prev + pointsToAdd;
            if (newTotal === maxPoints && !congratsShown) {
              setShowCongratsModal(true);
            }
            return newTotal;
          });
        }

        setVideo(false);
        setViewed(true);
      } catch (error) {
        console.error(`Error updating video progress for ${lessonKey}:`, error);
      }
    }
  };

  const handleLesson1Click = () => {
    handleModuleCompletion(
      'lesson1',
      setLesson1Points,
      setShowLesson1Details,
      setLesson1Viewed,
      lesson1Points,
      14
    );
  };

  const handleLesson12Click = () => {
    handleModuleCompletion(
      'lesson12',
      setLesson12Points,
      setShowLesson12Details,
      setLesson12Viewed,
      lesson12Points,
      14
    );
  };

  const handleLesson13Click = () => {
    setShowLesson13Video(true);
    if (!lesson13Points) {
      handleVideoCompletion(
        'lesson13',
        setLesson13Points,
        setShowLesson13Video,
        setLesson13Viewed,
        lesson13Points,
        14
      );
    }
  };

  const handleLesson14Click = () => {
    setShowLesson14Video(true);
    if (!lesson14Points) {
      handleVideoCompletion(
        'lesson14',
        setLesson14Points,
        setShowLesson14Video,
        setLesson14Viewed,
        lesson14Points,
        14
      );
    }
  };

  const handleLesson15Click = () => {
    setShowLesson15Video(true);
    if (!lesson15Points) {
      handleVideoCompletion(
        'lesson15',
        setLesson15Points,
        setShowLesson15Video,
        setLesson15Viewed,
        lesson15Points,
        14
      );
    }
  };

  const handleLesson16Click = () => {
    setShowLesson16Video(true);
    if (!lesson16Points) {
      handleVideoCompletion(
        'lesson16',
        setLesson16Points,
        setShowLesson16Video,
        setLesson16Viewed,
        lesson16Points,
        14
      );
    }
  };

  const handleLesson17Click = () => {
    setShowLesson17Video(true);
    if (!lesson17Points) {
      handleVideoCompletion(
        'lesson17',
        setLesson17Points,
        setShowLesson17Video,
        setLesson17Viewed,
        lesson17Points,
        16
      );
    }
  };

  const handleSeeMore = () => {
    setShowMore(true);
  };

  const handleSeeLess = () => {
    setShowMore(false);
  };

  const handleContinue = async () => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      try {
        const progressRef = doc(db, 'userProgress', userId);
        const progressSnap = await getDoc(progressRef);
        const prev = progressSnap.exists() ? progressSnap.data().task1 || {} : {};

        await setDoc(
          progressRef,
          {
            task1: {
              ...prev,
              congratsShown: true,
            },
          },
          { merge: true }
        );

        setCongratsShown(true);
      } catch (error) {
        console.error('Error updating congratsShown:', error);
      }
    }

    setShowCongratsModal(false);
    navigation.navigate('PatternDraftingScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.profile}>
          <Ionicons name="person-outline" size={24} color="#000000" />
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={require('../assets/Blouse.png')}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Blouse</Text>
          <View style={styles.cardStats}>
            <Text style={styles.cardStatsText}>{task1Points} pts</Text>
            <Text style={styles.cardStatsText}>⭐ 4.3</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(task1Points / maxPoints) * 100}%`,
                  backgroundColor: task1Points === maxPoints ? '#28a745' : '#0275d8',
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Course Content</Text>

      <TouchableOpacity onPress={handleLesson1Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>1</Text>
        </View>
        <Text style={styles.lessonTitle}>Front and Back Bodice Pattern</Text>
        {lesson1Points > 0 || lesson1Viewed ? (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        ) : (
          <Ionicons name="book-outline" size={28} color="#000" />
        )}
      </TouchableOpacity>

      {showLesson1Details && (
        <Modal
          visible={showLesson1Details}
          animationType="slide"
          onRequestClose={() => setShowLesson1Details(false)}
        >
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40, backgroundColor: '#FFFFFF' }}>
            <TouchableOpacity
              onPress={() => setShowLesson1Details(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Front and Back Bodice Pattern</Text>
            <Text style={styles.modalSectionTitle}>Objectives:</Text>
            <Text style={styles.modalText}>
              a. Enumerate the measurements needed for drafting front and back
              bodice patterns.
            </Text>
            <Text style={styles.modalText}>
              b. Apply the exact measurements in drafting bodice patterns.
            </Text>
            <Text style={styles.modalText}>
              c. Demonstrate accurate drafting of front and back bodice patterns.
            </Text>
            <Text style={styles.modalSectionTitle}>Introduction:</Text>
            <Text style={styles.modalText}>
              Drafting front and back bodice patterns involves extending
              construction lines, adjusting for body shape, and adding allowances
              for fit and comfort.
            </Text>
            <Text style={styles.modalSectionTitle}>Measurements Needed:</Text>
            <Text style={styles.modalText}>- Figure Front and Back</Text>
            <Text style={styles.modalText}>- Shoulder</Text>
            <Text style={styles.modalText}>- Bust Circumference</Text>
            <Text style={styles.modalText}>- Waistline</Text>
            <Text style={styles.modalText}>- Bust Height</Text>
            <Text style={styles.modalText}>- Bust Distance</Text>
            <Text style={styles.modalSectionTitle}>
              Drafting Materials Needed:
            </Text>
            <Text style={styles.modalText}>
              - French curve (for neckline and armhole)
            </Text>
            <Text style={styles.modalText}>
              - Hip curve (for hemline and hips)
            </Text>
            <Text style={styles.modalText}>- Tape measure</Text>
            <Text style={styles.modalSectionTitle}>Procedure:</Text>
            <Text style={styles.modalText}>
              Follow the steps from the previous bodice drafting tutorials,
              combining front and back measurements as shown in the
              illustrations.
            </Text>
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/Ptrnfrontbod.jpg')}
                style={styles.modalImage}
              />
            </TouchableOpacity>
            <ImageViewing
              images={[
                {
                  uri: Image.resolveAssetSource(
                    require('../assets/Ptrnfrontbod.jpg')
                  ).uri,
                },
              ]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </ScrollView>
        </Modal>
      )}

      <TouchableOpacity onPress={handleLesson12Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>1.2</Text>
        </View>
        <Text style={styles.lessonTitle}>Sleeve and Collar Pattern</Text>
        {lesson12Points > 0 || lesson12Viewed ? (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        ) : (
          <Ionicons name="book-outline" size={28} color="#000" />
        )}
      </TouchableOpacity>

      {showLesson12Details && (
        <Modal
          visible={showLesson12Details}
          animationType="slide"
          onRequestClose={() => setShowLesson12Details(false)}
        >
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40, backgroundColor: '#FFFFFF' }}>
            <TouchableOpacity
              onPress={() => setShowLesson12Details(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sleeve and Collar Pattern</Text>
            <Text style={styles.modalSectionTitle}>Procedure:</Text>
            <Text style={styles.modalText}>a = Initial point</Text>
            <Text style={styles.modalText}>
              a-b = 1/3 of the armhole measurement minus 1 cm
            </Text>
            <Text style={styles.modalText}>a-c = Length measurement of sleeves</Text>
            <Text style={styles.modalText}>d = Armhole measurement of the back</Text>
            <Text style={styles.modalText}>
              a-e = Armhole measurement of the front
            </Text>
            <Text style={styles.modalText}>= Connect line d, b, and c</Text>
            <Text style={styles.modalText}>
              = Measure b-c, then match d-f₁ and e-g₁
            </Text>
            <Text style={styles.modalText}>
              f₁-f₂ = (Upper arm girth - lower arm girth) / 2, connect d-f₂
            </Text>
            <Text style={styles.modalText}>
              g₁-g₂ = (Upper arm girth - lower arm girth) / 2, connect e-g₂
            </Text>
            <Text style={styles.modalSectionTitle}>
              To obtain the armhole shape:
            </Text>
            <Text style={styles.modalText}>
              - Divide a-d into 4 parts, note points 1, 2, 3
            </Text>
            <Text style={styles.modalText}>
              - Divide a-e into 4 parts, note points 4, 5, 6
            </Text>
            <Text style={styles.modalText}>
              - 1 = middle of d-1, measure 0.5 cm down
            </Text>
            <Text style={styles.modalText}>- 3 = measure 1.75 cm up</Text>
            <Text style={styles.modalText}>- 4 = measure 1.75 cm up</Text>
            <Text style={styles.modalText}>- 5₁ = center of 5 and 6</Text>
            <Text style={styles.modalText}>
              - 6₁ = center of 6 and e, mark 1 cm down
            </Text>
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image
                source={require('../assets/PtrnSleeveSloper.png')}
                style={styles.modalImage}
              />
            </TouchableOpacity>
            <ImageViewing
              images={[
                {
                  uri: Image.resolveAssetSource(
                    require('../assets/PtrnSleeveSloper.png')
                  ).uri,
                },
              ]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </ScrollView>
        </Modal>
      )}

      <TouchableOpacity onPress={handleLesson13Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>1.3</Text>
        </View>
        <Text style={styles.lessonTitle}>Video - Patterning Front & Back Bodice</Text>
        <TouchableOpacity onPress={() => setShowLesson13Video(true)}>
          <Ionicons
            name={lesson13Viewed ? "checkmark-circle" : "play-circle-outline"}
            size={28}
            color={lesson13Viewed ? "green" : "#000"}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {showLesson13Video && (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://youtu.be/0WVOhnq1cro' }}
            javaScriptEnabled
            onLoad={() => {
              setTimeout(() => {
                handleVideoCompletion(
                  'lesson13',
                  setLesson13Points,
                  setShowLesson13Video,
                  setLesson13Viewed,
                  lesson13Points,
                  14
                );
              }, 40000);
            }}
          />
        </View>
      )}

      <TouchableOpacity onPress={handleLesson14Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>1.4</Text>
        </View>
        <Text style={styles.lessonTitle}>Video - Patterning Sleeves and Collar</Text>
        <TouchableOpacity onPress={() => setShowLesson14Video(true)}>
          <Ionicons
            name={lesson14Viewed ? "checkmark-circle" : "play-circle-outline"}
            size={28}
            color={lesson14Viewed ? "green" : "#000"}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {showLesson14Video && (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://youtu.be/0WVOhnq1cro' }}
            javaScriptEnabled
            onLoad={() => {
              setTimeout(() => {
                handleVideoCompletion(
                  'lesson14',
                  setLesson14Points,
                  setShowLesson14Video,
                  setLesson14Viewed,
                  lesson14Points,
                  14
                );
              }, 40000);
            }}
          />
        </View>
      )}

      <TouchableOpacity onPress={handleLesson15Click} style={styles.lessonItem}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>1.5</Text>
        </View>
        <Text style={styles.lessonTitle}>Video - Layout and Cut</Text>
        <TouchableOpacity onPress={() => setShowLesson15Video(true)}>
          <Ionicons
            name={lesson15Viewed ? "checkmark-circle" : "play-circle-outline"}
            size={28}
            color={lesson15Viewed ? "green" : "#000"}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {showLesson15Video && (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://youtu.be/0WVOhnq1cro' }}
            javaScriptEnabled
            onLoad={() => {
              setTimeout(() => {
                handleVideoCompletion(
                  'lesson15',
                  setLesson15Points,
                  setShowLesson15Video,
                  setLesson15Viewed,
                  lesson15Points,
                  14
                );
              }, 40000);
            }}
          />
        </View>
      )}

      {showMore && (
        <TouchableOpacity onPress={handleLesson16Click} style={styles.lessonItem}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>1.6</Text>
          </View>
          <Text style={styles.lessonTitle}>Video - Sewing</Text>
          <TouchableOpacity onPress={() => setShowLesson16Video(true)}>
            <Ionicons
              name={lesson16Viewed ? "checkmark-circle" : "play-circle-outline"}
              size={28}
              color={lesson16Viewed ? "green" : "#000"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {showLesson16Video && (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://youtu.be/0WVOhnq1cro' }}
            javaScriptEnabled
            onLoad={() => {
              setTimeout(() => {
                handleVideoCompletion(
                  'lesson16',
                  setLesson16Points,
                  setShowLesson16Video,
                  setLesson16Viewed,
                  lesson16Points,
                  14
                );
              }, 40000);
            }}
          />
        </View>
      )}

      {showMore && (
        <TouchableOpacity onPress={handleLesson17Click} style={styles.lessonItem}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>1.7</Text>
          </View>
          <Text style={styles.lessonTitle}>Video - Finishing Touches</Text>
          <TouchableOpacity onPress={() => setShowLesson17Video(true)}>
            <Ionicons
              name={lesson17Viewed ? "checkmark-circle" : "play-circle-outline"}
              size={28}
              color={lesson17Viewed ? "green" : "#000"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {showLesson17Video && (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://youtu.be/0WVOhnq1cro' }}
            javaScriptEnabled
            onLoad={() => {
              setTimeout(() => {
                handleVideoCompletion(
                  'lesson17',
                  setLesson17Points,
                  setShowLesson17Video,
                  setLesson17Viewed,
                  lesson17Points,
                  16
                );
              }, 40000);
            }}
          />
        </View>
      )}

      {showMore ? (
        <TouchableOpacity onPress={handleSeeLess}>
          <Text style={styles.seeMore}>See Less</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCongratsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCongratsModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.congratsModalContainer}>
            <Text style={styles.congratsTitle}>
              Congratulations on completing Blouse!
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Overview:</Text>
      <Text style={styles.overviewText}>
        Learn how to create a blouse from scratch through pattern drafting,
        cutting, sewing, and finishing. This course covers essential techniques
        for drafting front and back bodice patterns, sleeves, and collars,
        followed by practical video tutorials on layout, cutting, sewing, and
        adding finishing touches. Perfect for beginners aiming to master garment
        construction.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // White background
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
// Dark gray background for header
    borderRadius: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for card
    borderRadius: 16,
    padding: 12,
    elevation: 2, // Add shadow for better contrast on white background
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#1E1E1E', // Dark text for readability
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  cardStatsText: {
    color: '#444', // Dark gray text for stats
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5', // Light gray background for progress bar
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#1E1E1E', // Dark text for section titles
  },
  lessonItem: {
    backgroundColor: '#FFFFFF', // White background for lesson items
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1, // Subtle shadow for contrast
  },
  lessonNumber: {
    backgroundColor: '#F0F0F0', // Light gray background for lesson number
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  lessonNumberText: {
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1E1E1E', // Dark text for lesson titles
  },
  seeMore: {
    textAlign: 'center',
    color: '#0275d8', // Keep the blue for "See More/Less" link
    marginVertical: 10,
  },
  overviewText: {
    fontSize: 13,
    color: '#444', // Dark gray text for overview
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: '#E5E5E5', // Light gray background for close button
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
    color: '#1E1E1E',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1E1E1E',
  },
  modalText: {
    marginBottom: 5,
    color: '#444', // Dark gray text in modals
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginTop: 15,
    resizeMode: 'contain',
  },
  videoContainer: {
    height: 300,
    marginBottom: 20,
    backgroundColor: '#000', // Black background for video container
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsModalContainer: {
    backgroundColor: '#FFFFFF', // White background for congrats modal
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E1E1E',
  },
  continueButton: {
    backgroundColor: '#0275d8', // Keep the blue for the continue button
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseScreen;