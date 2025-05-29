import {Image, useColorScheme} from 'react-native'

//images
const LightLogo = require('../assets/images/kachinglogo.png')
const DarkLogo = require('../assets/images/kachinglogo_dark.png')

const ThemedLogo = () => {
    const colorScheme = useColorScheme()

    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

    return (
        <Image source = {logo} 
        {...props}
        />
    )
}

export default ThemedLogo