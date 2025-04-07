import React from "react";
import { StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Premium color palette
const colors = {
  primary: "#008080",       // Classic teal (main CTA and highlight)
  secondary: "#00B2A9",     // Bright turquoise-blue (accent)
  background: "#E6F2F3",    // Soft teal-tinted background
  card: "#FFFFFF",          // Clean white for cards
  textPrimary: "#003B4A",   // Deep blue-teal for high contrast text
  textSecondary: "#5E7B7B", // Muted slate teal for subtext
  accent: "#66D3CF",        // Soft aqua for highlights
  emergency: "#FF6B6B",     // Coral red for alerts
  border: "#C2E0E0"         // Pale teal for card borders
};



// Main container
const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
  padding: 24px;
`;

// Branding header with enhanced logo
const BrandHeader = styled.View`
  align-items: center;
  margin-bottom: 16px;
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  shadow-color: rgba(0,0,0,0.1);
  shadow-opacity: 0.8;
  shadow-radius: 15px;
  shadow-offset: 0px 5px;
  elevation: 5;
`;

const BrandLogo = styled.Image`
  width: 250px;
  height: 100px;
  margin-bottom: 12px;
  resize-mode: contain;
`;

const BrandTagline = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-top: 8px;
`;

// Header section
const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 28px;
`;

const Header = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const SubHeader = styled.Text`
  font-size: 18px;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: 26px;
  max-width: 320px;
  letter-spacing: 0.3px;
`;

// Stats cards
const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const StatCard = styled.View`
  width: 48%;
  padding: 20px;
  border-radius: 16px;
  background-color: ${colors.card};
  shadow-color: rgba(0,0,0,0.08);
  shadow-opacity: 1;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  elevation: 4;
  border-width: 1px;
  border-color: ${colors.border};
`;

const StatValue = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${colors.primary};
  margin-bottom: 6px;
`;

const StatLabel = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  letter-spacing: 0.3px;
`;

// Feature card
const FeatureCard = styled.View`
  width: 100%;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 18px;
  background-color: ${colors.card};
  shadow-color: rgba(0,0,0,0.1);
  shadow-opacity: 0.9;
  shadow-radius: 15px;
  shadow-offset: 0px 6px;
  elevation: 6;
  border-width: 1px;
  border-color: ${colors.border};
`;

const FeatureText = styled.Text`
  font-size: 17px;
  color: ${colors.textPrimary};
  line-height: 26px;
  letter-spacing: 0.3px;
  text-align: center;
`;

// Buttons
const ButtonGrid = styled.View`
  width: 100%;
  margin-top: 12px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  padding: 22px;
  margin-bottom: 18px;
  border-radius: 14px;
  background-color: ${props => 
    props.emergency ? colors.emergency : 
    props.secondary ? colors.secondary : 
    props.accent ? colors.accent : 
    colors.primary};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  shadow-color: ${props => 
    props.emergency ? 'rgba(255, 77, 77, 0.3)' : 
    props.secondary ? 'rgba(74, 108, 247, 0.3)' : 
    props.accent ? 'rgba(255, 159, 28, 0.3)' : 
    'rgba(46, 133, 110, 0.3)'};
  shadow-opacity: 0.9;
  shadow-radius: 10px;
  shadow-offset: 0px 5px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
  letter-spacing: 0.5px;
`;

const IconWrapper = styled.View`
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
`;

export default function Home() {
  const router = useRouter();

  const buttons = [
    { 
      title: "Babysitter Dashboard", 
      route: "/BabySitterDashboard",
      icon: <FontAwesome5 name="user-nurse" size={22} color="white" />,
      primary: true
    }
  ];

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Enhanced Brand Header with bigger logo */}
      <BrandHeader>
        <BrandLogo 
          source={require('../../assets/images/MomTech_Image.png')} 
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        <BrandTagline>Where Moms Meet Trusted Care</BrandTagline>
      </BrandHeader>

      <HeaderContainer>
        <Header>Babysitter Allocation</Header>
        <SubHeader>Premium childcare solutions for modern families</SubHeader>
      </HeaderContainer>

      <StatsContainer>
        <StatCard>
          <StatValue>200+</StatValue>
          <StatLabel>Certified Sitters</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>98%</StatValue>
          <StatLabel>Parent Satisfaction</StatLabel>
        </StatCard>
      </StatsContainer>

      <FeatureCard>
        <FeatureText>
          Connect with trusted, background-checked babysitters in your area through our secure platform designed for modern families.
        </FeatureText>
      </FeatureCard>

      <ButtonGrid>
        {buttons.map((button, index) => (
          <Button
            key={index}
            onPress={() => router.push(button.route)}
            activeOpacity={0.9}
          >
            <IconWrapper>
              {button.icon}
            </IconWrapper>
            <ButtonText>{button.title}</ButtonText>
          </Button>
        ))}
      </ButtonGrid>
    </Container>
  );
}