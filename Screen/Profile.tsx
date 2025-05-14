import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updateEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../Authentication/Auth';
import { RootStackParamList } from '../Authentication/App';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsername(data.username || '');
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || user.email || '');
            setProfileImage(data.profileImage || null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load profile data.');
        }
      };

      fetchUserData();
    }
  }, [auth]);

  // Handle image upload from gallery
  const handleImageUpload = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setLoading(true);
      const imageUri = result.assets[0].uri;
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      // Update Firestore with image URL
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { profileImage: downloadURL }, { merge: true });

      setProfileImage(downloadURL);
      Alert.alert('Success', 'Profile image updated.');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  // Handle save changes
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      // Update Firebase Authentication
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          profileImage: profileImage || null,
        },
        { merge: true }
      );

      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Error', 'Invalid email address.');
          break;
        case 'auth/requires-recent-login':
          Alert.alert('Error', 'Please log out and log in again to update your email.');
          break;
        default:
          Alert.alert('Error', 'Failed to update profile.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.profileContainer}>
            <TouchableOpacity
              onPress={handleImageUpload}
              disabled={loading}
              style={styles.imageContainer}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={50} color="#555555" />
                </View>
              )}
              <View style={styles.editIcon}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            {loading && <Text style={styles.loadingText}>Uploading...</Text>}
          </View>

          <Text style={styles.placeholders}>Username</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#F5F5F5' }]}
            value={username}
            editable={false}
            placeholder="Username"
            placeholderTextColor="#555555"
          />

          <Text style={styles.placeholders}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            editable={isEditing}
            placeholder="First Name"
            placeholderTextColor="#555555"
          />

          <Text style={styles.placeholders}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            editable={isEditing}
            placeholder="Last Name"
            placeholderTextColor="#555555"
          />

          <Text style={styles.placeholders}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#555555"
          />

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={toggleEdit}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={toggleEdit}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    alignItems: 'center',
    paddingTop: 80,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Dark gray
  },
  placeholder: {
    width: 24,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#333333', // Dark gray border
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5', // Light gray
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333', // Dark gray border
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333333', // Dark gray
    borderRadius: 12,
    padding: 4,
  },
  loadingText: {
    marginTop: 10,
    color: '#333333', // Dark gray
    fontSize: 14,
  },
  placeholders: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 2,
    fontSize: 18,
    textAlign: 'left',
    marginTop: 10,
    color: '#333333', // Dark gray
  },
  input: {
    backgroundColor: '#F5F5F5', // Light gray
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    color: '#333333', // Dark gray text
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#333333', // Dark gray
  },
  saveButton: {
    backgroundColor: '#4A4A4A', // Slightly lighter gray
  },
  cancelButton: {
    backgroundColor: '#666666', // Medium gray
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;