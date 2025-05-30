import {Image, useColorScheme} from 'react-native'
const LightLogo = require('../assets/images/ka-ching-logo.png')
const DarkLogo = require('../assets/images/kachinglogo_dark.png')


const ThemedLogo = ({...props}) => {
    const colorScheme = useColorScheme()

    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

    return (
        <Image source = {logo} 
        {...props}
        />
    )
}

export default ThemedLogo