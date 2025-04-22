import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Authentication/Auth'; // update this path if needed
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Authentication/App';

type LearningScreenProp = StackNavigationProp<RootStackParamList, 'Learning'>;
const db = getFirestore();
const courses = [
    {
        title: 'pattern drafting tutorials',
        image: require('../assets/Task1.png'),
        screen: 'PatternDraftingScreen',
        Description: 'Learn how to create sewing patterns for garments from scratch.'
    },
    {
        title: 'How to layout & cut',
        image: require('../assets/Task2.png'),
        screen: 'LayoutCutScreen',
        Description: 'Understand fabric grain lines and how to properly lay and cut patterns.'
    },
    {
        title: 'How to put threads in sewing machine',
        image: require('../assets/Task3.png'),
        screen: 'ThreatsSewingScreen',
        Description: 'A beginner’s guide to threading your sewing machine step-by-step.'
    },
    {
        title: 'Parts of sewing machine',
        image: require('../assets/Task4.png'),
        screen: 'SewingMachinePartsScreen',
        Description: 'Get familiar with the essential parts and functions of a sewing machine.'
    },
];


const LearningScreen = () => {
    const navigation = useNavigation<LearningScreenProp>();
    const [activeTab, setActiveTab] = useState('In progress');
    const [username, setUsername] = useState('');
    const [uid, setUid] = useState<string | null>(null); // To store UID
    const [points, setPoints] = useState<number | null>(null);
    const [userCourses, setUserCourses] = useState<any>({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);

                // Fetch username from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUsername(userData.username || '');
                        setPoints(userData.points ?? 0);
                        setUserCourses(userData.courses || {}); // Assuming 'username' field
                    } else {
                        console.log('No such user doc!');
                    }
                } catch (error) {
                    console.log('Error fetching user data:', error);
                }
            } else {
                setUid(null);
            }
        });

        return unsubscribe;
    }, []);

    const handleCoursePress = (courseTitle: string) => {
        // Navigate to the course screen
        navigation.navigate(courseTitle); // Navigate dynamically to the course screen
    };

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.heading}>What do you want {username ? `, ${username}` : ''}{'\n'} to learn today?</Text>

            <View style={styles.tabs}>
                {['In progress', 'Explore', 'Finished'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={activeTab === tab ? styles.activeTab : styles.tab}
                    >
                        <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {courses.map((course, index) => (
                   <TouchableOpacity
                   key={index}
                   style={styles.courseCard}
                   onPress={() => handleCoursePress(course.screen)} // Navigate to specific course screen
               >
                   <View style={styles.courseInfo}>
                       <View>
                           <Text style={styles.courseTitle}>{course.title}</Text>
                           <View style={styles.progressSection}>
                               <View style={styles.progressRow}>
                                   <View style={styles.progressBarTrack}>
                                       <View
                                           style={[
                                               styles.progressBarFill,
                                               {
                                                   width: `${userCourses[course.title]?.points ?? 0}%`,
                                                   backgroundColor: (userCourses[course.title]?.points ?? 0) >= 100 ? 'green' : '#3B82F6',
                                               },
                                           ]}
                                       />
                                   </View>
                                   <Text style={styles.percentText}>{userCourses[course.title]?.points ?? 0}%</Text>
                               </View>

                               {course.Description && (
                                   <Text style={styles.courseDescription}>{course.Description}</Text>
                               )}
                           </View>
                       </View>
                       <Image source={course.image} style={styles.avatar} />
                   </View>
               </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.bottomNav}>
                <Ionicons name="home-outline" size={24} color="black" />
                <Ionicons name="book-outline" size={24} color="gray" />
                <Ionicons name="person-outline" size={24} color="gray" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6EDF6',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#1E1E1E'
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tab: {
        paddingBottom: 4,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#9D4EDD',
        paddingBottom: 4,
    },
    tabText: {
        color: '#888',
    },
    activeTabText: {
        color: '#1E1E1E',
        fontWeight: 'bold',
    },
    scrollView: {
        paddingBottom: 100,
    },
    courseCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    courseInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        textTransform: 'capitalize'
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
        marginRight: 6,
    },
    percent: {
        color: '#3B82F6',
        fontSize: 12,
    },
    continueBtn: {
        backgroundColor: '#1E1E1E',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    continueText: {
        color: 'white',
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: 'white',
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // optional spacing between bar and %
    },

    progressSection: {
        marginBottom: 8,
    },
    progressBarTrack: {
        height: 10,
        width: 100,
        backgroundColor: '#E5E5E5',
        borderRadius: 5,
        overflow: 'hidden',
    },

    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },

    percentText: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '500',
    },

    courseDescription: {
        fontSize: 12,
        color: '#444',
        marginTop: 2,
        maxWidth: 220,
    },
});

export default LearningScreen;
