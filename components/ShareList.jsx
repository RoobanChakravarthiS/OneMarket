import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';

const ShareListingScreen = ({navigation, route}) => {
  const userId = route.params.userId;
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShare, setSelectedShare] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      const response = await fetch(
        `http://192.168.23.154:1102/shares/farmer/${userId}`,
      );
      const data = await response.json();
      setShares(data);
    } catch (error) {
      console.error('Error fetching shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedShare(item);
        setModalVisible(true);
      }}>
      <View style={styles.headerRow}>
        <Text style={styles.cropName}>
          {item.creater.firstname} {item.creater.lastname}
        </Text>
        <Text
          style={[
            styles.status,
            item.status === 'Pending' ? styles.pending : styles.approved,
          ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.detail}>
        Crop: {item.creater.crops?.[0]?.name || 'N/A'}
      </Text>
      <Text style={styles.detail}>Total Price: ₹{item.total_amount}</Text>
      <Text style={styles.detail}>Shares Available: {item.no_of_shares}</Text>
      <Text style={styles.detail}>Price/Share: ₹{item.cost_of_share}</Text>
      <Text style={styles.detail}>Location: {item.address}</Text>
      <Text style={styles.detail}>Area: {item.area} acres</Text>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Share Details</Text>
            <Text style={styles.modalText}>
              Crop: {selectedShare?.creater.crops?.[0]?.name || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              Total Price: ₹{selectedShare?.total_amount}
            </Text>
            <Text style={styles.modalText}>
              Shares Available: {selectedShare?.no_of_shares}
            </Text>
            <Text style={styles.modalText}>
              Price/Share: ₹{selectedShare?.cost_of_share}
            </Text>
            <Text style={styles.modalText}>
              Location: {selectedShare?.address}
            </Text>
            <Text style={styles.modalText}>
              Area: {selectedShare?.area} acres
            </Text>
            <Text style={styles.modalTitle}>Shareholders</Text>
            {selectedShare?.shareholders?.map((holder, index) => (
              <View key={index} style={styles.shareholderItem}>
                <Text style={styles.modalText}>
                  Name: {holder.firstname} {holder.lastname}
                </Text>
                <Text style={styles.modalText}>
                  Shares Held: {holder.shares_held}
                </Text>
                <Text style={styles.modalText}>
                  Investment: ₹{holder.investment}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Crop Shares</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0D69D7" />
      ) : (
        <FlatList
          data={shares}
          keyExtractor={item => item.share_id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#0D69D7',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D69D7',
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pending: {
    backgroundColor: '#FFB74D',
    color: '#fff',
  },
  approved: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  shareholderItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#0D69D7',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareListingScreen;
