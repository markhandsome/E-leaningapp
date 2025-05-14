import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Authentication/Auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Authentication/App';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import * as firebase from 'firebase/app';

type LearningScreenProp = StackNavigationProp<RootStackParamList, 'Learning'>;

const db = getFirestore();
const courses = [
    {
        title: 'Blouse',
        image: require('../assets/Blouse.png'),
        screen: 'PatternDraftingScreen',
        Description: 'Learn how to create sewing patterns for garments from scratch.'
    },
    {
        title: 'Pants',
        image: require('../assets/Pants.png'),
        screen: 'LayoutCutScreen',
        Description: 'Understand fabric grain lines and how to properly lay and cut patterns.'
    },
    {
        title: 'Skirt',
        image: require('../assets/Skirt.png'),
        screen: 'ThreatsSewingScreen',
        Description: 'A beginner’s guide to threading your sewing machine step-by-step.'
    },
];

// Define points per lesson for each course
const coursePointsConfig: Record<string, { lessonPoints: number[], totalPoints: number }> = {
    Blouse: {
        lessonPoints: [14, 14, 14, 14, 14, 14, 16],
        totalPoints: 100,
    },
    Pants: {
        lessonPoints: Array(7).fill(14),
        totalPoints: 98,
    },
    Skirt: {
        lessonPoints: Array(7).fill(14),
        totalPoints: 98,
    },
};

const LearningScreen = () => {
    const [authLoading, setAuthLoading] = useState(true);
    const navigation = useNavigation<LearningScreenProp>();
    const [activeTab, setActiveTab] = useState('In progress');
    const [username, setUsername] = useState('');
    const [uid, setUid] = useState<string | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [userCourses, setUserCourses] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUid(user.uid);
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setUsername(userData.username || '');
                            setPoints(userData.points ?? 0);
                        }

                        const progressDoc = await getDoc(doc(db, 'userProgress', user.uid));
                        const courseProgress: any = {};

                        courses.forEach(course => {
                            courseProgress[course.title] = { points: 0 };
                        });

                        if (progressDoc.exists()) {
                            const progressData = progressDoc.data();
                            const taskToCourseTitleMap: Record<string, string> = {
                                task1: 'Blouse',
                                task2: 'Pants',
                                task3: 'Skirt',
                                task4: 'Parts of sewing machine',
                            };

                            Object.entries(taskToCourseTitleMap).forEach(([taskKey, courseTitle]) => {
                                const taskData = progressData[taskKey];
                                if (taskData && typeof taskData === 'object' && courseProgress.hasOwnProperty(courseTitle)) {
                                    const lessons = Object.values(taskData).filter(val => typeof val === 'number');
                                    const completedLessons = lessons.reduce((sum: number, val: number) => sum + val, 0);
                                    const config = coursePointsConfig[courseTitle] || { totalPoints: 100 };
                                    const progressPercent = config.totalPoints > 0 
                                        ? Math.round((completedLessons / config.totalPoints) * 100)
                                        : 0;
                                    courseProgress[courseTitle] = { 
                                        points: Math.min(100, Math.max(0, progressPercent))
                                    };
                                }
                            });
                        }

                        setUserCourses(courseProgress);
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        const defaultProgress: any = {};
                        courses.forEach(course => {
                            defaultProgress[course.title] = { points: 0 };
                        });
                        setUserCourses(defaultProgress);
                    }
                } else {
                    setUid(null);
                    const defaultProgress: any = {};
                    courses.forEach(course => {
                        defaultProgress[course.title] = { points: 0 };
                    });
                    setUserCourses(defaultProgress);
                }

                setAuthLoading(false);
            });
            return () => unsubscribe();
        }, [])
    );

    const handleCoursePress = (courseTitle: string) => {
        navigation.navigate(courseTitle);
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Section with Dark Gray Background */}
            <View style={styles.topSection}>
                <View style={styles.header}>
                    <Text style={styles.heading}>What do you want {username ? `, ${username}` : ''}{'\n'} to learn today?</Text>
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Ionicons name="person-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

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

                {/* Search Box */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#B0B0B0"
                    />
                    <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
                </View>
            </View>

            {/* Course List */}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {filteredCourses
                    .filter((course) => {
                        const progress = userCourses[course.title]?.points ?? 0;
                        if (activeTab === 'In progress') return progress > 0 && progress < 100;
                        if (activeTab === 'Finished') return progress >= 100;
                        return true;
                    })
                    .map((course, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.courseCard}
                            onPress={() => handleCoursePress(course.screen)}
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
                                                            backgroundColor:
                                                                (userCourses[course.title]?.points ?? 0) >= 100
                                                                    ? 'green'
                                                                    : '#3B82F6',
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.percentText}>
                                                {userCourses[course.title]?.points ?? 0}%
                                            </Text>
                                        </View>
                                        {course.Description && (
                                            <Text style={styles.courseDescription}>{course.Description}</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.imageContainer}>
                                    <Image source={course.image} style={styles.avatar} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background for the main screen
    },
    topSection: {
        backgroundColor: '#333333', // Dark gray background for the top section
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text to contrast with dark gray background
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    tab: {
        paddingBottom: 4,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#ffffff',
        paddingBottom: 4,
    },
    tabText: {
        color: '#BBBBBB', // Light gray text for inactive tabs
    },
    activeTabText: {
        color: '#FFFFFF', // White text for active tab
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        color: '#000',
        fontSize: 16,
    },
    searchIcon: {
        marginLeft: 10,
    },
    scrollView: {
        paddingHorizontal: 16,
        paddingBottom: 20,
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
        textTransform: 'capitalize',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    avatar: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
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