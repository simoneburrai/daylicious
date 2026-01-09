import { View, Text } from 'react-native';
import "../../global.css"; // Import locale forzato per test

export default function TestPage() {
  return (
    <View className='flex-1 justify-center items-center'>
      <View className="bg-red-500 p-10">
        <Text className="text-white font-extrabold text-4xl">
          index
        </Text>
      </View>
    </View>
  );
}