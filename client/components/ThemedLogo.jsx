import {Image, useColorScheme} from 'react-native'

//images
import LightLogo from '@/assets/images/kachinglogo'
import DarkLogo from '@/assets/images/kachinglogo_dark'

const ThemedLogo = () => {
    const colorScheme = useColorScheme()

    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

    return (
        <Image source = {logo} />
    )
}

export default ThemedLogo