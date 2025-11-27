import React, {useState} from 'react';
import {Modal, View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import {deleteOfflinePack, downloadTMBMap} from '../../utils/offlineMapbox';
import * as Network from 'expo-network';

export default function MapOfflinePopup() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [downloadMessage, setDownloadMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleDownload = async () => {
        setIsDownloading(true);
        setErrorMessage('');
        setProgress(0);

        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected || !networkState.isInternetReachable) {
            setIsDownloading(false);
            setErrorMessage('No internet connection. Please connect and try again.');
            setTimeout(() => setErrorMessage(''), 4000);
            return;
        }

        downloadTMBMap(
            setProgress,
            () => {
                console.log('Download complete');
                setIsDownloading(false);
                setDownloadMessage('Download complete');
                setTimeout(() => setDownloadMessage(''), 3000);
            },
            (err) => {
                setIsDownloading(false);
                console.error('Download error:', err);
                setErrorMessage('Download failed. Please try again.');
                setTimeout(() => setErrorMessage(''), 4000);
            }
        );
    };

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.iconButton}>
                <Ionicons name="map-outline" size={24} color="black"/>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text style={styles.title}>Offline map</Text>

                        <Button title="⬇️ Download TMB" onPress={handleDownload}/>
                        <View style={{marginTop: 10}}/>
                        <Button
                            title="🗑️ Delete map"
                            color="red"
                            onPress={async () => {
                                await deleteOfflinePack();
                                setDeleteMessage('✅ Offline map deleted');
                                setTimeout(() => setDeleteMessage(''), 3000);
                                setProgress(0);
                                setIsDownloading(false);
                            }}
                        />

                        {progress > 0 && (
                            <View style={{marginTop: 20, alignItems: 'center'}}>
                                <Progress.Bar progress={progress / 100} width={200}/>
                                <Text>{progress.toFixed(1)}%</Text>
                            </View>
                        )}
                        {!isDownloading && progress === 100 && (
                            <Text style={{marginTop: 10, color: 'green'}}>✅ Download complete</Text>
                        )}
                        {deleteMessage !== '' && (
                            <Text style={{marginTop: 10, color: 'green'}}>{deleteMessage}</Text>
                        )}
                        {errorMessage !== '' && (
                            <Text style={{marginTop: 10, color: 'red', textAlign: 'center'}}>
                                {errorMessage}
                            </Text>
                        )}

                        <View style={{marginTop: 20}}>
                            <Button
                                title="Close"
                                onPress={() => {
                                    setVisible(false);
                                    setProgress(0);
                                    setIsDownloading(false);
                                    setDeleteMessage('');
                                    setDownloadMessage('');
                                    setErrorMessage('');
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        padding: 10,
        marginRight: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: 280,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
    },
});
