'use client';

import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const InsuranceClaim = ({navigation}) => {


    const [insurances, setInsurances] = useState([
        {
            id: '1',
            name: 'Crop Protection Plan',
            coverage: 'Up to $50,000',
            premium: 'Monthly $200',
            description: 'Comprehensive coverage for crop damage',
            image: require('./cropprotection.jpeg'),
        },
        {
            id: '2',
            name: 'Livestock Insurance',
            coverage: 'Up to $30,000',
            premium: 'Monthly $150',
            description: 'Protection for your livestock',
            image: require('./livestock.jpg'),
        },
        {
            id: '3',
            name: 'Farm Equipment Insurance',
            coverage: 'Up to $100,000',
            premium: 'Monthly $300',
            description: 'Coverage for your valuable farm equipment',
            image: require('./equipment.png'),
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState(null);
    const [formData, setFormData] = useState({
        policyType: '',
        coverageAmount: '',
        fullName: '',
        contact: '',
    });

    const toastAnimation = useRef(new Animated.Value(-100)).current;
    const [toastMessage, setToastMessage] = useState('');

    const handleApply = () => {
        setModalVisible(false);
        navigation.navigate('PaymentDone')
        showToast('Application Submitted Successfully!');
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const showToast = (message) => {
        setToastMessage(message);
        Animated.sequence([
            Animated.spring(toastAnimation, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.spring(toastAnimation, {
                toValue: -100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                setSelectedInsurance(item);
                setModalVisible(true);
            }}
        >
            <Image source={item.image} style={styles.cardImage} />
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
            >
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.coverage}>{item.coverage}</Text>
                    <Text style={styles.premium}>{item.premium}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Insurance Plans</Text>
            <FlatList
                data={insurances}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {selectedInsurance?.name}
                            </Text>
                            <Text style={styles.modalDescription}>
                                {selectedInsurance?.description}
                            </Text>
                            <Text style={styles.modalSubtitle}>Apply for Insurance</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Policy Type"
                                placeholderTextColor={'#000'}
                                value={formData.policyType}
                                onChangeText={(text) => handleInputChange('policyType', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#000'}
                                placeholder="Coverage Amount"
                                value={formData.coverageAmount}
                                onChangeText={(text) => handleInputChange('coverageAmount', text)}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#000'}
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChangeText={(text) => handleInputChange('fullName', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#000'}
                                placeholder="Contact"
                                value={formData.contact}
                                onChangeText={(text) => handleInputChange('contact', text)}
                                keyboardType="phone-pad"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonApply]}
                                    onPress={handleApply}
                                >
                                    <Text style={styles.textStyle}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Animated.View
                style={[
                    styles.toastContainer,
                    { transform: [{ translateY: toastAnimation }] },
                ]}
            >
                <Text style={styles.toastText}>{toastMessage}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#287344',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    cardContent: {
        padding: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    coverage: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 2,
    },
    premium: {
        fontSize: 14,
        color: '#ffd700',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: width * 0.9,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#287344',
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#287344',
    },
    input: {
        color:'#000',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        width: '45%',
    },
    buttonApply: {
        backgroundColor: '#287344',
    },
    buttonClose: {
        backgroundColor: '#a9a9a9',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    toastContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: '#5cb85c',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    toastText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default InsuranceClaim;