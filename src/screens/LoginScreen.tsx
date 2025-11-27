import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

type Props = {
    onSuccess: () => void;
};

export default function LoginScreen({ onSuccess }: Props) {
    return (
        <View>
            <Text>Login formulier hier</Text>
            <Button title="Inloggen" onPress={onSuccess} />
        </View>
    );
}
