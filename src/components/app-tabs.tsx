import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#F8F0E3"
      iconColor={{ default: '#62584C', selected: '#172116' }}
      indicatorColor="#E2D4C4"
      labelStyle={{
        default: { color: '#62584C', fontWeight: '700' },
        selected: { color: '#172116', fontWeight: '900' },
      }}
      shadowColor="rgba(0, 0, 0, 0.18)"
      disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <Label>Spill</Label>
        <Icon
          src={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Regler</Label>
        <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
