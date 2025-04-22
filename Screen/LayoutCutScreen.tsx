import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use other icons depending on your setup
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Authentication/App';
import { useNavigation } from '@react-navigation/native';

type LayoutCutScreen = StackNavigationProp<RootStackParamList, 'LayoutCutScreen'>;
const CourseScreen = () => {

    const navigation = useNavigation<LayoutCutScreen>();
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>
  <View style={styles.profile}>
    <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
  </View>
</View>

      {/* Course Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300?img=5' }}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>layout cut</Text>
          <View style={styles.cardStats}>
            <Text>12k</Text>
            <Text>⭐ 4.3</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      {/* Course Content */}
      <Text style={styles.sectionTitle}>Course Content</Text>
      {Array(4).fill(0).map((_, index) => (
        <View key={index} style={styles.lessonItem}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>01</Text>
          </View>
          <Text style={styles.lessonTitle}>Lesson 1: Drafting tools</Text>
          <TouchableOpacity>
            <Ionicons name="play-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Overview */}
      <TouchableOpacity>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Overview:</Text>
      <Text style={styles.overviewText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6eff7',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  card: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
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
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0275d8',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  lessonItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lessonNumber: {
    backgroundColor: '#f6eff7',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  lessonNumberText: {
    fontWeight: 'bold',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 14,
  },
  seeMore: {
    textAlign: 'center',
    color: '#0275d8',
    marginVertical: 10,
  },
  overviewText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
});

export default CourseScreen;
